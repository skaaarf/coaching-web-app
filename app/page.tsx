"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "mikata-simple-chat";

const createAssistantMessage = (content: string): Message => ({
  id: crypto.randomUUID(),
  role: "assistant",
  content,
  createdAt: new Date().toISOString(),
});

const INITIAL_MESSAGE_TEXT =
  "こんにちは。進路について一緒に整理してみようか。今どんなことが気になっている?";

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setHasHydrated(true);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to load stored messages", error);
    }

    setMessages([createAssistantMessage(INITIAL_MESSAGE_TEXT)]);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, hasHydrated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const typingIndicator = useMemo(
    () => (
      <div className="flex justify-start">
        <div className="rounded-3xl bg-zinc-900 px-4 py-3 text-sm text-zinc-200 shadow-lg shadow-black/20">
          <div className="flex space-x-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" />
          </div>
        </div>
      </div>
    ),
    []
  );

  const handleNewChat = () => {
    if (isSending) {
      return;
    }
    setErrorMessage(null);
    setMessages([createAssistantMessage(INITIAL_MESSAGE_TEXT)]);
  };

  const sendMessage = async (nextInput: string) => {
    const trimmed = nextInput.trim();
    if (!trimmed || isSending) {
      return;
    }

    setErrorMessage(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "AIからの応答を取得できませんでした");
      }

      const data = await response.json();
      const assistantContent =
        typeof data.message === "string" && data.message.trim().length > 0
          ? data.message.trim()
          : "ごめんね、うまく考えられなかった。もう一度聞かせてくれる?";

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: assistantContent,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Failed to send message", error);
      setErrorMessage("通信に失敗しました。時間をおいてもう一度お試しください。");
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "ごめんね、少しうまく考えられなかった。もう一度送ってくれる?",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(inputValue);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    return (
      <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-2xl space-y-2 rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-lg shadow-black/20 ${
            isUser
              ? "bg-emerald-500 text-emerald-50"
              : "bg-zinc-900 text-zinc-100"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-100/80">
            {isUser ? "あなた" : "みかたくん"}
          </p>
          <p className="whitespace-pre-wrap text-[15px]">{message.content}</p>
          <p className="text-right text-[10px] uppercase tracking-wide text-emerald-100/60">
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-900/80 px-6 py-4">
        <div className="flex flex-col text-sm">
          <span className="text-lg font-semibold text-white">みかたくん</span>
          <span className="text-xs text-zinc-500">高校生の進路相談チャット</span>
        </div>
        <button
          type="button"
          onClick={handleNewChat}
          disabled={isSending}
          className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          新しいチャット
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
          {messages.map(renderMessage)}
          {isSending ? typingIndicator : null}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="border-t border-zinc-900/80 bg-zinc-950 px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-3xl items-end gap-3"
        >
          <textarea
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力して Enter で送信 (改行は Shift + Enter)"
            rows={1}
            className="min-h-[52px] flex-1 resize-none rounded-3xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 shadow-inner shadow-black/20 placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !inputValue.trim()}
            className="flex h-12 items-center rounded-3xl bg-emerald-500 px-6 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            送信
          </button>
        </form>
        {errorMessage ? (
          <p className="mx-auto mt-3 max-w-3xl text-xs text-red-400">{errorMessage}</p>
        ) : null}
      </footer>
    </div>
  );
}
