'use client';

import { useState, useRef, useEffect } from 'react';
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
        body: JSON.stringify({
          messages,
          moduleContext
        }),
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

  useEffect(() => {
    // Scroll to bottom when suggestions are updated
    if (suggestedQuestions.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [suggestedQuestions]);

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

  const handleSuggestedQuestionClick = (question: string) => {
    // Populate the input field with the question instead of sending directly
    // This allows users to edit the question before sending
    setInput(question);
    // Clear suggestions after selecting one
    setSuggestedQuestions([]);
  };

  const renderMessage = (message: Message, index: number) => (
    <div
      key={index}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-900 border-2 border-gray-300'
        }`}
      >
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed font-medium">{message.content}</div>
        <div
          className={`text-xs mt-2 font-medium ${
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
    <div className="flex flex-col h-full" style={{ fontSize: '80%' }}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* Older messages (if any) */}
        {olderMessages.map((message, index) => renderMessage(message, index))}

        {/* Latest two messages in a min-height container */}
        {latestMessages.length > 0 && (
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
                タップして編集可能
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
                  ✏️ {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none rounded-xl border-2 border-gray-400 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-900 shadow-sm"
            style={{ maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-5 py-3 text-sm font-bold text-white focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:shadow-xl whitespace-nowrap touch-manipulation"
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
}
