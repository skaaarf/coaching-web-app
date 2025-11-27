import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/types';

type ConversationPayload = {
  moduleId: string;
  sessionId?: string;
  messages: Message[];
};

type EpisodePayload = {
  id: string;
  title: string;
  age?: string;
  isCompleted?: boolean;
  conversationHistory?: Message[];
};

type SelfAnalysisPayload = {
  conversations: ConversationPayload[];
  episodes: EpisodePayload[];
  completedEpisodeCount: number;
};

const SELF_ANALYSIS_PROMPT = `あなたは温かく受容的なキャリアカウンセラー兼編集者です。
以下の対話ログとエピソードをもとに、その人の「価値観」と「強み」を3つずつ抽出してください。
ジョブズの基調講演のように簡潔かつ美しく、余計な装飾は避けつつ、受容的・肯定的・洞察的なトーンを守ります。
価値観は行動の根っこにある内面（動機・こだわり・譲れない感覚）を言語化してください。

# トーンのガイドライン
- 受容的: 「〜かもしれませんね」「〜なんですね」
- 肯定的: ユーザーの選択や行動を肯定する言葉を入れる（例: これは健全/素晴らしい/希少）
- 洞察的: 「実は」「本当は」で深層に触れる。ただし決めつけない
- 批判や否定は厳禁。「〜に過ぎない」「〜だけでは？」は使わない
- 主語は常に「あなた」

# 価値観の書き方（各3つ）
- 「〜と思っているかもしれませんが、実は〜かもしれませんね」で始まる2〜4文の洞察（150-200文字目安）
- 「何に心が動くか」「何を嫌うか」「意思決定の軸」を含める
- 「これは健全」「素晴らしい」など肯定を含める
- 【このように表れています】で具体例を1〜3件
- 締めの一文は「つまり、あなたにとって〜なんです」で終える

# 強みの書き方（各3つ）
- 本質を示す名前（例: 起業家タイプのリーダーシップ、ゼロから生み出す創造力）
- 2〜4文で「どういう条件で発揮されるか」を説明し、肯定の一言を入れる
- 【発揮されたエピソード】で具体例を1〜3件

# 出力フォーマット（JSONのみ。説明文は禁止）
{
  "summary": "全体像の短い一文（主語は「あなた」、肯定的なトーン）",
  "values": [
    { "title": "価値観A", "description": "洞察的で受容的な説明（2-4文）", "evidences": ["• 具体例1", "• 具体例2"] },
    { "title": "価値観B", "description": "洞察的で受容的な説明（2-4文）", "evidences": ["• 具体例1"] },
    { "title": "価値観C", "description": "洞察的で受容的な説明（2-4文）", "evidences": ["• 具体例1"] }
  ],
  "strengths": [
    { "title": "強みA", "description": "条件や発揮シーンを含む肯定的な説明（2-4文）", "evidences": ["• 具体例1", "• 具体例2"] },
    { "title": "強みB", "description": "条件や発揮シーンを含む肯定的な説明（2-4文）", "evidences": ["• 具体例1"] },
    { "title": "強みC", "description": "条件や発揮シーンを含む肯定的な説明（2-4文）", "evidences": ["• 具体例1"] }
  ]
}`;

function formatConversations(conversations: ConversationPayload[]) {
  if (!conversations.length) return '対話ログはありません。';
  return conversations
    .map(({ moduleId, sessionId, messages }) => {
      const recent = messages.slice(-40);
      const text = recent
        .map(m => `${m.role === 'user' ? 'ユーザー' : 'AI'}: ${m.content}`)
        .join('\n');
      const label = sessionId ? `${moduleId} (${sessionId})` : moduleId;
      return `[${label}]\n${text}`;
    })
    .join('\n\n');
}

function formatEpisodes(episodes: EpisodePayload[]) {
  if (!episodes.length) return 'エピソードはまだありません。';
  return episodes
    .map(ep => {
      const logs = ep.conversationHistory || [];
      const text = logs
        .slice(-30)
        .map(m => `${m.role === 'user' ? 'ユーザー' : 'AI'}: ${m.content}`)
        .join('\n');
      return `- タイトル: ${ep.title || 'タイトルなし'} / 年代: ${ep.age || '不明'}\n${text || '対話ログなし'}`;
    })
    .join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const { conversations = [], episodes = [] } = (await request.json()) as SelfAnalysisPayload;

    const totalDialogueCount =
      conversations.reduce((sum, c) => sum + (c.messages?.length || 0), 0) +
      episodes.reduce((sum, ep) => sum + (ep.conversationHistory?.length || 0), 0);

    if (totalDialogueCount === 0) {
      return NextResponse.json({ error: '対話データがありません。' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
    }

    const conversationText = formatConversations(conversations);
    const episodeText = formatEpisodes(episodes);

    const userPrompt = `# 対話ログ\n${conversationText}\n\n# エピソード\n${episodeText}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SELF_ANALYSIS_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.35,
        max_tokens: 900,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || '分析に失敗しました' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: '分析結果が取得できませんでした' }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse self analysis result', error);
      return NextResponse.json({ error: '分析結果の解析に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({
      result: {
        summary: parsed.summary || '',
        values: parsed.values || [],
        strengths: parsed.strengths || [],
        totalDialogueCount,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in self-analysis', error);
    return NextResponse.json({ error: '分析処理中にエラーが発生しました' }, { status: 500 });
  }
}
