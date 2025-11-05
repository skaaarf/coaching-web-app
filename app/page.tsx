"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TalkView from "./components/TalkView";
import {
  ActiveSession,
  Message,
  SessionRecord,
  SessionStore,
  SessionTopic,
  ToolUsage,
} from "./types/session";

interface TalkTopic extends SessionTopic {
  introMessage: string;
  prompts: string[];
  badge: string;
}

interface ToolCard {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: string[];
  outcome: string;
  actionLabel: string;
}

const STORAGE_KEY = "mikata-session-store";

const DEFAULT_TOPIC: SessionTopic = {
  id: "free-talk",
  title: "自由に話してみる",
  description: "進路について気になることを自由に整理してみよう。",
};

const TALK_TOPICS: TalkTopic[] = [
  {
    id: "parent-expectation",
    title: "親との会話を整理する",
    description:
      "親や周囲の期待をどう受け止めているのか、最近印象に残った会話をたどりながら整理してみよう。",
    introMessage:
      "こんにちは。今日は「親との会話を整理する」をテーマに話してみようか。最近の会話で心に残っていることを教えてくれる?",
    prompts: [
      "どんな言葉が特に印象に残っている?",
      "その時あなたはどんな気持ちになった?",
    ],
    badge: "周囲との関係",
  },
  {
    id: "future-vision",
    title: "将来像を描いてみる",
    description:
      "大学に進む・進まないにかかわらず、理想の一日を想像してみて、そこに何があるのかを言葉にしてみよう。",
    introMessage:
      "今日は「将来像を描いてみる」を一緒に考えてみよう。大学に行くかどうかを意識しつつ、理想の一日を思い描いてみてくれる?",
    prompts: [
      "その一日の中で大事にしたい時間は?",
      "誰と、何をしていると嬉しい?",
    ],
    badge: "未来のイメージ",
  },
  {
    id: "hands-on-learning",
    title: "実務的な学びへの気持ちを探る",
    description:
      "手を動かす学びに惹かれる理由や、これまで楽しかった体験を振り返りながら、進路のヒントを探そう。",
    introMessage:
      "「実務的な学びへの気持ちを探る」をテーマにしよう。手を動かして学んだ経験で、印象に残っていることを教えて。",
    prompts: [
      "どんな場面で「楽しい」「もっとやりたい」と感じた?",
      "その経験から気づいた自分の強みは?",
    ],
    badge: "学び方",
  },
  {
    id: "decision-check",
    title: "決断の軸を見つける",
    description:
      "選択肢が複数あるときに、何を優先したいのか。自分なりの判断基準を言葉にしてみよう。",
    introMessage:
      "今日は「決断の軸を見つける」をテーマに進めてみよう。大学進学を考える上で、外せない条件って何だと思う?",
    prompts: [
      "なぜそれが大事だと感じる?",
      "他に迷っている条件はある?",
    ],
    badge: "意思決定",
  },
];

const TOOL_CARDS: ToolCard[] = [
  {
    id: "value-map",
    title: "進路の価値観マップ",
    category: "セルフワーク",
    description:
      "進路で大事にしたい価値観を3つの観点から仕分けして、選択の優先順位を見える化するチェックリスト。",
    steps: [
      "「環境」「学び方」「将来像」の3カテゴリで気になるキーワードを選ぶ",
      "選んだキーワードを「必須」「あったら嬉しい」に仕分けする",
      "上位3つをメモして、次の対話で共有する",
    ],
    outcome: "自分が譲れない条件が整理され、対話のテーマがより深まります。",
    actionLabel: "ワークを開く",
  },
  {
    id: "conversation-notes",
    title: "親との会話メモ",
    category: "整理ノート",
    description:
      "最近の家族との会話を時系列で書き出して、受け取った期待と自分の気持ちを切り分けるテンプレート。",
    steps: [
      "直近1週間の会話を思い出し、印象に残った言葉を3つ書き出す",
      "その時に感じた気持ちを「安心」「不安」など一言で表す",
      "次に聞いてみたいこと・伝えたいことをメモする",
    ],
    outcome:
      "対話で話したいポイントが明確になり、落ち着いて伝えられる準備が整います。",
    actionLabel: "テンプレートを見る",
  },
  {
    id: "pathway-compare",
    title: "進路プラン比較シート",
    category: "プランニング",
    description:
      "大学・専門・就職など複数の進路を、かかる時間や得られる経験で並べて比較するシート。",
    steps: [
      "検討中の進路を3つまで書き出す",
      "それぞれの「期間」「費用」「得られる経験」をメモする",
      "自分がワクワクするポイントに★を付けてみる",
    ],
    outcome:
      "選択肢の違いが整理され、自分に合うプランを対話で検討しやすくなります。",
    actionLabel: "比較する",
  },
];

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const loadStore = (): SessionStore => ({ sessions: [], overallSummary: "", tools: [] });

const formatTimelineDate = (date: string) => {
  const target = new Date(date);
  const month = target.getMonth() + 1;
  const day = target.getDate();
  const weekday = WEEKDAYS[target.getDay()];
  return `${month}/${day}(${weekday})`;
};

const formatSidebarTimestamp = (date: string) => {
  const target = new Date(date);
  const month = target.getMonth() + 1;
  const day = target.getDate();
  const hour = target.getHours().toString().padStart(2, "0");
  const minute = target.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${hour}:${minute}`;
};

const getLastUserMessage = (messages: Message[]) => {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") {
      return messages[i];
    }
  }
  return null;
};

const findTopicById = (id: string) => TALK_TOPICS.find((topic) => topic.id === id) || null;
const findToolById = (id: string) => TOOL_CARDS.find((tool) => tool.id === id) || null;

const ensureTopic = (topic?: SessionTopic | null) => topic ?? DEFAULT_TOPIC;

export default function Home() {
  const [store, setStore] = useState<SessionStore>(loadStore);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [saveSessionError, setSaveSessionError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolCard | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const topicsSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (!storedValue) {
        setHasHydrated(true);
        return;
      }
      const parsed = JSON.parse(storedValue);
      const rawSessions = Array.isArray(parsed.sessions)
        ? (parsed.sessions as (Partial<SessionRecord> & { topicId?: string })[])
        : [];

      const sessions: SessionRecord[] = rawSessions.map((session) => {
        const messages = Array.isArray(session.messages)
          ? (session.messages as Message[])
          : [];
        const topic = session.topic
          ? session.topic
          : session.topicId
          ? findTopicById(session.topicId) || undefined
          : undefined;
        const lastMessage = messages[messages.length - 1];
        const createdAt = session.date || new Date().toISOString();
        const updatedAt = session.updatedAt || lastMessage?.createdAt || createdAt;
        const messageCount = messages.length;
        const lastSummaryCount =
          typeof session.lastSummaryMessageCount === "number"
            ? session.lastSummaryMessageCount
            : session.insight
            ? messageCount
            : 0;
        const needsSummary =
          typeof session.needsSummary === "boolean"
            ? session.needsSummary
            : lastSummaryCount !== messageCount;

        return {
          id: session.id || crypto.randomUUID(),
          date: createdAt,
          updatedAt,
          messages,
          insight: session.insight || undefined,
          durationMinutes: session.durationMinutes || 0,
          topic: ensureTopic(topic),
          lastSummaryMessageCount: lastSummaryCount,
          needsSummary,
        };
      });

      const rawTools = Array.isArray(parsed.tools) ? (parsed.tools as ToolUsage[]) : [];
      const tools: ToolUsage[] = rawTools
        .map((tool) => {
          if (!tool || typeof tool !== "object" || !("id" in tool)) {
            return null;
          }
          const lastOpenedAt =
            typeof (tool as ToolUsage).lastOpenedAt === "string"
              ? (tool as ToolUsage).lastOpenedAt
              : new Date().toISOString();
          const openCount =
            typeof (tool as ToolUsage).openCount === "number" && Number.isFinite(tool.openCount)
              ? Math.max(1, Math.round(tool.openCount))
              : 1;
          return {
            id: (tool as ToolUsage).id,
            lastOpenedAt,
            openCount,
          };
        })
        .filter((tool): tool is ToolUsage => Boolean(tool && tool.id));

      setStore({
        sessions,
        overallSummary: parsed.overallSummary || "",
        tools,
      });
    } catch (error) {
      console.error("Failed to load session store", error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store, hasHydrated]);

  const sortedSessions = useMemo(
    () =>
      [...store.sessions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [store.sessions],
  );

  const recentSessions = useMemo(
    () =>
      [...store.sessions].sort(
        (a, b) =>
          new Date(b.updatedAt || b.date).getTime() -
          new Date(a.updatedAt || a.date).getTime(),
      ),
    [store.sessions],
  );

  const topicInterests = useMemo(() => {
    const counts = new Map<string, { topic: SessionTopic; count: number }>();
    store.sessions.forEach((session) => {
      if (!session.topic || !session.messages.some((message) => message.role === "user")) {
        return;
      }
      const existing = counts.get(session.topic.id);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(session.topic.id, {
          topic: session.topic,
          count: 1,
        });
      }
    });
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [store.sessions]);

  const toolHistory = useMemo(
    () =>
      [...store.tools]
        .sort(
          (a, b) =>
            new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime(),
        )
        .map((usage) => ({ usage, tool: findToolById(usage.id) }))
        .filter((entry) => entry.tool),
    [store.tools],
  );

  const hasSessions = store.sessions.some((session) =>
    session.messages.some((message) => message.role === "user"),
  );

  const scrollToTopics = () => {
    if (topicsSectionRef.current) {
      topicsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartSession = (topic: TalkTopic) => {
    if (activeSession || isSavingSession) {
      return;
    }
    setSaveSessionError(null);
    const now = new Date().toISOString();
    const sessionId = crypto.randomUUID();
    const greeting: Message = {
      id: crypto.randomUUID(),
      content: topic.introMessage,
      role: "assistant",
      createdAt: now,
    };
    const topicForSession: SessionTopic = {
      id: topic.id,
      title: topic.title,
      description: topic.description,
    };

    const newSession: SessionRecord = {
      id: sessionId,
      date: now,
      updatedAt: now,
      messages: [greeting],
      insight: undefined,
      durationMinutes: 0,
      topic: topicForSession,
      lastSummaryMessageCount: 1,
      needsSummary: false,
    };

    setStore((prev) => ({
      sessions: [...prev.sessions, newSession],
      overallSummary: prev.overallSummary,
      tools: prev.tools,
    }));

    setActiveSession({
      id: sessionId,
      startedAt: now,
      messages: [greeting],
      topic: topicForSession,
    });
  };

  const handleResumeSession = (session: SessionRecord) => {
    if (isSavingSession) {
      return;
    }
    setSaveSessionError(null);
    setActiveSession({
      id: session.id,
      startedAt: session.date,
      messages: session.messages,
      topic: ensureTopic(session.topic),
    });
    setIsSidebarOpen(false);
  };
  const handleUpdateActiveSession = (messages: Message[]) => {
    if (!activeSession) {
      return;
    }
    setSaveSessionError(null);
    setActiveSession((prev) => (prev ? { ...prev, messages } : prev));
    setStore((prev) => {
      const sessionIndex = prev.sessions.findIndex(
        (session) => session.id === activeSession.id,
      );
      if (sessionIndex === -1) {
        return prev;
      }
      const lastSummaryCount =
        prev.sessions[sessionIndex].lastSummaryMessageCount ?? 0;
      const updatedSessions = [...prev.sessions];
      const updatedAt =
        messages[messages.length - 1]?.createdAt || new Date().toISOString();
      updatedSessions[sessionIndex] = {
        ...updatedSessions[sessionIndex],
        messages,
        updatedAt,
        needsSummary: messages.length !== lastSummaryCount,
      };
      return {
        sessions: updatedSessions,
        overallSummary: prev.overallSummary,
        tools: prev.tools,
      };
    });
  };

  const summarizeSession = useCallback(
    async (sessionId: string) => {
      const targetSession = store.sessions.find((session) => session.id === sessionId);
      if (!targetSession) {
        return;
      }
      setSaveSessionError(null);
      setIsSavingSession(true);
      try {
        const previousSessionsPayload = [...store.sessions]
          .filter((session) => session.id !== sessionId)
          .sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          .map((session, index) => ({
            index: index + 1,
            date: session.date,
            insight: session.insight || "",
            lastUserMessage: getLastUserMessage(session.messages)?.content || "",
            topicTitle: session.topic?.title || "",
          }));

        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: targetSession.messages,
            previousSessions: previousSessionsPayload,
            previousOverallSummary: store.overallSummary,
            topic: targetSession.topic,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "要約の生成に失敗しました");
        }

        const data = await response.json();
        const sessionInsight = data.session_insight as string;
        const overallSummary = data.overall_summary as string;

        if (!sessionInsight || !overallSummary) {
          throw new Error("AIの応答を解析できませんでした");
        }

        const lastMessage = targetSession.messages[targetSession.messages.length - 1];
        const durationMinutes = lastMessage
          ? Math.max(
              1,
              Math.round(
                (new Date(lastMessage.createdAt).getTime() -
                  new Date(targetSession.date).getTime()) /
                  60000,
              ),
            )
          : targetSession.durationMinutes || 0;

        setStore((prev) => ({
          sessions: prev.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  insight: sessionInsight,
                  durationMinutes,
                  needsSummary: false,
                  lastSummaryMessageCount: targetSession.messages.length,
                  updatedAt:
                    lastMessage?.createdAt || session.updatedAt || new Date().toISOString(),
                }
              : session,
          ),
          overallSummary,
          tools: prev.tools,
        }));
      } catch (error) {
        console.error(error);
        setSaveSessionError(
          error instanceof Error ? error.message : "要約の生成に失敗しました",
        );
        throw error;
      } finally {
        setIsSavingSession(false);
      }
    },
    [store.sessions, store.overallSummary],
  );

  const handleCloseTalkView = async () => {
    if (!activeSession) {
      return;
    }
    const sessionRecord = store.sessions.find(
      (session) => session.id === activeSession.id,
    );
    if (!sessionRecord) {
      setActiveSession(null);
      return;
    }
    const hasUserMessage = sessionRecord.messages.some(
      (message) => message.role === "user",
    );

    if (!hasUserMessage) {
      setStore((prev) => ({
        sessions: prev.sessions.filter((session) => session.id !== sessionRecord.id),
        overallSummary: prev.overallSummary,
        tools: prev.tools,
      }));
      setActiveSession(null);
      return;
    }

    const needsSummary =
      sessionRecord.needsSummary !== false ||
      (sessionRecord.lastSummaryMessageCount ?? 0) !== sessionRecord.messages.length;

    if (needsSummary) {
      try {
        await summarizeSession(sessionRecord.id);
      } catch {
        return;
      }
    }

    setActiveSession(null);
  };

  const handleOpenTool = (tool: ToolCard) => {
    setSelectedTool(tool);
    setStore((prev) => {
      const now = new Date().toISOString();
      const existingIndex = prev.tools.findIndex((usage) => usage.id === tool.id);
      let tools: ToolUsage[];
      if (existingIndex >= 0) {
        tools = prev.tools.map((usage, index) =>
          index === existingIndex
            ? {
                ...usage,
                lastOpenedAt: now,
                openCount: usage.openCount + 1,
              }
            : usage,
        );
      } else {
        tools = [...prev.tools, { id: tool.id, lastOpenedAt: now, openCount: 1 }];
      }
      return {
        sessions: prev.sessions,
        overallSummary: prev.overallSummary,
        tools,
      };
    });
  };

  const handleSelectToolFromHistory = (toolId: string) => {
    const tool = findToolById(toolId);
    if (tool) {
      handleOpenTool(tool);
    }
    setIsSidebarOpen(false);
  };
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-6 py-8 sm:px-10">
        <main>
          {hasSessions ? (
            <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-500">みかたくん</p>
                <h1 className="text-3xl font-bold tracking-tight">あなたの思考が見えるホーム</h1>
                <p className="text-sm text-zinc-600">
                  左のバーからトークやワークを選んで、いつでも続きに戻れるよ。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
                >
                  履歴を開く
                </button>
                <button
                  onClick={scrollToTopics}
                  className="inline-flex items-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  新しいテーマを選ぶ
                </button>
              </div>
            </header>
          ) : (
            <header className="flex flex-col items-center gap-6 text-center">
              <div className="rounded-full bg-zinc-900 px-5 py-1 text-sm font-medium text-white">
                みかたくん
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">こんにちは。</h1>
                <p className="text-lg text-zinc-600">
                  進路のこと、一緒に考えよう。テーマを選ぶと、5分から始められるよ。
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-lg font-medium text-zinc-700 shadow transition hover:border-zinc-400 hover:text-zinc-900 sm:w-auto"
                >
                  履歴を見る
                </button>
                <button
                  onClick={scrollToTopics}
                  className="w-full rounded-2xl bg-zinc-900 px-6 py-3 text-lg font-medium text-white shadow transition hover:bg-zinc-800 sm:w-auto"
                >
                  テーマを見てみる
                </button>
              </div>
            </header>
          )}

          <section className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              あなたについて
            </h2>
            <div className="mt-3 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-800">
                {store.overallSummary ||
                  "これまでの対話の要約はまだありません。テーマを選んで会話を始めてみましょう。"}
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              今気になっているテーマ
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {topicInterests.length > 0 ? (
                topicInterests.map(({ topic, count }) => (
                  <div
                    key={topic.id}
                    className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm"
                  >
                    <span>{topic.title}</span>
                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {count}回
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">
                  まだ話したテーマはありません。気になるトピックから始めてみましょう。
                </p>
              )}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              最近の気づき
            </h2>
            <div className="mt-3 space-y-4">
              {sortedSessions.length > 0 ? (
                [...sortedSessions]
                  .reverse()
                  .slice(0, 6)
                  .map((session) => {
                    const lastUserMessage = getLastUserMessage(session.messages);
                    const displayDate = session.updatedAt || session.date;
                    return (
                      <div
                        key={session.id}
                        className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                          <span>{formatTimelineDate(displayDate)}</span>
                          {session.topic ? (
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">
                              {session.topic.title}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 space-y-2 text-zinc-800">
                          {lastUserMessage && (
                            <p className="text-sm text-zinc-600">「{lastUserMessage.content}」</p>
                          )}
                          <div className="flex items-start gap-2 text-sm">
                            <span className="text-zinc-400">→</span>
                            <p className="font-medium text-zinc-800">
                              {session.insight || "このトークのまとめはまだありません"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-sm text-zinc-500">
                  まだ気づきはありません。短いトピックから始めてみましょう。
                </p>
              )}
            </div>
          </section>

          <section ref={topicsSectionRef} className="mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                  5分で話せるトピック
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  気になるテーマを選んで、みかたくんと一緒に深掘りしよう。
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {TALK_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className="flex h-full flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-600">
                      <span>{topic.badge}</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-400" />
                      <span>5分トピック</span>
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900">{topic.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-600">{topic.description}</p>
                    <ul className="space-y-2 text-xs text-zinc-500">
                      {topic.prompts.map((prompt) => (
                        <li key={prompt} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" />
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleStartSession(topic)}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    このテーマで話す
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                  ツールボックス
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  会話の前後に、自分で整理できるワークやシートを活用しよう。
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {TOOL_CARDS.map((tool) => (
                <div
                  key={tool.id}
                  className="flex h-full flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="space-y-3">
                    <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-600">
                      {tool.category}
                    </span>
                    <h3 className="text-xl font-semibold text-zinc-900">{tool.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-600">{tool.description}</p>
                  </div>
                  <button
                    onClick={() => handleOpenTool(tool)}
                    className="mt-6 inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
                  >
                    {tool.actionLabel}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {saveSessionError && (
            <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {saveSessionError}
            </div>
          )}
        </main>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-full max-w-sm transform border-r border-zinc-200 bg-white/80 backdrop-blur transition-transform duration-300 ease-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-zinc-700">みかたくん</p>
            <p className="mt-1 text-xs text-zinc-500">これまでのトークとワーク</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-800"
          >
            閉じる
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">トーク履歴</h2>
              <div className="mt-3 space-y-2">
                {recentSessions.length > 0 ? (
                  recentSessions.slice(0, 8).map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleResumeSession(session)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition hover:border-zinc-400 hover:bg-white ${
                        activeSession?.id === session.id
                          ? "border-zinc-900 bg-white shadow"
                          : "border-zinc-200 bg-white/80"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>{formatSidebarTimestamp(session.updatedAt || session.date)}</span>
                        {session.topic ? (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                            {session.topic.title}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 font-medium text-zinc-800">
                        {session.insight || "気づきはまだ記録されていません"}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">
                    まだトークはありません。テーマを選んで始めてみましょう。
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">ワーク</h2>
              <div className="mt-3 space-y-2">
                {toolHistory.length > 0 ? (
                  toolHistory.map(({ usage, tool }) => (
                    <button
                      key={usage.id}
                      onClick={() => handleSelectToolFromHistory(usage.id)}
                      className="w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-left text-sm transition hover:border-zinc-400 hover:bg-white"
                    >
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>{formatSidebarTimestamp(usage.lastOpenedAt)}</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                          {usage.openCount}回
                        </span>
                      </div>
                      <p className="mt-2 font-medium text-zinc-800">{tool!.title}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">
                    気になるワークを開くと、ここからいつでも戻れます。
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="サイドバーを閉じる"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/20"
        />
      )}

      {selectedTool ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-6 py-10">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-600">
                  {selectedTool.category}
                </span>
                <h3 className="text-2xl font-semibold text-zinc-900">{selectedTool.title}</h3>
                <p className="text-sm text-zinc-600">{selectedTool.description}</p>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-800"
              >
                閉じる
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-700">進め方</h4>
                <ol className="mt-2 space-y-2 text-sm text-zinc-600">
                  {selectedTool.steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  得られること
                </h4>
                <p className="mt-2 leading-relaxed">{selectedTool.outcome}</p>
              </div>
              <p className="text-xs text-zinc-400">
                ワークの結果はメモに残して、次の対話で共有してみましょう。
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {activeSession && (
        <TalkView
          session={activeSession}
          onRequestClose={handleCloseTalkView}
          onUpdateSession={handleUpdateActiveSession}
          isProcessing={isSavingSession}
          overallSummary={store.overallSummary}
        />
      )}
    </div>
  );
}

