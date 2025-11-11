'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getModuleById } from '@/lib/modules';
import { useStorage } from '@/hooks/useStorage';
import { Message, ModuleProgress } from '@/types';
import ChatInterface from '@/components/ChatInterface';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const storage = useStorage();

  const [module, setModule] = useState(() => getModuleById(moduleId));
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!module) {
      router.push('/');
      return;
    }

    // Redirect interactive modules to the correct route
    if (module.moduleType === 'interactive') {
      router.push(`/interactive/${moduleId}`);
      return;
    }

    // Load existing progress
    const loadProgress = async () => {
      const progress = await storage.getModuleProgress(moduleId);

      if (progress && progress.messages.length > 0) {
        setMessages(progress.messages);
      } else {
        // Start new conversation with AI's greeting
        fetchInitialMessage();
      }

      setHasInitialized(true);
    };

    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, module, router, storage]);

  const fetchInitialMessage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [],
          systemPrompt: module?.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get initial message');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages([assistantMessage]);

      // Save progress
      const progress: ModuleProgress = {
        moduleId,
        messages: [assistantMessage],
        lastUpdated: new Date(),
        completed: false,
      };
      await storage.saveModuleProgress(moduleId, progress);
    } catch (error) {
      console.error('Error fetching initial message:', error);
      // Fallback greeting
      const fallbackMessage: Message = {
        role: 'assistant',
        content: 'こんにちは。一緒に考えていきましょう。',
        timestamp: new Date(),
      };
      setMessages([fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Call API
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt: module?.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Save progress
      const progress: ModuleProgress = {
        moduleId,
        messages: finalMessages,
        lastUpdated: new Date(),
        completed: false, // Could add logic to mark as completed
      };
      await storage.saveModuleProgress(moduleId, progress);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'ごめんね、うまく応答できなかった。もう一度試してみてくれる？',
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    const progress: ModuleProgress = {
      moduleId,
      messages,
      lastUpdated: new Date(),
      completed: true,
    };
    await storage.saveModuleProgress(moduleId, progress);
    router.push('/');
  };

  if (!module) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 active:text-gray-900 transition-colors flex-shrink-0 p-2 -ml-2 touch-manipulation"
                aria-label="ホームに戻る"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xl flex-shrink-0">{module.icon}</span>
                  <h1 className="text-base font-semibold text-gray-900 truncate">{module.title}</h1>
                </div>
                <p className="text-xs text-gray-500 truncate">{module.description}</p>
              </div>
            </div>
            <button
              onClick={handleMarkComplete}
              className="px-3 py-2 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
            >
              完了
            </button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-5xl mx-auto h-full">
          {hasInitialized && (
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="メッセージを入力... (Enterで送信、Shift+Enterで改行)"
            />
          )}
        </div>
      </div>
    </div>
  );
}
