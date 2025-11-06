import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, moduleContext } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages must be a non-empty array" },
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

    // System prompt for generating follow-up questions
    const systemPrompt = `あなたは会話の流れを理解し、ユーザーが次に聞きたくなるような追加質問を提案するAIです。

【役割】
- 会話履歴を分析し、自然な流れで次に聞くべき質問を2つ生成する
- ユーザーの興味や悩みを深掘りする質問を作る
- 具体的で、クリックしやすい短い質問にする

【質問の要件】
- 各質問は30文字以内で簡潔に
- 会話の文脈に沿った自然な質問
- ユーザーの理解を深める質問
- 前向きで対話を促進する内容

【出力形式】
必ず以下のJSON形式で2つの質問を返してください：
{"questions": ["質問1", "質問2"]}

例：
{"questions": ["それについてもっと詳しく教えてもらえる？", "他にも気になることはある？"]}`;

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
          ...messages.slice(-6).map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          })),
          {
            role: "user",
            content: "上記の会話履歴に基づいて、ユーザーが次に聞きたくなるような追加質問を2つ提案してください。",
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
        response_format: { type: "json_object" },
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
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse JSON response
    try {
      const parsed = JSON.parse(content);
      const questions = parsed.questions;

      if (!Array.isArray(questions) || questions.length !== 2) {
        return NextResponse.json(
          { error: "Invalid response format from AI" },
          { status: 500 }
        );
      }

      return NextResponse.json({ questions });
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating suggested questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
