import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { session, messages } = await request.json();

    if (!session || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid payload" },
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

    const modeDescription =
      session.moduleKind === "tool"
        ? "セルフワークをガイドする伴走役として、質問と小さな提案をバランスよく返してください。"
        : "対話で考えを深める伴走役として、質問中心で気づきを引き出してください。";

    const systemPrompt = `あなたは高校生の進路相談をサポートするAIコーチ「みかたくん」です。${modeDescription}
- 断定せず、「〜かもしれないね」「どう感じた?」など柔らかい語尾を使う
- 親や周囲の期待と本人の気持ちを分けて確認する
- 一度に質問は2つまで
- 日本語で応答する

セッションテーマ: ${session.title}
補足: ${session.prompt}
関連タグ: ${(session.tags || []).join(", ")}`;

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
    const assistantMessage = data.choices[0]?.message?.content;

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
