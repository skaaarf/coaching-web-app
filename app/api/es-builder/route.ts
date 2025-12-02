import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
    console.warn("Warning: OPENAI_API_KEY is not set in environment variables.");
}

export async function POST(request: NextRequest) {
    try {
        console.log("ES Builder API Request received");
        const body = await request.json();
        console.log("Request body:", JSON.stringify(body, null, 2));
        const { messages, questionInfo } = body;

        if (!Array.isArray(messages)) {
            return NextResponse.json(
                { error: "messages must be an array" },
                { status: 400 }
            );
        }

        const systemPrompt = `あなたは就職活動のES（エントリーシート）作成を支援するプロのコーチ「AI進路くん」です。
ユーザーと一緒に「${questionInfo?.title || 'ESの回答'}」を作り上げることが目標です。

【あなたの振る舞い】
ユーザーの入力内容に応じて、以下の2つのモードを自動で切り替えてください。

1. **インタビューモード** (デフォルト)
   - ユーザーの話を深掘りし、より具体的で説得力のあるエピソードを引き出します。
   - 1回に1つの質問に絞り、答えやすくします。
   - ユーザーが話した内容を肯定しつつ、「その時どう感じた？」「具体的に何をした？」などと問いかけます。
   - **このモードの場合、draftContentは null にしてください。**

2. **ドラフト作成モード**
   - ユーザーから「書いて」「ドラフト」「直して」「短くして」などの依頼があった場合、または話が十分にまとまったと判断した場合に発動します。
   - これまでの会話内容をすべて踏まえて、ESとして提出できるレベルの自然な文章を作成します。
   - **角括弧【】などの見出しは使わず、自然な段落構成の文章にしてください。**
   - **このモードの場合、draftContent に作成した文章を入れてください。**

【ショートカット提案】
返答の最後に、ユーザーが次に言いそうなこと、または言うと効果的なことを「ショートカットボタン」として3つ提案してください。
以下の候補リストから、文脈に合わせて最適な3つを選んでください。

<候補リスト>
- 文章を改善して
- もっと論理的に
- 200字に圧縮して
- 語尾を丁寧にして
- 別の案を作って
- 具体例を入れたい
- 結論から書きたい
- 感情を込めたい
- アピールを強めたい
- もっとシンプルに
</候補リスト>

【出力フォーマット】
必ず以下のJSON形式で出力してください。
{
  "message": "ユーザーへの返答（質問や確認など）",
  "draftContent": "ドラフト作成モードの場合のみ文章を入れる。インタビューモードの場合は null",
  "suggestedShortcuts": ["候補1", "候補2", "候補3"]
}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((msg: any) => ({
                    role: msg.role === "user" ? "user" : "assistant",
                    content: msg.content,
                } as const)),
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error("No content received from OpenAI");
        }

        const parsedContent = JSON.parse(content);

        return NextResponse.json(parsedContent);

    } catch (error: any) {
        console.error("Error in ES Builder API:", error);
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        return NextResponse.json(
            { error: message },
            { status: status }
        );
    }
}
