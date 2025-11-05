"use client";

import { useState, useEffect } from "react";
import { Session, Message } from "./types/session";
import SessionForm from "./components/SessionForm";
import SessionHistory from "./components/SessionHistory";
import TalkView from "./components/TalkView";

const STORAGE_KEY = "coaching-sessions";

// タイトル生成関数：メッセージから自動的にタイトルを生成
const generateTitle = (message: string): string => {
  // 最初の50文字まで、または最初の句点まで
  const firstSentence = message.split(/[。.!?！？]/)[0];
  const title = firstSentence.length > 40
    ? firstSentence.substring(0, 40) + "..."
    : firstSentence;
  return title || "新しいセッション";
};

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const storedSessions = window.localStorage.getItem(STORAGE_KEY);
    if (!storedSessions) {
      return [];
    }

    try {
      const parsed = JSON.parse(storedSessions);
      return parsed.map((session: Session) => ({
        ...session,
        messages: session.messages || [],
        title: session.title || generateTitle(session.question), // 既存セッションの互換性
      }));
    } catch (error) {
      console.error("Failed to parse stored sessions:", error);
      return [];
    }
  });
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [initialMessage, setInitialMessage] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // セッションが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // 最初のメッセージ送信ハンドラー：セッションを自動作成
  const handleInitialMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialMessage.trim() || isCreatingSession) return;

    setIsCreatingSession(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: initialMessage.trim(),
      role: "user",
      createdAt: new Date().toISOString(),
    };

    const newSession: Session = {
      id: crypto.randomUUID(),
      title: generateTitle(initialMessage.trim()),
      question: initialMessage.trim(),
      createdAt: new Date().toISOString(),
      status: "active",
      messages: [userMessage],
    };

    setSessions((prev) => [newSession, ...prev]);
    setSelectedSession(newSession);
    setInitialMessage("");
    setIsCreatingSession(false);
  };

  const handleSessionDelete = (id: string) => {
    if (confirm("このセッションを削除してもよろしいですか？")) {
      setSessions((prev) => prev.filter((session) => session.id !== id));
      if (selectedSession?.id === id) {
        setSelectedSession(null);
      }
    }
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
  };

  const handleUpdateSession = (sessionId: string, messages: Message[]) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, messages } : session
      )
    );
    // 選択中のセッションも更新
    if (selectedSession?.id === sessionId) {
      setSelectedSession({ ...selectedSession, messages });
    }
  };

  const handleCloseTalkView = () => {
    setSelectedSession(null);
  };

  // セッションを日付の新しい順にソート
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const hasNoSessions = sessions.length === 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {hasNoSessions ? (
        // 初回訪問時：大きなチャット入力を表示
        <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-8 px-6 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              コーチングセッション
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              質問を入力して、AIコーチングを始めましょう
            </p>
          </div>

          <form onSubmit={handleInitialMessage} className="w-full space-y-4">
            <div className="relative">
              <textarea
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                placeholder="何について話したいですか？"
                rows={6}
                className="w-full rounded-2xl border border-zinc-300 bg-white px-6 py-4 text-lg text-zinc-900 placeholder-zinc-400 shadow-lg focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
                disabled={isCreatingSession}
              />
            </div>
            <button
              type="submit"
              disabled={!initialMessage.trim() || isCreatingSession}
              className="w-full rounded-xl bg-zinc-900 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isCreatingSession ? "作成中..." : "セッションを開始"}
            </button>
          </form>
        </main>
      ) : (
        // セッションがある場合：コンパクトなフォームと履歴を表示
        <main className="flex min-h-screen w-full max-w-4xl flex-col gap-8 py-12 px-6 sm:px-8 md:px-12">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              コーチングセッション
            </h1>

            <form onSubmit={handleInitialMessage} className="w-full">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="新しいセッションを開始..."
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                  disabled={isCreatingSession}
                />
                <button
                  type="submit"
                  disabled={!initialMessage.trim() || isCreatingSession}
                  className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {isCreatingSession ? "作成中..." : "開始"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <SessionHistory
              sessions={sortedSessions}
              onDelete={handleSessionDelete}
              onSessionClick={handleSessionClick}
            />
          </div>
        </main>
      )}

      {selectedSession && (
        <TalkView
          session={selectedSession}
          onClose={handleCloseTalkView}
          onUpdateSession={handleUpdateSession}
        />
      )}
    </div>
  );
}
