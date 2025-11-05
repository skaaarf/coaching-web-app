"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActiveSession, Message } from "../types/session";

interface TalkViewProps {
  session: ActiveSession;
  onClose: () => void;
  onUpdateSession: (messages: Message[]) => void;
  onEndSession: () => void;
  isEndingSession: boolean;
  overallSummary: string;
}

export default function TalkView({
  session,
  onClose,
  onUpdateSession,
  onEndSession,
  isEndingSession,
  overallSummary,
}: TalkViewProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hasUserMessage = useMemo(
    () => session.messages.some((message) => message.role === "user"),
    [session.messages]
  );

  useEffect(() => {
    if (!messagesEndRef.current) {
      return;
    }
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, isLoading]);

  const fetchAIResponse = useCallback(
    async (messages: Message[]) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            overallSummary,
            topic: session.topic,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "AIからの応答を取得できませんでした");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: data.message,
          role: "assistant",
          createdAt: new Date().toISOString(),
        };
        onUpdateSession([...messages, assistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        const fallbackMessage: Message = {
          id: crypto.randomUUID(),
          content: "ごめんね、少しうまく考えられなかった。もう一度送ってくれる?",
          role: "assistant",
          createdAt: new Date().toISOString(),
        };
        onUpdateSession([...messages, fallbackMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [onUpdateSession, overallSummary, session.topic]
  );

  useEffect(() => {
    const lastMessage = session.messages[session.messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user" || isLoading) {
      return;
    }
    fetchAIResponse(session.messages);
  }, [session.messages, isLoading, fetchAIResponse]);

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputMessage.trim(),
      role: "user",
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...session.messages, userMessage];
    onUpdateSession(updatedMessages);
    setInputMessage("");
  };

  const handleClose = () => {
    if (session.messages.some((message) => message.role === "user")) {
      const confirmClose = window.confirm(
        "対話を終了せずにホームへ戻りますか?"
      );
      if (!confirmClose) {
        return;
      }
    }
    onClose();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const typingIndicator = (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
        <div className="flex space-x-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
        </div>
      </div>
    </div>
  );

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[80%] space-y-1 rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser ? "bg-zinc-900 text-white" : "bg-white text-zinc-800"
          }`}
        >
          <p className="text-xs font-medium opacity-70">
            {isUser ? "あなた" : "みかたくん"}
          </p>
          <p className="whitespace-pre-wrap">{message.content}</p>
          <p className="text-right text-[10px] opacity-60">
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-100">
      <header className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-white px-6 py-4 shadow-sm">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          <span className="text-lg">←</span>
          <span>みかたくん</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs font-medium text-zinc-400 sm:block">
            今回のテーマ
          </div>
          <div className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700">
            {session.topic.title}
          </div>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-zinc-100 px-4 py-6"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          <div className="flex justify-center">
            <div className="max-w-xl rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600 shadow-sm">
              {session.topic.description}
            </div>
          </div>
          {session.messages.map(renderMessage)}
          {isLoading && typingIndicator}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-white px-6 py-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(event) => setInputMessage(event.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
            disabled={isLoading || isEndingSession}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading || isEndingSession}
            className="rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            送信
          </button>
        </form>
        <button
          onClick={onEndSession}
          disabled={isLoading || isEndingSession || !hasUserMessage}
          className="mt-3 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEndingSession ? "要約を作成中..." : "対話を終える"}
        </button>
      </div>
    </div>
  );
}
