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
- ユーザーの具体的な気づきや考察を代弁する
- 抽象的な感想や一般論ではなく、ユーザー自身の具体的な価値観や好みを表現する
- 疑問形ではなく、ユーザーが相手のメッセージに答える形の文章にする

【応答文の要件】
- 各応答文は50〜80文字程度で、具体的な内容を含める
- 「〜と思いました」「〜だなと気づきました」「〜だと感じました」などの表現を使う
- ユーザー自身の価値観・好み・優先順位について具体的に述べる
- 会話の文脈から読み取れる具体的な選択肢や状況に言及する

【絶対に避けるべき表現】
❌ 「キャリア形成に影響する」「今後に活かせる」などの一般的な感想
❌ 「価値観を見直す」「考えるきっかけになった」などの抽象的な表現
❌ 「参考になった」「勉強になった」などの学習的な感想
❌ 具体性のない一般論

【出力形式】
必ず以下のJSON形式で2つの応答文を返してください：
{"questions": ["応答文1", "応答文2"]}

良い例（具体的な価値観や気づき）：
{"questions": ["年収よりも意外と生活の質を重視するんだなと気づきました", "海外出張で恋人と離れるのは嫌だから、海外出張が少ないキャリアがいいなと思いました"]}
{"questions": ["自分は安定よりも挑戦的な環境の方が向いてるかもしれないです", "残業が多くても興味のある仕事の方がモチベーション保てそうだなと感じました"]}
{"questions": ["給料は普通でも、自分のアイデアが活かせる会社の方が魅力的だなと思いました", "有名企業で働くより、自分が成長できる環境を選びたいなと気づきました"]}
{"questions": ["親が喜ぶかよりも、自分が楽しいと感じるかの方が大事だなと思いました", "周りからの評価より、自分の納得感を優先したいなと感じました"]}

悪い例（抽象的すぎる）：
{"questions": ["自分の価値観を見直すことが今後のキャリア形成に影響すると思いました", "今回の結果を今後に活かしていきたいと感じました"]}
{"questions": ["価値観について考えるきっかけになりました", "とても参考になる結果でした"]}`;

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
            content: "上記の会話履歴に基づいて、ユーザーが次に送信したくなるような具体的で考察を含む応答文を2つ提案してください。疑問形ではなく、ユーザーの具体的な気づきや考えを述べる文章として生成してください。50〜80文字程度で、「〜と思いました」「〜だなと気づきました」などの表現を使い、必ず具体的な価値観や選択について言及してください。「キャリア形成」「価値観を見直す」「参考になった」などの抽象的な表現は絶対に使わないでください。",
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
