import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { question, answer } = await request.json();

        if (!question || !answer) {
            return NextResponse.json(
                { error: "Missing question or answer" },
                { status: 400 }
            );
        }

        const systemPrompt = `あなたは就職活動のES（エントリーシート）を採点するプロの添削官です。
以下の5つの観点で、学生の回答を厳しくも温かく採点してください。

【評価観点】
1. 構成 (Structure): 結論→背景→行動→結果→学び の流れになっているか
2. 具体性 (Specificity): 数字・固有名詞・状況が入っているか
3. 論理性 (Logic): 話が飛んでいないか、一貫しているか
4. 独自性 (Uniqueness): 誰でも言えそうな内容に終わっていないか
5. 読みやすさ (Readability): 文量・文体・日本語として自然か

【出力フォーマット】
必ず以下のJSON形式で出力してください。
{
  "totalScore": 0〜100の整数,
  "criteriaScores": {
    "structure": 1〜5の整数,
    "specificity": 1〜5の整数,
    "logic": 1〜5の整数,
    "uniqueness": 1〜5の整数,
    "readability": 1〜5の整数
  },
  "goodPoints": ["良かった点1", "良かった点2", "良かった点3"],
  "improvementPoints": ["改善点1", "改善点2", "改善点3"],
  "feedback": "全体的な総評コメント（100文字程度）"
}

【採点基準】
- 良い点・改善点はそれぞれ最大3つまで、具体的かつ簡潔に書いてください。
- totalScoreは、各観点の合計ではなく、ESとしての総合的な完成度で判断してください。
`;

        const userPrompt = `
【質問】
${question}

【回答】
${answer}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error("No content received from OpenAI");
        }

        const parsedContent = JSON.parse(content);

        return NextResponse.json(parsedContent);

    } catch (error: any) {
        console.error("Error in ES Scoring API:", error);
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return NextResponse.json(
            { error: message },
            { status: status }
        );
    }
}
