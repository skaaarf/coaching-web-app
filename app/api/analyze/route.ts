import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { chatHistory, activityId } = await req.json();

        if (!chatHistory || !Array.isArray(chatHistory)) {
            return new Response("Invalid chat history", { status: 400 });
        }

        // Extract text content from history
        const conversationText = chatHistory
            .map((item: any) => `${item.type === 'user' ? 'User' : 'AI'}: ${typeof item.content === 'string' ? item.content : JSON.stringify(item.content)}`)
            .join("\n");

        const systemPrompt = `あなたはプロのキャリアコーチです。
ユーザーとの対話ログから、ユーザーの「強み」「価値観」「向いている業界・職種」を分析してください。
分析結果は、就職活動の自己分析に使える具体的な内容にしてください。

# 分析の観点
1. **強み**: 具体的なエピソードから読み取れる、再現性のある強み（資質・スキル）。
2. **価値観**: 仕事や人生において大切にしたいこと、譲れないこと。
3. **向いている業界・職種**: 強みと価値観に基づいた、具体的な業界や職種の提案。

# 出力形式
JSON形式で出力してください。`;

        const result = await generateObject({
            model: openai("gpt-4o-mini"),
            system: systemPrompt,
            prompt: `以下の対話ログを分析してください。\n\n${conversationText}`,
            schema: z.object({
                strengths: z.array(z.object({
                    id: z.string(),
                    title: z.string(),
                    description: z.string(),
                    category: z.string(),
                })),
                valuesCompatibility: z.object({
                    matches: z.array(z.object({
                        value: z.string(),
                        score: z.number(),
                        reason: z.string(),
                    })),
                }),
                industryMatch: z.object({
                    industries: z.array(z.object({
                        name: z.string(),
                        matchScore: z.number(),
                        reason: z.string(),
                    })),
                    jobTypes: z.array(z.object({
                        name: z.string(),
                        matchScore: z.number(),
                        reason: z.string(),
                    })),
                }),
            }),
        });

        return new Response(JSON.stringify(result.object), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Analysis Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
