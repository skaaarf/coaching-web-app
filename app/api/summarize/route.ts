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

    const systemPrompt = `あなたは高校生の進路相談をサポートするコーチングAIです。これまでの会話ログから下記のJSON形式だけを出力してください。"session_insight"は今回のトークでの気づきを1文で。"overall_summary"はこれまでの全トークを踏まえた100字以内の最新まとめ。`;

    const conversationDigest = messages
      .map((message: { role: string; content: string }) => {
        const speaker = message.role === "user" ? "ユーザー" : "みかたくん";
        return `${speaker}: ${message.content}`;
      })
      .join("\n");

    const userPrompt = `テーマ: ${session.title}\nタグ: ${(session.tags || []).join(", ")}\nこれまでのまとめ: ${session.insight || ""}\n\n会話ログ:\n${conversationDigest}`;

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
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to summarize session" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;
    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No summary returned" },
        { status: 500 }
      );
    }

    try {
      const parsed = JSON.parse(assistantMessage);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse summary response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error summarizing session", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
