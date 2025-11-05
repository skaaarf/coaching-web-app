"use client";

import { useEffect, useMemo, useState } from "react";
import TalkView from "./components/TalkView";
import {
  ActiveSession,
  Message,
  SessionRecord,
  SessionStore,
} from "./types/session";

const STORAGE_KEY = "mikata-session-store";

const GREETING_MESSAGE =
  "こんにちは。前回の話の続きからでもいいし、新しいことでもいいよ。何を話したい?";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const loadStore = (): SessionStore => ({ sessions: [], overallSummary: "" });

const formatTimelineDate = (date: string) => {
  const target = new Date(date);
  const month = target.getMonth() + 1;
  const day = target.getDate();
  const weekday = WEEKDAYS[target.getDay()];
  return `${month}/${day}(${weekday})`;
};

const formatDuration = (minutes: number) => {
  if (minutes <= 0) {
    return "合計0分";
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) {
    return `合計${mins}分`;
  }
  return `合計${hours}時間${mins}分`;
};

const formatLastSession = (sessions: SessionRecord[]) => {
  if (sessions.length === 0) {
    return "-";
  }
  const lastSession = sessions[sessions.length - 1];
  const diff = Date.now() - new Date(lastSession.date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) {
    return "たった今";
  }
  if (minutes < 60) {
    return `${minutes}分前`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}時間前`;
  }
  const days = Math.floor(hours / 24);
  return `${days}日前`;
};

const getLastUserMessage = (messages: Message[]) => {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") {
      return messages[i];
    }
  }
  return null;
};

export default function Home() {
  const [store, setStore] = useState<SessionStore>(loadStore);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [endSessionError, setEndSessionError] = useState<string | null>(null);

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
        setStore({
          sessions: parsed.sessions,
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
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [store.sessions]
  );

  const handleStartSession = () => {
    if (activeSession) {
      return;
    }
    setEndSessionError(null);
    const now = new Date().toISOString();
    const greeting: Message = {
      id: crypto.randomUUID(),
      content: GREETING_MESSAGE,
      role: "assistant",
      createdAt: now,
    };
    setActiveSession({
      id: crypto.randomUUID(),
      startedAt: now,
      messages: [greeting],
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
          })),
          previousOverallSummary: store.overallSummary,
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
        Math.round(
          (Date.now() - new Date(activeSession.startedAt).getTime()) / 60000
        )
      );

      const newSession: SessionRecord = {
        id: activeSession.id,
        date: activeSession.startedAt,
        messages: activeSession.messages,
        insight: sessionInsight,
        durationMinutes,
      };

      setStore((prev) => ({
        sessions: [...prev.sessions, newSession],
        overallSummary,
      }));
      setActiveSession(null);
    } catch (error) {
      console.error(error);
      setEndSessionError(
        error instanceof Error ? error.message : "要約の生成に失敗しました"
      );
      if (typeof window !== "undefined") {
        window.alert(
          error instanceof Error ? error.message : "要約の生成に失敗しました"
        );
      }
    } finally {
      setIsEndingSession(false);
    }
  };

  const totalMinutes = useMemo(
    () => store.sessions.reduce((acc, session) => acc + session.durationMinutes, 0),
    [store.sessions]
  );

  const hasSessions = store.sessions.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10 sm:px-10">
        {hasSessions ? (
          <header className="flex items-center justify-between border-b border-zinc-200 pb-6">
            <div>
              <p className="text-sm font-medium text-zinc-500">みかたくん</p>
              <h1 className="mt-1 text-2xl font-bold">あなたの思考が見えるホーム</h1>
            </div>
            <button
              onClick={handleStartSession}
              className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              対話を続ける
            </button>
          </header>
        ) : (
          <header className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-full bg-zinc-900 px-5 py-1 text-sm font-medium text-white">
              みかたくん
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                こんにちは。
              </h1>
              <p className="text-lg text-zinc-600">
                進路のこと、一緒に考えよう。<br />
                匿名だから、本音で話していいよ。
              </p>
            </div>
            <button
              onClick={handleStartSession}
              className="mt-2 w-full max-w-xs rounded-2xl bg-zinc-900 px-6 py-3 text-lg font-medium text-white shadow transition hover:bg-zinc-800"
            >
              対話を始める
            </button>
          </header>
        )}

        {hasSessions && (
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                あなたについて
              </h2>
              <div className="mt-3 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-800">
                  {store.overallSummary || "これまでの対話の要約はまだありません。"}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                思考の変化
              </h2>
              <div className="mt-3 space-y-6">
                {sortedSessions.map((session, index) => {
                  const lastUserMessage = getLastUserMessage(session.messages);
                  return (
                    <div
                      key={session.id}
                      className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                    >
                      <div className="text-xs font-medium text-zinc-500">
                        {formatTimelineDate(session.date)} {index + 1}回目の対話
                      </div>
                      <div className="mt-3 space-y-2 text-zinc-800">
                        {lastUserMessage && (
                          <p className="text-sm text-zinc-600">
                            「{lastUserMessage.content}」
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-zinc-400">→</span>
                          <p className="font-medium text-zinc-800">
                            {session.insight}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                統計
              </h2>
              <div className="mt-3 grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-zinc-500">対話回数</p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    {store.sessions.length}回
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">考えた時間</p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    {formatDuration(totalMinutes)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">最後の対話</p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    {formatLastSession(sortedSessions)}
                  </p>
                </div>
              </div>
            </section>

            <div className="flex justify-center">
              <button
                onClick={handleStartSession}
                className="rounded-full bg-zinc-900 px-8 py-3 text-base font-medium text-white shadow transition hover:bg-zinc-800"
              >
                続きを話す
              </button>
            </div>
          </div>
        )}

        {endSessionError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {endSessionError}
          </div>
        )}
      </main>

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
