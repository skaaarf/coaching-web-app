"use client";

import { Session } from "../types/session";

interface SessionCardProps {
  session: Session;
  onDelete: (id: string) => void;
  onClick: (session: Session) => void;
}

const KIND_LABEL: Record<Session["moduleKind"], string> = {
  talk: "トーク",
  tool: "ワーク",
};

export default function SessionCard({
  session,
  onDelete,
  onClick,
}: SessionCardProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      month: "numeric",
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
    <button
      type="button"
      onClick={() => onClick(session)}
      className="w-full rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {KIND_LABEL[session.moduleKind]}
            </span>
            <span>{formatDateTime(session.updatedAt || session.createdAt)}</span>
            {session.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {session.title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {session.insight || session.prompt}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800 dark:hover:text-red-300"
          aria-label="セッションを削除"
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
    </button>
  );
}
