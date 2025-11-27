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

const SELF_ANALYSIS_PROMPT = `あなたは世界最高クラスのキャリアカウンセラー兼編集者です。
以下の対話ログとエピソードをもとに、その人の「価値観」と「強み」を3つずつ抽出し、短く洗練された日本語でまとめてください。
ジョブズの基調講演のように簡潔かつ美しく、余計な装飾は避けます。

# 重要な方針
- 対話内容の具体例を「このように表れています」「発揮されたエピソード」として1〜3件、箇条書きで挙げる
- 似た概念はまとめて、重複を避ける
- あいまいな情報は無理に推測せず、「〜が見えてきます」のように控えめに表現
- 文章は短く、行間を意識したリズムで

# 出力フォーマット（JSONのみ。説明文は禁止）
{
  "summary": "完了エピソード数と全体像の短い一文",
  "values": [
    { "title": "価値観A", "description": "簡潔な説明", "evidences": ["• 具体例1", "• 具体例2"] },
    { "title": "価値観B", "description": "簡潔な説明", "evidences": ["• 具体例1"] },
    { "title": "価値観C", "description": "簡潔な説明", "evidences": ["• 具体例1"] }
  ],
  "strengths": [
    { "title": "強みA", "description": "簡潔な説明", "evidences": ["• 具体例1", "• 具体例2"] },
    { "title": "強みB", "description": "簡潔な説明", "evidences": ["• 具体例1"] },
    { "title": "強みC", "description": "簡潔な説明", "evidences": ["• 具体例1"] }
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
  if (!episodes.length) return '完了エピソードはありません。';
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
    const { conversations = [], episodes = [], completedEpisodeCount = 0 } = (await request.json()) as SelfAnalysisPayload;

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

    const userPrompt = `# 対話ログ\n${conversationText}\n\n# エピソード\n${episodeText}\n\n完了エピソード数: ${completedEpisodeCount}`;

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
        completedEpisodeCount,
        totalDialogueCount,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in self-analysis', error);
    return NextResponse.json({ error: '分析処理中にエラーが発生しました' }, { status: 500 });
  }
}
