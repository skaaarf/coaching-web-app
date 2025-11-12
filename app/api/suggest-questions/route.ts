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

    // Build context-aware system prompt
    let contextualGuidance = "";
    if (moduleContext) {
      const { moduleId, moduleTitle, gameResults } = moduleContext;

      if (moduleId === 'value-battle' && gameResults) {
        contextualGuidance = `\n\n【会話のコンテキスト】
このユーザーは「価値観バトル」を完了しました。結果：
${gameResults}

サジェスチョンでは：
- 価値観バトルで上位に来た価値観について、なぜそれを選んだのか具体的に考察する
- 結果に対する具体的な気づきや発見を述べる
- 上位と下位の価値観の差について考えを深める
- 自分の価値観の優先順位が明確になったことに対する具体的な感想`;
      } else if (moduleId === 'life-simulator' && gameResults) {
        contextualGuidance = `\n\n【会話のコンテキスト】
このユーザーは「人生シミュレーター」を完了しました。結果：
${gameResults}

サジェスチョンでは：
- 選んだ人生の要素について、なぜそれが魅力的だったのか具体的に考察する
- 共通して惹かれた要素のパターンについて気づきを述べる
- 選ばなかった要素についても、なぜ選ばなかったのか考えを深める
- 理想の人生像について具体的な発見を述べる`;
      } else if (moduleId === 'university-decision') {
        contextualGuidance = `\n\n【会話のコンテキスト】
このユーザーは進路やキャリアについて対話しています。

サジェスチョンでは：
- 会話で出てきた具体的な選択肢や状況について、自分の考えを深める
- 自分の価値観や優先順位について新しく気づいたことを述べる
- 迷いや葛藤について、より具体的に言語化する
- 話し合った内容から得た具体的な気づきや発見を述べる`;
      }
    }

    // System prompt for generating follow-up questions
    const systemPrompt = `あなたは会話の流れを理解し、ユーザーが次に言いたくなるような具体的で考察を含む応答文を提案するAIです。${contextualGuidance}

【重要】
このサジェスチョンは、ユーザーが「AIの最後の発言に対して返信する」ための回答候補です。
AIの質問に答えたり、AIの発言に反応したりする形で、ユーザーが実際に言いそうな応答を生成してください。

【役割】
- 会話履歴の最後のAIの発言を確認し、それに対するユーザーの応答を2つ生成する
- AIが質問をしていたら、その質問に答える形の応答文を生成する
- AIが何かを指摘・提案していたら、それに対する反応・考えを述べる応答文を生成する
- ユーザーの具体的な気づきや考察を代弁する
- 抽象的な感想や一般論ではなく、ユーザー自身の具体的な価値観や好みを表現する

【応答文の要件】
- 各応答文は50〜80文字程度で、具体的な内容を含める
- AIの最後の発言に直接的に応じる内容にする
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

良い例（AIの発言に対する具体的な応答）：
例1: AIが「この結果について、どう感じましたか？」と質問した場合
{"questions": ["年収よりも意外と生活の質を重視してるんだなと気づきました", "安定性が一番下だったのは驚きで、チャレンジしたい気持ちが強いのかもと思いました"]}

例2: AIが「海外出張の多い仕事について、どう思いますか？」と質問した場合
{"questions": ["恋人と離れるのは嫌だから、海外出張が少ないキャリアがいいなと思いました", "短期の出張ならいいけど、長期は避けたいなと感じました"]}

例3: AIが「給料と働きがい、どちらを優先したいですか？」と質問した場合
{"questions": ["給料は普通でも、自分のアイデアが活かせる会社の方が魅力的だなと思いました", "働きがいがあれば多少給料が低くても続けられそうだなと感じました"]}

例4: AIが「親の期待と自分の気持ち、どちらも大切ですよね」と言った場合
{"questions": ["親が喜ぶかよりも、自分が楽しいと感じるかの方が大事だなと思いました", "親の期待も分かるけど、最後は自分の納得感を優先したいなと感じました"]}

悪い例（抽象的すぎる）：
{"questions": ["自分の価値観を見直すことが今後のキャリア形成に影響すると思いました", "今回の結果を今後に活かしていきたいと感じました"]}
{"questions": ["価値観について考えるきっかけになりました", "とても参考になる結果でした"]}`;

    // Use more messages for better context (up to 10 messages or all if fewer)
    // If there are many messages, include first 2 and last 8 to capture initial context and recent flow
    let messagesToSend;
    if (messages.length <= 10) {
      messagesToSend = messages;
    } else {
      const firstMessages = messages.slice(0, 2);
      const recentMessages = messages.slice(-8);
      messagesToSend = [...firstMessages, recentMessages];
    }

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
          ...messagesToSend.map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          })),
          {
            role: "user",
            content: "上記の会話履歴の最後のAI（アシスタント）の発言を確認してください。そのAIの発言に対して、ユーザーが返信したくなるような具体的で考察を含む応答文を2つ提案してください。\n\n重要：\n- AIが質問をしている場合は、その質問に答える形の応答を生成してください\n- AIが何かを指摘・提案している場合は、それに対する反応や考えを述べる応答を生成してください\n- AIの発言と直接的に関連する内容にしてください\n- 会話の文脈と流れをしっかり踏まえて、今この瞬間にユーザーが言いたくなるような応答を生成してください\n\n50〜80文字程度で、「〜と思いました」「〜だなと気づきました」などの表現を使い、必ず具体的な価値観や選択について言及してください。「キャリア形成」「価値観を見直す」「参考になった」などの抽象的な表現は絶対に使わないでください。",
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
