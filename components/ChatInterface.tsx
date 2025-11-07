'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  placeholder = 'メッセージを入力...'
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Separate messages into older and latest two
  const olderMessages = messages.length > 2 ? messages.slice(0, -2) : [];
  const latestMessages = messages.length > 2 ? messages.slice(-2) : messages;

  // Fetch suggested questions based on conversation
  const fetchSuggestedQuestions = async () => {
    if (messages.length === 0 || isLoading) return;

    setLoadingSuggestions(true);
    try {
      const response = await fetch('/api/suggest-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestedQuestions(data.questions || []);
      } else {
        setSuggestedQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggested questions:', error);
      setSuggestedQuestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom whenever messages or loading state changes
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    // Generate new questions when conversation updates (but not while AI is responding)
    if (messages.length > 0 && !isLoading) {
      fetchSuggestedQuestions();
    }
  }, [messages.length, isLoading]);

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
    // Clear suggestions immediately
    setSuggestedQuestions([]);
    // Send the question directly without populating input field
    await onSendMessage(question);
  };

  const renderMessage = (message: Message, index: number) => (
    <div
      key={index}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-md ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-900 border-2 border-gray-300'
        }`}
      >
        <div className="whitespace-pre-wrap break-words text-base sm:text-lg leading-relaxed font-medium">{message.content}</div>
        <div
          className={`text-xs sm:text-sm mt-2 font-medium ${
            message.role === 'user' ? 'text-blue-100' : 'text-gray-600'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Older messages (if any) */}
        {olderMessages.map((message, index) => renderMessage(message, index))}

        {/* Latest two messages in a min-height container */}
        {latestMessages.length > 0 && (
          <div className="min-h-[50vh] space-y-4 sm:space-y-6">
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
      <div className="border-t-2 border-gray-300 bg-white px-3 sm:px-4 py-4 sm:py-5 shadow-lg">
        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && !isLoading && (
          <div className="mb-4 space-y-2">
            <div className="text-sm text-gray-700 font-semibold mb-2">💡 こんな質問はどう？</div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestedQuestionClick(question)}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 active:from-blue-200 active:to-indigo-200 border-2 border-blue-300 rounded-full text-xs sm:text-sm text-gray-800 hover:text-gray-900 font-medium transition-all hover:shadow-lg active:shadow-xl touch-manipulation"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-2 sm:space-x-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none rounded-xl border-2 border-gray-400 px-4 py-3 text-base sm:text-lg font-medium focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-900 shadow-sm"
            style={{ maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-5 sm:px-7 py-3 sm:py-3.5 text-base sm:text-lg font-bold text-white focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:shadow-xl whitespace-nowrap touch-manipulation"
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
}
