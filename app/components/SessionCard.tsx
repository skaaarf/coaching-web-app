"use client";

import { Session } from "../types/session";

interface SessionCardProps {
  session: Session;
  onDelete: (id: string) => void;
  onClick: (session: Session) => void;
}

export default function SessionCard({
  session,
  onDelete,
  onClick,
}: SessionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(session.id);
  };

  return (
    <div
      onClick={() => onClick(session)}
      className="w-full cursor-pointer rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                session.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}
            >
              {session.status === "active" ? "進行中" : "完了"}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatDate(session.createdAt)}
            </span>
            {session.messages && session.messages.length > 0 && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {session.messages.length}件のメッセージ
              </span>
            )}
          </div>
          <p className="text-zinc-900 dark:text-zinc-100">{session.title}</p>
        </div>
        <button
          onClick={handleDelete}
          className="ml-4 rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800 dark:hover:text-red-400"
          aria-label="セッションを削除"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

