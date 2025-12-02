import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        console.log("ES Builder API Request received");
        const body = await request.json();
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

2. **ドラフト作成モード**
   - ユーザーから「書いて」「ドラフト」「直して」「短くして」などの依頼があった場合、または話が十分にまとまったと判断した場合に発動します。
   - これまでの会話内容をすべて踏まえて、ESとして提出できるレベルの自然な文章を作成します。
   - **角括弧【】などの見出しは使わず、自然な段落構成の文章にしてください。**

【出力について】
自然な会話形式で返答してください。
ドラフトを作成する場合は、返答の後に「---DRAFT_START---」という区切り線を入れ、その後にドラフト文章を出力してください。
`;

        console.log("Sending request to OpenAI...");

        const result = streamText({
            model: openai('gpt-4o-mini'),
            messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((msg: any) => ({
                    role: msg.role as "user" | "assistant",
                    content: msg.content,
                })),
            ],
            temperature: 0.7,
        });

        return result.toTextStreamResponse();

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
