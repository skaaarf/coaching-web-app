"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Session, Message } from "../types/session";

interface TalkViewProps {
  session: Session;
  onClose: () => void;
  onUpdateSession: (sessionId: string, messages: Message[]) => void;
}

export default function TalkView({
  session,
  onClose,
  onUpdateSession,
}: TalkViewProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAutoReplied, setHasAutoReplied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestUserMessageRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const lastUserMessageId = useMemo(() => {
    for (let i = session.messages.length - 1; i >= 0; i--) {
      if (session.messages[i].role === "user") {
        return session.messages[i].id;
      }
    }
    return null;
  }, [session.messages]);

  // メッセージが更新されたら自動スクロール
  useEffect(() => {
    const lastMessage = session.messages[session.messages.length - 1];

    const container = scrollContainerRef.current;

    if (!lastMessage || !container) {
      return;
    }

    if (lastMessage.role === "user" && latestUserMessageRef.current) {
      const messageRect = latestUserMessageRef.current.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offset = messageRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: Math.max(offset - 16, 0),
        behavior: "smooth",
      });
      return;
    }

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [session.messages]);

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
            messages: messages,
            sessionQuestion: session.question,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to get AI response");
        }

        const data = await response.json();
        const coachMessage: Message = {
          id: crypto.randomUUID(),
          content: data.message,
          role: "coach",
          createdAt: new Date().toISOString(),
        };
        onUpdateSession(session.id, [...messages, coachMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          content: "申し訳ございません。エラーが発生しました。もう一度お試しください。",
          role: "coach",
          createdAt: new Date().toISOString(),
        };
        onUpdateSession(session.id, [...messages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [onUpdateSession, session.id, session.question]
  );

  // 最初のメッセージに自動応答
  useEffect(() => {
    const lastMessage = session.messages[session.messages.length - 1];
    const shouldAutoReply =
      !hasAutoReplied &&
      session.messages.length > 0 &&
      lastMessage?.role === "user" &&
      !isLoading;

    if (shouldAutoReply) {
      setHasAutoReplied(true);
      fetchAIResponse(session.messages);
    }
  }, [session.messages, hasAutoReplied, isLoading, fetchAIResponse]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputMessage.trim(),
      role: "user",
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...session.messages, userMessage];
    onUpdateSession(session.id, updatedMessages);
    setInputMessage("");

    await fetchAIResponse(updatedMessages);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { earlierMessages, focusedMessages } = (() => {
    if (session.messages.length === 0) {
      return { earlierMessages: [], focusedMessages: [] as Message[] };
    }

    const lastUserIndex = [...session.messages].reduce(
      (latestIndex, message, index) =>
        message.role === "user" ? index : latestIndex,
      -1
    );

    if (lastUserIndex === -1) {
      return {
        earlierMessages: session.messages.slice(0, -1),
        focusedMessages: [session.messages[session.messages.length - 1]],
      };
    }

    const nextCoachIndex = session.messages.findIndex(
      (message, index) => index > lastUserIndex && message.role === "coach"
    );

    if (nextCoachIndex === -1) {
      return {
        earlierMessages: session.messages.slice(0, lastUserIndex),
        focusedMessages: session.messages.slice(lastUserIndex),
      };
    }

    return {
      earlierMessages: session.messages.slice(0, lastUserIndex),
      focusedMessages: session.messages.slice(lastUserIndex, nextCoachIndex + 1),
    };
  })();

  const typingIndicator = (
    <div className="flex justify-start">
      <div className="rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-800">
        <div className="flex space-x-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-500"></div>
        </div>
      </div>
    </div>
  );

  const renderMessageBubble = (message: Message) => {
    const isUserMessage = message.role === "user";
    const isLatestUserMessage = isUserMessage && message.id === lastUserMessageId;

    return (
      <div
        key={message.id}
        ref={isLatestUserMessage ? latestUserMessageRef : undefined}
        className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-2 ${
            isUserMessage
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          <p
            className={`mt-1 text-xs ${
              isUserMessage
                ? "text-zinc-300 dark:text-zinc-600"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-full w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {session.title}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              コーチングセッション
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* メッセージエリア */}
        <div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {session.messages.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-zinc-500 dark:text-zinc-400">
                  メッセージを送信して、コーチングを開始しましょう。
                </p>
              </div>
            )}
            {earlierMessages.map(renderMessageBubble)}
            {focusedMessages.length > 0 ? (
              <div className="min-h-[150vh] rounded-2xl border border-zinc-200 bg-white/60 p-4 pb-24 pt-20 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex h-full flex-col justify-end space-y-4">
                  {focusedMessages.map(renderMessageBubble)}
                  {isLoading && typingIndicator}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            ) : (
              <>
                {isLoading && typingIndicator}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* 入力エリア */}
        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              送信
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

