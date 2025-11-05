"use client";

import { useState } from "react";
import { SessionFormData } from "../types/session";

interface SessionFormProps {
  onSubmit: (data: SessionFormData) => void;
}

export default function SessionForm({ onSubmit }: SessionFormProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit({ question: question.trim() });
      setQuestion("");
    }
  };

  const isSubmitDisabled = question.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label
          htmlFor="question"
          className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          コーチングの質問を入力してください
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="例: 今週の目標を達成するために、どのような行動を取るべきか？"
          rows={4}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-600 sm:w-auto sm:px-8"
      >
        セッションを開始
      </button>
    </form>
  );
}

