import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { chatHistory } = await req.json();

        if (!chatHistory || !Array.isArray(chatHistory)) {
            return new Response("Invalid chat history", { status: 400 });
        }

        const historyText = chatHistory
            .map((item: any) => `${item.type === 'user' ? 'User' : 'AI'}: ${typeof item.content === 'string' ? item.content : JSON.stringify(item.content)}`)
            .join("\n")
            .slice(-8000); // safety guard

        const systemPrompt = `あなたは対話の要約者です。ユーザーの発言を中心に、今までの流れを3文以内で簡潔にまとめてください。
- 箇条書きは禁止、文章でまとめる
- 最新の話題がわかるようにする`;

        const result = await generateObject({
            model: openai("gpt-4o-mini"),
            system: systemPrompt,
            prompt: `以下の対話ログを要約してください。\n\n${historyText}`,
            schema: z.object({
                summary: z.string().max(480),
            }),
        });

        return new Response(JSON.stringify(result.object), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Summarize Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
