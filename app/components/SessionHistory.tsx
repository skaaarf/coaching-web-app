"use client";

import { Session } from "../types/session";
import SessionCard from "./SessionCard";

interface SessionHistoryProps {
  sessions: Session[];
  onDelete: (id: string) => void;
  onSessionClick: (session: Session) => void;
}

export default function SessionHistory({
  sessions,
  onDelete,
  onSessionClick,
}: SessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <div className="w-full rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500 dark:text-zinc-400">
          まだセッションがありません。上記のフォームから新しいセッションを開始してください。
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        セッション履歴 ({sessions.length})
      </h2>
      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onDelete={onDelete}
            onClick={onSessionClick}
          />
        ))}
      </div>
    </div>
  );
}

