"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TalkView from "./components/TalkView";
import {
  ActiveSession,
  Message,
  SessionRecord,
  SessionStore,
  SessionTopic,
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
    outcome: "対話で話したいポイントが明確になり、落ち着いて伝えられる準備が整います。",
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
    outcome: "選択肢の違いが整理され、自分に合うプランを対話で検討しやすくなります。",
    actionLabel: "比較する",
  },
];

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const loadStore = (): SessionStore => ({ sessions: [], overallSummary: "" });

const formatTimelineDate = (date: string) => {
  const target = new Date(date);
  const month = target.getMonth() + 1;
  const day = target.getDate();
  const weekday = WEEKDAYS[target.getDay()];
  return `${month}/${day}(${weekday})`;
};

const getLastUserMessage = (messages: Message[]) => {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") {
      return messages[i];
    }
  }
  return null;
};

const findTopicById = (id: string) =>
  TALK_TOPICS.find((topic) => topic.id === id) || null;

export default function Home() {
  const [store, setStore] = useState<SessionStore>(loadStore);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [endSessionError, setEndSessionError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolCard | null>(null);
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
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        const rawSessions = parsed.sessions as (
          Partial<SessionRecord> & { topicId?: string }
        )[];
        const sessions: SessionRecord[] = rawSessions.map((session) => ({
          id: session.id || crypto.randomUUID(),
          date: session.date || new Date().toISOString(),
          messages: session.messages || [],
          insight: session.insight || "",
          durationMinutes: session.durationMinutes || 0,
          topic: session.topic
            ? session.topic
            : session.topicId
            ? findTopicById(session.topicId) || undefined
            : undefined,
        }));
        setStore({
          sessions,
          overallSummary: parsed.overallSummary || "",
        });
      }
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

  const topicInterests = useMemo(() => {
    const counts = new Map<string, { topic: SessionTopic; count: number }>();
    store.sessions.forEach((session) => {
      if (!session.topic) {
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

  const hasSessions = store.sessions.length > 0;

  const scrollToTopics = () => {
    if (topicsSectionRef.current) {
      topicsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartSession = (topic: TalkTopic) => {
    if (activeSession) {
      return;
    }
    setEndSessionError(null);
    const now = new Date().toISOString();
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
    setActiveSession({
      id: crypto.randomUUID(),
      startedAt: now,
      messages: [greeting],
      topic: topicForSession,
    });
  };

  const handleUpdateActiveSession = (messages: Message[]) => {
    setActiveSession((prev) => (prev ? { ...prev, messages } : prev));
  };

  const handleCloseTalkView = () => {
    if (isEndingSession) {
      return;
    }
    setActiveSession(null);
  };

  const handleCompleteSession = async () => {
    if (!activeSession) {
      return;
    }

    setEndSessionError(null);
    setIsEndingSession(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: activeSession.messages,
          previousSessions: store.sessions.map((session, index) => ({
            index: index + 1,
            date: session.date,
            insight: session.insight,
            lastUserMessage: getLastUserMessage(session.messages)?.content || "",
            topicTitle: session.topic?.title || "",
          })),
          previousOverallSummary: store.overallSummary,
          topic: activeSession.topic,
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

      const durationMinutes = Math.max(
        1,
        Math.round((Date.now() - new Date(activeSession.startedAt).getTime()) / 60000),
      );

      const newSession: SessionRecord = {
        id: activeSession.id,
        date: activeSession.startedAt,
        messages: activeSession.messages,
        insight: sessionInsight,
        durationMinutes,
        topic: activeSession.topic,
      };

      setStore((prev) => ({
        sessions: [...prev.sessions, newSession],
        overallSummary,
      }));
      setActiveSession(null);
    } catch (error) {
      console.error(error);
      setEndSessionError(
        error instanceof Error ? error.message : "要約の生成に失敗しました",
      );
      if (typeof window !== "undefined") {
        window.alert(
          error instanceof Error ? error.message : "要約の生成に失敗しました",
        );
      }
    } finally {
      setIsEndingSession(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-10 sm:px-10">
        {hasSessions ? (
          <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-500">みかたくん</p>
              <h1 className="text-3xl font-bold tracking-tight">
                あなたの思考が見えるホーム
              </h1>
              <p className="text-sm text-zinc-600">
                対話のテーマを選んで、気づきを少しずつ積み重ねていこう。
              </p>
            </div>
            <button
              onClick={scrollToTopics}
              className="self-start rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              テーマを選んで話す
            </button>
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
            <button
              onClick={scrollToTopics}
              className="mt-2 w-full max-w-xs rounded-2xl bg-zinc-900 px-6 py-3 text-lg font-medium text-white shadow transition hover:bg-zinc-800"
            >
              テーマを見てみる
            </button>
          </header>
        )}

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            あなたについて
          </h2>
          <div className="mt-3 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-800">
              {store.overallSummary || "これまでの対話の要約はまだありません。テーマを選んで会話を始めてみましょう。"}
            </p>
          </div>
        </section>

        <section>
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

        <section>
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
                  return (
                    <div
                      key={session.id}
                      className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                        <span>{formatTimelineDate(session.date)}</span>
                        {session.topic ? (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">
                            {session.topic.title}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-3 space-y-2 text-zinc-800">
                        {lastUserMessage && (
                          <p className="text-sm text-zinc-600">
                            「{lastUserMessage.content}」
                          </p>
                        )}
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-zinc-400">→</span>
                          <p className="font-medium text-zinc-800">{session.insight}</p>
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

        <section ref={topicsSectionRef}>
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
                  <h3 className="text-xl font-semibold text-zinc-900">
                    {topic.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {topic.description}
                  </p>
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

        <section>
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
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {tool.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTool(tool)}
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
                >
                  {tool.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </section>

        {endSessionError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {endSessionError}
          </div>
        )}
      </main>

      {selectedTool ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-6 py-10">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-600">
                  {selectedTool.category}
                </span>
                <h3 className="text-2xl font-semibold text-zinc-900">
                  {selectedTool.title}
                </h3>
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
          onClose={handleCloseTalkView}
          onUpdateSession={handleUpdateActiveSession}
          onEndSession={handleCompleteSession}
          isEndingSession={isEndingSession}
          overallSummary={store.overallSummary}
        />
      )}
    </div>
  );
}
