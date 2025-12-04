import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt } = await request.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages must be an array" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg: { role: string }) => msg.role === "user")?.content;
    const fallbackReply = () => {
      const summary = lastUserMessage
        ? `「${lastUserMessage}」ですね。`
        : "なるほど。";
      return `${summary}\n\nそれについて、もう少し詳しく教えてもらえますか？具体的なエピソードなどがあれば、ぜひ聞かせてください。`;
    };

    if (!apiKey) {
      return NextResponse.json({ message: fallbackReply(), suggested_replies: [] });
    }

    // Use provided systemPrompt or fall back to default
    const defaultSystemPrompt = `あなたは高校生の進路相談に特化したAI「AI進路くん」です。

【役割】
- ユーザーが「大学に行くか行かないか」を考え尽くすことをサポート
- 答えを与えるのではなく、質問を通じて本人に気づかせる
- セッションを重ねるごとに、ユーザーの理解を深める

【対話のルール】
1. レイヤー1(大学に行くか行かないか)に焦点を当てる
2. 「なぜ?」を丁寧に繰り返す
3. 親の期待と本人の気持ちを区別する
4. 具体的なエピソードを聞く
5. いつも前向きで落ち着いたトーンで寄り添う

【トーン】
- 落ち着いていて、寄り添う姿勢
- 決して結論を押し付けない

【会話スタイル】
- 1レスポンスは2〜3文に収め、冗長な説明を避ける
- 各文で必ずキャリア・進路に関する具体的な視点（動機・経験・条件など）に触れる

【NGワード】
- 「大学に行くべき」「行かなくていい」などの断定
- 職業の具体的な指示
- 過度な励まし

常に日本語で応答し、ユーザーの発言を短く要約したうえで、キャリアに関する具体的な観点を一つ提案し、その観点を深掘りする1〜2つの問いかけで締めてください。`;

    const finalSystemPrompt = (systemPrompt || defaultSystemPrompt) + `
    
    # 出力フォーマット（JSON推奨）
    可能であれば以下のJSON形式で出力してください。
    {
      "message": "AIからの返信メッセージ（改行コード\\nを含むテキスト）",
      "suggested_replies": [
        { "label": "ユーザーが返しそうな短い言葉1", "value": "ユーザーが返しそうな短い言葉1" },
        { "label": "ユーザーが返しそうな短い言葉2", "value": "ユーザーが返しそうな短い言葉2" },
        { "label": "ユーザーが返しそうな短い言葉3", "value": "ユーザーが返しそうな短い言葉3" }
      ]
    }
    suggested_repliesは、ユーザーがワンタップで返信できるような、短くて自然な選択肢を3つ提案してください。
    JSON形式での出力が難しい場合は、通常のテキストで返信してください。`;

    let assistantMessage: string | null = null;
    let suggestedReplies: any[] = [];

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: finalSystemPrompt },
            ...messages.map((msg: { role: string; content: string }) => ({
              role: msg.role === "user" ? "user" : "assistant",
              content: msg.content,
            })),
          ],
          temperature: 0.7,
          max_tokens: 450,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || null;
        if (content) {
          try {
            const parsed = JSON.parse(content);
            // Ensure message exists and is not empty
            if (parsed.message && typeof parsed.message === 'string' && parsed.message.trim().length > 0) {
              assistantMessage = parsed.message;
              suggestedReplies = parsed.suggested_replies || [];
            } else {
              // JSON valid but message missing/empty
              console.warn("JSON parsed but message missing or empty:", parsed);
              assistantMessage = null;
            }
          } catch (e) {
            console.error("Failed to parse JSON response", e);
            // If JSON parsing fails, it might be raw text (though we asked for JSON)
            // Or it might be broken JSON.
            // Let's try to use content as message if it looks like text, 
            // but if we asked for JSON, it might include ```json ... ```
            assistantMessage = content.replace(/```json\n?|\n?```/g, '').trim();
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn("OpenAI responded with error status", response.status, errorData);
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }

    if (!assistantMessage) {
      // Fallback response to keep UX smooth when OpenAI/network is unavailable or returns bad data
      return NextResponse.json({
        message: fallbackReply(),
        suggested_replies: []
      });
    }

    return NextResponse.json({ message: assistantMessage, suggested_replies: suggestedReplies });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
