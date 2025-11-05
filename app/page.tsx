"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CoachingState,
  Message,
  Session,
  SessionFormData,
} from "./types/session";
import SessionForm from "./components/SessionForm";
import SessionHistory from "./components/SessionHistory";
import TalkView from "./components/TalkView";

const STORAGE_KEY = "mikatakun-coaching-state";

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

type LegacySession = Partial<Session> & {
  question?: string;
  topicTags?: string[];
  interests?: string[];
  summary?: string;
};

const TALK_TOPICS = [
  {
    id: "balance-expectations",
    title: "親の期待と自分の気持ちを整理する",
    description:
      "親や先生からの期待と、自分の本音を切り分けながら考えます。モヤモヤの正体を見つけたいときに。",
    prompt:
      "親や周囲の期待と、あなた自身の気持ちを一度切り分けてみましょう。最近印象に残ったやりとりはありますか?",
    tags: ["家族", "気持ちの整理", "進路"] as string[],
  },
  {
    id: "future-imagination",
    title: "進路の選択肢をひろげる",
    description:
      "大学・専門・就職…それぞれの可能性を言葉にしながら、選択肢を広げていきます。",
    prompt:
      "大学・専門・就職など、頭に浮かんでいる選択肢をまずは全部出してみましょう。一番気になるものはどれですか?",
    tags: ["選択肢", "未来", "モヤモヤ解消"],
  },
  {
    id: "strength-dig",
    title: "自分の強みを棚卸しする",
    description:
      "最近うまくいったことや褒められた瞬間を振り返り、自信の源を探ります。",
    prompt:
      "最近『これはできた』『ちょっと嬉しかった』と感じたことは何ですか? そこにはどんな強みが隠れていますか?",
    tags: ["自己理解", "強み", "振り返り"],
  },
  {
    id: "day-in-life",
    title: "理想の一日を描いてみる",
    description:
      "将来こう過ごせたら幸せだと思う一日を想像しながら、進路選択のヒントを見つけます。",
    prompt:
      "もし理想の一日を自由にデザインできるなら、朝から夜までどんな時間を過ごしたいですか?",
    tags: ["価値観", "未来", "イメージ"] as string[],
  },
];

const TOOL_MODULES = [
  {
    id: "value-check",
    title: "進路の価値観チェック",
    description:
      "大事にしたい価値観をリストから選び、優先度をつけて進路のヒントにします。",
    prompt:
      "どんな環境で学びたいか、誰と関わりたいかなど、進路で大切にしたい価値観を言葉にしてみましょう。",
    tags: ["価値観", "自己理解"],
  },
  {
    id: "parent-dialogue",
    title: "親との対話シミュレーション",
    description:
      "親にどう話すかを練習するワーク。伝えたいことと相手の気持ちを整理します。",
    prompt:
      "親に伝えたいことをメモしながら、相手の反応も想像して準備してみましょう。",
    tags: ["コミュニケーション", "家族"],
  },
  {
    id: "energy-map",
    title: "元気が出ることマップ",
    description:
      "やっていると時間を忘れること、逆に疲れることを書き出して、進路のヒントを得ます。",
    prompt:
      "時間を忘れて没頭できること、疲れてしまうことを書き出してみましょう。そこから何が見えてきますか?",
    tags: ["気分", "自己理解"],
  },
  {
    id: "mini-review",
    title: "今週のふりかえりノート",
    description:
      "この1週間の出来事を振り返って、気づきと次の一歩をまとめます。",
    prompt:
      "この1週間で印象に残っている出来事は何ですか? 感じたことや学んだことを書き出してみましょう。",
    tags: ["振り返り", "行動計画"],
  },
];

const emptyState: CoachingState = {
  sessions: [],
  overallSummary: "まだ十分なデータがありません。気になるトークやワークを始めると、ここにあなたの考えがまとまって表示されます。",
};

const upgradeLegacySession = (raw: unknown): Session | null => {
  if (!raw || typeof raw !== "object") return null;
  const session = raw as LegacySession;
  const now = new Date().toISOString();
  const tags: string[] =
    Array.isArray(session.tags) && session.tags.length > 0
      ? session.tags
      : session.topicTags || session.interests || [];
  const prompt = session.prompt || session.question || session.title || "";
  const title = session.title || session.question || "セッション";
  const legacyStatus =
    typeof session.status === "string" ? session.status : undefined;
  const normalizedStatus: Session["status"] =
    legacyStatus === "archived" || legacyStatus === "in-progress"
      ? legacyStatus
      : legacyStatus === "completed"
        ? "archived"
        : "in-progress";
  return {
    id: session.id || generateId(),
    title,
    prompt,
    moduleId: session.moduleId || "legacy",
    moduleKind: session.moduleKind || "talk",
    tags,
    createdAt: session.createdAt || now,
    updatedAt: session.updatedAt || session.createdAt || now,
    status: normalizedStatus,
    messages: Array.isArray(session.messages) ? session.messages : [],
    insight: session.insight || session.summary,
  };
};

export default function Home() {
  const [state, setState] = useState<CoachingState>(() => {
    if (typeof window === "undefined") {
      return emptyState;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return emptyState;
    }

    try {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const upgraded = parsed
          .map((legacy) => upgradeLegacySession(legacy))
          .filter((session): session is Session => Boolean(session));
        return {
          sessions: upgraded,
          overallSummary: emptyState.overallSummary,
        };
      }

      if (!parsed || typeof parsed !== "object") {
        return emptyState;
      }

      const objectValue = parsed as {
        sessions?: unknown;
        overallSummary?: unknown;
      };

      const upgradedSessions = Array.isArray(objectValue.sessions)
        ? objectValue.sessions
            .map((legacy) => upgradeLegacySession(legacy))
            .filter((session): session is Session => Boolean(session))
        : [];

      const overallSummary =
        typeof objectValue.overallSummary === "string" && objectValue.overallSummary
          ? objectValue.overallSummary
          : emptyState.overallSummary;

      return {
        sessions: upgradedSessions,
        overallSummary,
      };
    } catch (error) {
      console.error("Failed to parse stored state", error);
      return emptyState;
    }
  });
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const sessions = useMemo(() => {
    return [...state.sessions].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [state.sessions]);

  const selectedSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return state.sessions.find((session) => session.id === selectedSessionId) || null;
  }, [selectedSessionId, state.sessions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessions: state.sessions,
        overallSummary: state.overallSummary,
      })
    );
  }, [state.sessions, state.overallSummary]);

  const handleSessionSubmit = (data: SessionFormData) => {
    const now = new Date().toISOString();
    const newSession: Session = {
      id: generateId(),
      title: data.topic,
      prompt:
        data.goal.length > 0
          ? `${data.topic}について考えたい理由: ${data.goal}`
          : `${data.topic}について一緒に整理していきましょう。` ,
      moduleId: "custom-topic",
      moduleKind: "talk",
      tags: ["オリジナル", "進路"],
      createdAt: now,
      updatedAt: now,
      status: "in-progress",
      messages: [],
    };
    setState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
    }));
    setSelectedSessionId(newSession.id);
  };

  const handleStartModule = (module: {
    id: string;
    title: string;
    description: string;
    prompt: string;
    tags: string[];
    kind: "talk" | "tool";
  }) => {
    const now = new Date().toISOString();
    const newSession: Session = {
      id: generateId(),
      title: module.title,
      prompt: module.prompt,
      moduleId: module.id,
      moduleKind: module.kind,
      tags: module.tags,
      createdAt: now,
      updatedAt: now,
      status: "in-progress",
      messages: [],
    };
    setState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
    }));
    setSelectedSessionId(newSession.id);
    setIsHistoryOpen(false);
  };

  const handleSessionDelete = (id: string) => {
    if (!confirm("このセッションを削除しますか？")) {
      return;
    }
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((session) => session.id !== id),
    }));
    if (selectedSessionId === id) {
      setSelectedSessionId(null);
    }
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSessionId(session.id);
    setIsHistoryOpen(false);
  };

  const handleUpdateSession = (sessionId: string, messages: Message[]) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages,
              updatedAt: new Date().toISOString(),
            }
          : session
      ),
    }));
  };

  const handleSummariesGenerated = (
    sessionId: string,
    data: { insight: string; overallSummary: string }
  ) => {
    setState((prev) => ({
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              insight: data.insight,
            }
          : session
      ),
      overallSummary: data.overallSummary || prev.overallSummary,
    }));
  };

  const insightTimeline = useMemo(() => {
    return sessions
      .filter((session) => Boolean(session.insight))
      .slice(0, 4)
      .map((session) => ({
        id: session.id,
        title: session.title,
        insight: session.insight!,
        updatedAt: session.updatedAt,
      }));
  }, [sessions]);

  const interestTags = useMemo(() => {
    const counter = new Map<string, number>();
    sessions.forEach((session) => {
      session.tags.forEach((tag) => {
        counter.set(tag, (counter.get(tag) || 0) + 1);
      });
    });
    return Array.from(counter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [sessions]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-zinc-100 via-white to-zinc-100 font-sans text-zinc-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
              みかたくん
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              あなたの思考が見えるホーム
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              気になるトピックを選ぶと、5分ほどで考えが整理できる対話とワークに進めます。
            </p>
          </div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-emerald-400 hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            履歴を開く
          </button>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.8fr,1.2fr]">
          <section className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-zinc-100 backdrop-blur">
            <h2 className="text-sm font-semibold text-zinc-500">
              今のあなたの輪郭
            </h2>
            <p className="mt-4 text-lg leading-7 text-zinc-800">
              {state.overallSummary}
            </p>
            {interestTags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {interestTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {insightTimeline.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-500">
                  最近の気づき
                </h3>
                <ul className="space-y-4">
                  {insightTimeline.map((item) => (
                    <li key={item.id} className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-xs text-zinc-400">
                        {new Date(item.updatedAt).toLocaleDateString("ja-JP", {
                          month: "numeric",
                          day: "numeric",
                        })}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-zinc-700">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">{item.insight}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-emerald-500 p-6 text-white shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
              Quick Start
            </h2>
            <p className="mt-2 text-xl font-semibold">
              いま考えていることを整理する
            </p>
            <p className="mt-2 text-sm text-emerald-50/80">
              オリジナルのテーマでトークを始めると、ここにまとめられます。
            </p>
            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <SessionForm onSubmit={handleSessionSubmit} />
            </div>
          </section>
        </div>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
                Guided talk
              </p>
              <h2 className="text-2xl font-semibold text-zinc-900">
                5分で話せるトピック
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                その場で話したいテーマを選ぶと、みかたくんが会話をリードします。
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {TALK_TOPICS.map((topic) => (
              <div
                key={topic.id}
                className="flex h-full flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {topic.title}
                  </h3>
                  <p className="text-sm leading-6 text-zinc-500">
                    {topic.description}
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleStartModule({
                      ...topic,
                      kind: "talk",
                    })
                  }
                  className="mt-6 w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
                >
                  このテーマで話す
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
                Toolbox
              </p>
              <h2 className="text-2xl font-semibold text-zinc-900">
                考えを深めるワーク
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                サクッと取り組めるワークを通じて、自分の興味や価値観を見つけましょう。
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {TOOL_MODULES.map((tool) => (
              <div
                key={tool.id}
                className="flex h-full flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {tool.title}
                  </h3>
                  <p className="text-sm leading-6 text-zinc-500">
                    {tool.description}
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleStartModule({
                      ...tool,
                      kind: "tool",
                    })
                  }
                  className="mt-6 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-600 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-50"
                >
                  ワークを始める
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isHistoryOpen && (
        <div className="fixed inset-0 z-40 flex">
          <button
            className="flex-1 bg-black/40"
            aria-label="履歴を閉じる"
            onClick={() => setIsHistoryOpen(false)}
          />
          <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">履歴</h2>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200"
                aria-label="履歴を閉じる"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6 space-y-6">
              <SessionHistory
                sessions={sessions}
                onDelete={handleSessionDelete}
                onSessionClick={handleSessionClick}
              />
            </div>
          </aside>
        </div>
      )}

      {selectedSession && (
        <TalkView
          session={selectedSession}
          onClose={() => setSelectedSessionId(null)}
          onUpdateSession={handleUpdateSession}
          onSummariesGenerated={handleSummariesGenerated}
        />
      )}
    </div>
  );
}
