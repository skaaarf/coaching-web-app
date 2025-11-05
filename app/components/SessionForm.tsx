"use client";

import { useState } from "react";
import { SessionFormData } from "../types/session";

interface SessionFormProps {
  onSubmit: (data: SessionFormData) => void;
}

export default function SessionForm({ onSubmit }: SessionFormProps) {
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      return;
    }
    onSubmit({
      topic: topic.trim(),
      goal: goal.trim(),
    });
    setTopic("");
    setGoal("");
  };

  const isSubmitDisabled = topic.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <label
          htmlFor="topic"
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        >
          今日考えたいテーマ
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例: 親に進路の話を切り出す方法"
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="goal"
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
        >
          このトークで得たいこと (任意)
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="例: 自分の考えを整理して、親にどう伝えるか考えたい"
          rows={3}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          オリジナルトークを始める
        </button>
      </div>
    </form>
  );
}
