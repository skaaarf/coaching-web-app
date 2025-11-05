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
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/60">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          まだセッションがありません。気になるトピックから始めてみましょう。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">History</p>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            最近のトーク・ワーク
          </h2>
        </div>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">{sessions.length}件</span>
      </div>
      <div className="space-y-3">
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
