import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { context } = await request.json();

    if (!context || typeof context !== 'string') {
      return NextResponse.json(
        { error: 'Invalid context' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const systemPrompt = `あなたはキャリアカウンセラーのアシスタントです。
ユーザーが各種キャリアモジュールで話した内容を分析し、以下のインサイトを抽出してください：

1. careerThinking: ユーザーのキャリアに対する基本的な考え方や価値観（2-3個）
2. currentConcerns: ユーザーが現在抱えている主な悩みや課題（2-3個）
3. thoughtFlow: ユーザーの思考の流れや変化（時系列で2-3個）
4. patterns: 繰り返し現れるテーマやパターン（1-2個）

各項目は短く簡潔な文で、ユーザー本人が読んで「確かに」と思えるようなものにしてください。
必ずJSON形式で返してください。`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: context }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const insights = JSON.parse(content);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
