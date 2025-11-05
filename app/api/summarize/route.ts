import { NextRequest, NextResponse } from "next/server";
import { Message } from "../../types/session";

interface PreviousSessionSummary {
  index: number;
  date: string;
  insight: string;
  lastUserMessage: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      messages,
      previousSessions,
      previousOverallSummary,
    }: {
      messages: Message[];
      previousSessions?: PreviousSessionSummary[];
      previousOverallSummary?: string;
    } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const sessionLog = (messages || [])
      .map((message) => {
        const speaker = message.role === "user" ? "ユーザー" : "みかたくん";
        return `${speaker}: ${message.content}`;
      })
      .join("\n");

    const previousTimeline = (previousSessions || [])
      .map((session) => {
        const userLine = session.lastUserMessage
          ? `ユーザー: ${session.lastUserMessage}`
          : "ユーザー: (記録なし)";
        return `第${session.index}回 (${session.date})\n${userLine}\n気づき: ${session.insight}`;
      })
      .join("\n\n");

    const systemPrompt = `あなたは高校生の進路相談を記録するアシスタントです。

【タスク】
1. 今回の対話ログから「このセッションでの気づき」を1行で抜き出す
2. 過去の要約と洞察を踏まえて、最新の「あなたについて」の要約を50〜100字で更新する

【制約】
- JSON形式のみを出力する。余計な文章やコードブロックは書かない
- キーは session_insight と overall_summary のみ
- 「大学に行くべき」「行かなくていい」といった断定を避ける
- 学校名や職業など具体的な指示は避ける
- 日本語で出力する

【参考情報】
過去の全体要約: ${previousOverallSummary || "(なし)"}
過去のセッション: ${previousTimeline || "(記録なし)"}`;

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `今回のセッションログ:\n${sessionLog}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 400,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to get response from OpenAI" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const sanitized = assistantMessage
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(sanitized);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    if (!parsed.session_insight || !parsed.overall_summary) {
      return NextResponse.json(
        { error: "Invalid AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      session_insight: parsed.session_insight,
      overall_summary: parsed.overall_summary,
    });
  } catch (error) {
    console.error("Error summarizing session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
