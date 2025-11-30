'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Message } from '@/types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
  moduleContext?: {
    moduleId?: string;
    moduleTitle?: string;
    gameResults?: string;
  };
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  placeholder = 'メッセージを入力...',
  moduleContext
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Separate messages into older and latest two
  const olderMessages = messages.length > 2 ? messages.slice(0, -2) : [];
  const latestMessages = messages.length > 2 ? messages.slice(-2) : messages;

  // Fetch suggested questions based on conversation
  useEffect(() => {
    // Scroll to bottom whenever messages or loading state changes
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 0 || isLoading) return;

    let isSubscribed = true;
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/suggest-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages,
            moduleContext
          }),
        });

        if (!isSubscribed) return;

        if (response.ok) {
          const data = await response.json();
          setSuggestedQuestions(data.questions || []);
        } else {
          setSuggestedQuestions([]);
        }
      } catch (error) {
        if (isSubscribed) {
          console.error('Error fetching suggested questions:', error);
          setSuggestedQuestions([]);
        }
      }
    };

    fetchSuggestions();

    return () => {
      isSubscribed = false;
    };
  }, [isLoading, messages, moduleContext]);

  useEffect(() => {
    // Scroll to bottom when suggestions are updated
    if (suggestedQuestions.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [suggestedQuestions]);

  const adjustInputHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  useEffect(() => {
    adjustInputHeight();
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setInput('');
    await onSendMessage(userInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedQuestionClick = async (question: string) => {
    if (isLoading) return;
    setSuggestedQuestions([]);
    try {
      await onSendMessage(question);
    } catch (error) {
      console.error('Error sending suggested question:', error);
    }
  };

  const handleInputFocus = () => {
    // Clear suggestions when user focuses on input field
    if (suggestedQuestions.length > 0) {
      setSuggestedQuestions([]);
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const timeLabel = new Date(message.timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (message.role === 'assistant') {
      return (
        <div key={index} className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border border-blue-100 bg-blue-50 shadow-inner">
              <Image
                src="/mascot/coach-standing.png"
                alt="AI進路くん"
                fill
                sizes="40px"
                className="object-cover"
                priority={false}
              />
            </div>
            <span className="text-gray-900 font-semibold text-sm">AI進路くん</span>
            <span>{timeLabel}</span>
          </div>
          <div className="border border-gray-200 bg-white rounded-2xl px-4 py-3 shadow-sm max-w-full">
            <p className="whitespace-pre-wrap break-words text-sm text-gray-900 leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="flex justify-end">
        <div className="max-w-[70%] flex flex-col items-end gap-1">
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>{timeLabel}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 bg-white">
              <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600">
                私
              </span>
              あなた
            </span>
          </div>
          <div className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-900 shadow-sm whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto" style={{ fontSize: '80%' }}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* Older messages (if any) */}
        {olderMessages.map((message, index) => renderMessage(message, index))}

        {/* Latest two messages in a min-height container */}
        {(latestMessages.length > 0 || isLoading) && (
          <div className="min-h-[50vh] space-y-4">
            {latestMessages.map((message, index) =>
              renderMessage(message, olderMessages.length + index)
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t-2 border-gray-300 bg-white px-3 py-4 shadow-lg">
        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && !isLoading && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-gray-700 font-bold">💡 こんな質問はどう？</div>
              <div className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">
                タップですぐ送信
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestedQuestionClick(question)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 active:from-blue-200 active:to-indigo-200 border-2 border-blue-400 hover:border-blue-500 rounded-xl text-gray-800 hover:text-gray-900 font-medium transition-all shadow-sm hover:shadow-md active:shadow-lg touch-manipulation"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 px-4 py-3 text-gray-600">
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
              </div>
              <div className="flex-1 text-sm font-semibold min-w-0 truncate">AI進路くんが考え中です…</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">少し待っててね</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-end space-x-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustInputHeight();
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                handleInputFocus();
                adjustInputHeight();
              }}
              placeholder={placeholder}
              rows={1}
              className="flex-1 resize-none rounded-xl border-2 border-gray-400 px-4 py-3 font-medium focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ maxHeight: '180px', fontSize: '16px' }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-5 py-3 text-sm font-bold text-white focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:shadow-xl whitespace-nowrap touch-manipulation"
            >
              送信
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
