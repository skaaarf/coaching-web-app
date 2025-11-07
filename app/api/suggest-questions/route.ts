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
    const systemPrompt = `あなたは会話の流れを理解し、ユーザーが次に言いたくなるような具体的で考察を含む応答文を提案するAIです。

【役割】
- 会話履歴を分析し、自然な流れで次に送信できる応答文を2つ生成する
- ユーザーの気づきや考察を具体的に代弁する
- 単に質問を繰り返すのではなく、具体的な内容や考えを含む文章にする
- 疑問形ではなく、ユーザーが相手のメッセージに答える形の文章にする

【応答文の要件】
- 各応答文は50〜80文字程度で、具体的な内容を含める
- 会話の文脈に沿った自然な応答
- 疑問形（〜？）ではなく、平叙文で表現する
- ユーザーの立場から具体的な気づきや考えを述べる形式
- 「〜と思いました」「〜だなと感じました」「〜かもしれません」などの表現を使う
- 具体例や理由を含めて、相手にとっても参考になる内容にする

【出力形式】
必ず以下のJSON形式で2つの応答文を返してください：
{"questions": ["応答文1", "応答文2"]}

良い例（具体的な考察を含む）：
{"questions": ["自分は年収よりも意外と生活の質を重視するんだなと気づきました。ワークライフバランスが大事だと感じています", "海外出張で恋人と離れるのは嫌だから、やっぱり海外出張が少ないようなキャリアがいいなと思いました"]}

悪い例（抽象的すぎる）：
{"questions": ["それについてもっと詳しく聞きたいです", "その点について教えてほしいです"]}

悪い例（疑問形）：
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
            content: "上記の会話履歴に基づいて、ユーザーが次に送信したくなるような具体的で考察を含む応答文を2つ提案してください。疑問形ではなく、ユーザーの具体的な気づきや考えを述べる文章として生成してください。50〜80文字程度で、「〜と思いました」「〜だなと感じました」などの表現を使い、具体的な内容を含めてください。",
          },
        ],
        temperature: 0.9,
        max_tokens: 300,
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
