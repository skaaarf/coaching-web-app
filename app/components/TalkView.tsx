"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Message, Session } from "../types/session";

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

interface TalkViewProps {
  session: Session;
  onClose: () => void;
  onUpdateSession: (sessionId: string, messages: Message[]) => void;
  onSummariesGenerated: (
    sessionId: string,
    data: { insight: string; overallSummary: string }
  ) => void;
}

export default function TalkView({
  session,
  onClose,
  onUpdateSession,
  onSummariesGenerated,
}: TalkViewProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageId = useRef<string | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [session.messages.length]);

  const assistantIntro = useMemo(() => {
    return `こんにちは。今日は「${session.title}」について一緒に考えてみよう。${session.prompt}`;
  }, [session]);

  // 自動で最初のメッセージを送る
  useEffect(() => {
    if (session.messages.length === 0 && !isLoading) {
      const introMessage: Message = {
        id: generateId(),
        content: assistantIntro,
        role: "coach",
        createdAt: new Date().toISOString(),
      };
      onUpdateSession(session.id, [introMessage]);
    }
  }, [assistantIntro, isLoading, onUpdateSession, session.id, session.messages.length]);

  const summarizeSession = useCallback(
    async (messages: Message[]) => {
      setIsSummarizing(true);
      try {
        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session,
            messages,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to summarize session");
        }

        const data = await response.json();
        onSummariesGenerated(session.id, {
          insight: data.session_insight,
          overallSummary: data.overall_summary,
        });
      } catch (error) {
        console.error("Error summarizing session:", error);
      } finally {
        setIsSummarizing(false);
      }
    },
    [onSummariesGenerated, session]
  );

  const sendMessagesToAI = useCallback(
    async (messages: Message[]) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session,
            messages,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to get AI response");
        }

        const data = await response.json();
        const coachMessage: Message = {
          id: generateId(),
          content: data.message,
          role: "coach",
          createdAt: new Date().toISOString(),
        };
        const updatedMessages = [...messages, coachMessage];
        onUpdateSession(session.id, updatedMessages);
        await summarizeSession(updatedMessages);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: generateId(),
          content: "エラーが発生しました。少し時間を置いてから再度お試しください。",
          role: "coach",
          createdAt: new Date().toISOString(),
        };
        onUpdateSession(session.id, [...messages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [onUpdateSession, session, summarizeSession]
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      content: inputMessage.trim(),
      role: "user",
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...session.messages, userMessage];
    setInputMessage("");
    onUpdateSession(session.id, nextMessages);
    await sendMessagesToAI(nextMessages);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    return (
      <div
        key={message.id}
        ref={(node) => {
          if (node && message.id === lastMessageId.current) {
            node.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          }`}
        >
          {message.content.split("\n").map((line, index) => (
            <p key={index} className={index > 0 ? "mt-2" : undefined}>
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (session.messages.length > 0) {
      lastMessageId.current = session.messages[session.messages.length - 1].id;
    }
  }, [session.messages]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-zinc-50 shadow-2xl dark:bg-zinc-900">
        <header className="border-b border-zinc-200 bg-white/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
                {session.moduleKind === "talk" ? "Guided Talk" : "Self Work"}
              </p>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {session.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {session.insight || session.prompt}
              </p>
              <div className="flex flex-wrap gap-2">
                {session.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              aria-label="閉じる"
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
        </header>

        <div className="flex-1 overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="h-full space-y-4 overflow-y-auto bg-zinc-100/60 px-6 py-6 dark:bg-zinc-900/40"
          >
            {session.messages.map(renderMessage)}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm dark:bg-zinc-800 dark:text-zinc-300">
                  考え中...
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="space-y-2 border-t border-zinc-200 bg-white/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
          {isSummarizing && (
            <p className="text-xs text-emerald-600 dark:text-emerald-300">
              対話内容を整理しています...
            </p>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="考えたことを入力してください"
              rows={2}
              className="flex-1 resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
            <button
              type="submit"
              disabled={isLoading || inputMessage.trim().length === 0}
              className="self-end rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              送信
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
