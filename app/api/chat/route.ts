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
        ? `「${lastUserMessage.slice(0, 60)}」について考えています。`
        : "さっきの話の続きですね。";
      return `${summary}\n\nいまの気持ちをもう少し教えてくれる？具体的な場面やきっかけがあると、一緒に整理しやすいよ。`;
    };

    if (!apiKey) {
      return NextResponse.json({ message: fallbackReply() });
    }

    // Use provided systemPrompt or fall back to default
    const defaultSystemPrompt = `あなたは高校生の進路相談に特化したAI「みかたくん」です。

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

    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;

    let assistantMessage: string | null = null;

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
          max_tokens: 350,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        assistantMessage = data.choices?.[0]?.message?.content || null;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn("OpenAI responded with error status", response.status, errorData);
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }

    if (!assistantMessage) {
      // Fallback response to keep UX smooth when OpenAI/network is unavailable
      return NextResponse.json({ message: fallbackReply() });
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
