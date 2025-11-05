"use client";

import { useState, useEffect } from "react";
import { Session, SessionFormData, Message } from "./types/session";
import SessionForm from "./components/SessionForm";
import SessionHistory from "./components/SessionHistory";
import TalkView from "./components/TalkView";

const STORAGE_KEY = "coaching-sessions";

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
      }));
    } catch (error) {
      console.error("Failed to parse stored sessions:", error);
      return [];
    }
  });
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // セッションが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const handleSessionSubmit = (data: SessionFormData) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      question: data.question,
      createdAt: new Date().toISOString(),
      status: "active",
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col gap-12 py-16 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              コーチングセッション
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              質問を入力して、新しいコーチングセッションを開始しましょう。
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <SessionForm onSubmit={handleSessionSubmit} />
          </div>
        </div>

        <div className="space-y-6">
          <SessionHistory
            sessions={sortedSessions}
            onDelete={handleSessionDelete}
            onSessionClick={handleSessionClick}
          />
        </div>
      </main>

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
