import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages must be an array" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `あなたは高校生の進路相談に特化したAI「みかたくん」です。

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

【NGワード】
- 「大学に行くべき」「行かなくていい」などの断定
- 職業の具体的な指示
- 過度な励まし

常に日本語で応答し、ユーザーの発言を丁寧に受け止めたうえで1〜2つの問いかけを返してください。`;

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
          ...messages.map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to get response from OpenAI" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
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
