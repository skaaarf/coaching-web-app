import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages must be a non-empty array" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Graceful fallback to avoid breaking UI when key is absent
      return NextResponse.json({
        questions: [
          "もう少し詳しく教えてくれる？",
          "その時どう感じたか、覚えている範囲で教えてほしいな"
        ]
      });
    }

    // System prompt for generating follow-up questions
    const systemPrompt = `あなたは会話中のAIアシスタントの発言に対して、ユーザーが返信する内容を提案するAIです。

【重要な原則】
- AIの最後の発言だけを見て、それに対する素直な返答を2つ生成する
- 自然な口語表現で、ユーザーが実際に言いそうな内容にする
- 過去のゲーム結果や他のモジュールの内容は一切参照しない

【応答の作り方】
1. AIが質問している場合：その質問に素直に答える
2. AIが共感・提案している場合：それに対する反応を述べる
3. 文字数：20〜80文字程度（短くてもOK）
4. 表現：自然な話し言葉（「〜です」「〜ます」「〜かな」など）

【出力形式】
必ずJSON形式で2つの応答文を返す：
{"questions": ["応答文1", "応答文2"]}

【良い例】
例1: AIが「今日はどんなことが気になっていますか？」と質問
{"questions": ["将来何がしたいかわからなくて悩んでいます", "大学に行くか就職するか迷っています"]}

例2: AIが「進路について悩んでいるんですね」と共感
{"questions": ["そうなんです、親は大学を勧めるんですけど", "やりたいことが見つからなくて焦ってます"]}

例3: AIが「どんな仕事に興味がありますか？」と質問
{"questions": ["まだはっきりしてないんですが、人と関わる仕事がいいかなと", "安定した仕事がいいなと思ってます"]}

例4: AIが「年収と働きがい、どちらを重視しますか？」と質問
{"questions": ["働きがいの方が大事かなと思います", "年収も大事だけど、楽しく働きたいです"]}

例5: AIが「その選択について、どう感じましたか？」と質問
{"questions": ["意外と安定よりも挑戦を選んでる自分に驚きました", "やっぱり自分は人との繋がりを大事にしてるなと思いました"]}

【避けるべき表現】
❌ 「キャリア形成に影響する」などの硬い表現
❌ 「価値観を見直す」などの抽象的な感想
❌ 会話の文脈と関係ない内容`;

    // Use only recent messages to focus on current conversation context
    // Taking the last 6 messages is enough to understand the immediate context
    const messagesToSend = messages.slice(-6);

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
            { role: "system", content: systemPrompt },
            ...messagesToSend.map((msg: { role: string; content: string }) => ({
              role: msg.role === "user" ? "user" : "assistant",
              content: msg.content,
            })),
            {
              role: "user",
              content: "上記の会話履歴の最後のAI（アシスタント）の発言を確認してください。そのAIの発言に対して、ユーザーが返信しそうな内容を2つ提案してください。\n\n重要：\n- AIの最後の発言だけを見て、素直に答える形で生成してください\n- 自然な話し言葉で、実際のユーザーが言いそうな内容にしてください\n- 過去のゲーム結果や他のモジュールの話は一切含めないでください\n- 20〜80文字程度で、短くてもOKです",
            },
          ],
          temperature: 0.9,
          max_tokens: 300,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn("OpenAI suggest-questions error", response.status, errorData);
      } else {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content) {
          const parsed = JSON.parse(content);
          const questions = parsed.questions;

          if (Array.isArray(questions) && questions.length === 2) {
            return NextResponse.json({ questions });
          }
        }
      }
    } catch (parseError) {
      console.error("Error generating suggested questions:", parseError);
    }

    // Fallback suggestions when OpenAI/network is unavailable
    return NextResponse.json({
      questions: [
        "そのとき何を感じた？",
        "もう少し詳しく聞かせてもらってもいい？"
      ]
    });
  } catch (error) {
    console.error("Error generating suggested questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
