'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getModuleById } from '@/lib/modules';
import { useStorage } from '@/hooks/useStorage';
import { Message, ModuleProgress, ValueSnapshot } from '@/types';
import ChatInterface from '@/components/ChatInterface';
import AnalyzingAnimation from '@/components/AnalyzingAnimation';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const storage = useStorage();

  // Get sessionId from URL query params
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const sessionId = searchParams?.get('sessionId') || undefined;

  const [module, setModule] = useState(() => getModuleById(moduleId));
  const [currentSessionId, setCurrentSessionId] = useState<string>(sessionId || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Value analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [lastAnalyzedMessageCount, setLastAnalyzedMessageCount] = useState(0);

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
      let progress: ModuleProgress | null = null;

      if (sessionId) {
        // Load specific session
        progress = await storage.getModuleSession(moduleId, sessionId);
        setCurrentSessionId(sessionId);
      } else {
        // Load latest session
        progress = await storage.getModuleProgress(moduleId);
        if (progress?.sessionId) {
          setCurrentSessionId(progress.sessionId);
        }
      }

      if (progress && progress.messages.length > 0) {
        setMessages(progress.messages);
      } else {
        // Start new conversation with AI's greeting
        // Generate new sessionId if not provided
        const newSessionId = sessionId || `session-${Date.now()}`;
        setCurrentSessionId(newSessionId);
        fetchInitialMessage(newSessionId);
      }

      setHasInitialized(true);
    };

    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, module, router, storage, sessionId]);

  const fetchInitialMessage = async (sessionIdToUse: string) => {
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
        sessionId: sessionIdToUse,
        messages: [assistantMessage],
        createdAt: new Date(),
        lastUpdated: new Date(),
        completed: false,
        userId: storage.userId || undefined,
        userEmail: storage.userEmail || undefined,
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
        sessionId: currentSessionId,
        messages: finalMessages,
        createdAt: new Date(), // Will be ignored if session already exists
        lastUpdated: new Date(),
        completed: false, // Could add logic to mark as completed
        userId: storage.userId || undefined,
        userEmail: storage.userEmail || undefined,
      };
      await storage.saveModuleProgress(moduleId, progress);

      // Trigger value analysis after every message exchange (minimum 2 messages)
      // Only analyze if we have at least 2 new messages since last analysis
      if (finalMessages.length >= 2 && !isAnalyzing && (finalMessages.length - lastAnalyzedMessageCount >= 2)) {
        triggerValueAnalysis(finalMessages);
      }
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

  const triggerValueAnalysis = async (messagesToAnalyze: Message[]) => {
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/extract-values', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          messages: messagesToAnalyze,
          moduleId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Value analysis failed:', response.status, errorData);
        throw new Error('Failed to analyze values');
      }

      const data = await response.json();
      const snapshot = data.snapshot as ValueSnapshot;

      // Save to localStorage
      await storage.saveValueSnapshot({
        ...snapshot,
        user_id: storage.userId || 'local-user',
        created_at: new Date(snapshot.created_at),
        last_updated: new Date(),
      });

      // Analysis successful - update the count and show notification
      setLastAnalyzedMessageCount(messagesToAnalyze.length);
      setAnalysisComplete(true);

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setAnalysisComplete(false);
      }, 5000);
    } catch (error) {
      console.error('Error analyzing values:', error);
      // Don't update count on error, so we can retry later
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMarkComplete = async () => {
    const progress: ModuleProgress = {
      moduleId,
      sessionId: currentSessionId,
      messages,
      createdAt: new Date(), // Will be ignored if session already exists
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
              placeholder="メッセージを入力..."
              moduleContext={{
                moduleId: module.id,
                moduleTitle: module.title
              }}
            />
          )}
        </div>
      </div>

    </div>
  );
}
