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
        <div key={index} className="flex flex-col items-start gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative rounded-2xl overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-teal-50 shadow-md">
              <Image
                src="/mascot/coach-standing.png"
                alt="AI進路くん"
                fill
                sizes="48px"
                className="object-cover"
                priority={false}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">AI進路くん</div>
              <div className="text-xs text-gray-500">{timeLabel}</div>
            </div>
          </div>
          <div className="ml-[60px] border border-gray-200 bg-white rounded-2xl px-5 py-4 shadow-sm max-w-full hover:shadow-md transition-shadow">
            <p className="whitespace-pre-wrap break-words text-base text-gray-900 leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="flex justify-end animate-fade-in">
        <div className="max-w-[75%] flex flex-col items-end gap-2">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>{timeLabel}</span>
          </div>
          <div className="w-full bg-blue-600 rounded-2xl px-5 py-4 text-base text-white shadow-md whitespace-pre-wrap hover:bg-blue-700 transition-colors">
            {message.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gray-50">
        {/* Older messages (if any) */}
        {olderMessages.map((message, index) => renderMessage(message, index))}

        {/* Latest two messages in a min-height container */}
        {(latestMessages.length > 0 || isLoading) && (
          <div className="min-h-[50vh] space-y-4">
            {latestMessages.map((message, index) =>
              renderMessage(message, olderMessages.length + index)
            )}

            {isLoading && (
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 relative rounded-2xl overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-teal-50 shadow-md">
                    <Image
                      src="/mascot/coach-standing.png"
                      alt="AI進路くん"
                      fill
                      sizes="48px"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">AI進路くん</div>
                    <div className="text-xs text-gray-500">入力中...</div>
                  </div>
                </div>
                <div className="ml-[60px] bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-300 bg-white px-4 py-5 shadow-xl">
        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && !isLoading && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-gray-900 font-bold text-base">💡 おすすめの質問</div>
              <div className="text-gray-500 bg-blue-50 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                タップで送信
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestedQuestionClick(question)}
                  className="px-4 py-3 bg-white hover:bg-blue-50 border-2 border-blue-300 hover:border-blue-500 rounded-2xl text-gray-900 font-medium transition-all shadow-sm hover:shadow-md active:scale-95 touch-manipulation text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 px-5 py-4 text-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
                <span className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
              </div>
              <div className="flex-1 text-base font-semibold min-w-0 truncate">AI進路くんが考え中...</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">少々お待ちください</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
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
              className="flex-1 resize-none rounded-2xl border-2 border-gray-300 px-5 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50 focus:bg-white shadow-sm hover:border-gray-400 transition-all overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ maxHeight: '180px', fontSize: '16px' }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-6 py-4 text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap touch-manipulation"
            >
              送信
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
