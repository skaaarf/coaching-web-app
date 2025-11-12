'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getModuleById } from '@/lib/modules';
import { useStorage } from '@/hooks/useStorage';
import { Message, ModuleProgress, InteractiveModuleProgress, ValueSnapshot } from '@/types';
import ValueBattle from '@/components/ValueBattle';
import ValueBattleResultView from '@/components/ValueBattleResult';
import LifeSimulator from '@/components/LifeSimulator';
import LifeSimulatorResult from '@/components/LifeSimulatorResult';
import ParentSelfScale from '@/components/ParentSelfScale';
import ParentSelfScaleResult from '@/components/ParentSelfScaleResult';
import TimeMachine from '@/components/TimeMachine';
import BranchMap from '@/components/BranchMap';
import ChatInterface from '@/components/ChatInterface';
import ModuleResultSidebar from '@/components/ModuleResultSidebar';
import DialogueHistorySidebar from '@/components/DialogueHistorySidebar';
import AnalyzingAnimation from '@/components/AnalyzingAnimation';

type InteractiveState =
  | { phase: 'activity'; activityData?: any }
  | { phase: 'result'; data: any }
  | { phase: 'dialogue'; data: any; messages: Message[] };

export default function InteractiveModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const storage = useStorage();

  // Get sessionId and dialogueSessionId from URL query params
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const sessionId = searchParams?.get('sessionId') || undefined;
  const urlDialogueSessionId = searchParams?.get('dialogueSessionId') || undefined;

  const [module, setModule] = useState(() => getModuleById(moduleId));
  const [currentSessionId, setCurrentSessionId] = useState<string>(sessionId || '');
  const [dialogueSessionId, setDialogueSessionId] = useState<string>(''); // Separate session for dialogue phase
  const [state, setState] = useState<InteractiveState>({ phase: 'activity' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResultSidebar, setShowResultSidebar] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [allProgress, setAllProgress] = useState<Record<string, InteractiveModuleProgress>>({});

  // Value analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [lastAnalyzedMessageCount, setLastAnalyzedMessageCount] = useState(0);

  useEffect(() => {
    if (!module || module.moduleType !== 'interactive') {
      router.push('/');
      return;
    }

    // Load saved progress
    const loadProgress = async () => {
      let progress: InteractiveModuleProgress | null = null;

      console.log('Loading interactive module, sessionId from URL:', sessionId);
      console.log('dialogueSessionId from URL:', urlDialogueSessionId);

      // If dialogueSessionId is provided, load that specific dialogue session
      if (urlDialogueSessionId) {
        const dialogueModuleId = `${moduleId}-dialogue`;
        const dialogueProgress = await storage.getModuleSession(dialogueModuleId, urlDialogueSessionId);

        if (dialogueProgress && dialogueProgress.messages) {
          console.log('Loaded dialogue session:', dialogueProgress);
          setDialogueSessionId(urlDialogueSessionId);
          setState({
            phase: 'dialogue',
            data: {}, // We don't have the original activity data, but that's okay
            messages: dialogueProgress.messages,
          });
          return;
        }
      }

      if (sessionId) {
        // Load specific session
        progress = await storage.getInteractiveModuleSession(moduleId, sessionId);
        console.log('Loaded session:', progress);
        setCurrentSessionId(sessionId);

        // If progress exists and has data, load it
        if (progress && progress.data) {
          const savedState = progress.data as InteractiveState;

          // When loading a past session, always start from result phase
          // This allows users to review the result before starting dialogue
          if (savedState.phase === 'dialogue') {
            setState({
              phase: 'result',
              data: savedState.data,
            });
          } else {
            setState(savedState);
          }
        } else {
          // New session - start fresh
          console.log('New session, starting fresh');
          setState({ phase: 'activity' });
        }
      } else {
        // No sessionId in URL - load latest session
        progress = await storage.getInteractiveModuleProgress(moduleId);
        if (progress?.sessionId) {
          setCurrentSessionId(progress.sessionId);
          if (progress.data) {
            const savedState = progress.data as InteractiveState;
            setState(savedState);
          }
        } else {
          // No existing progress
          const newSessionId = `session-${Date.now()}`;
          setCurrentSessionId(newSessionId);
          setState({ phase: 'activity' });
        }
      }

      // Load all progress for history sidebar
      const allInteractiveProgress = await storage.getAllInteractiveModuleProgress();
      setAllProgress(allInteractiveProgress);
    };

    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, router, moduleId, storage, sessionId, urlDialogueSessionId]);

  const saveProgress = async (newState: InteractiveState, completed: boolean = false) => {
    console.log('=== saveProgress (Interactive) ===');
    console.log('moduleId:', moduleId);
    console.log('currentSessionId:', currentSessionId);
    console.log('newState:', newState);
    console.log('completed:', completed);

    const progress: InteractiveModuleProgress = {
      moduleId,
      sessionId: currentSessionId,
      data: newState,
      createdAt: new Date(), // Will be ignored if session already exists
      lastUpdated: new Date(),
      completed
    };

    console.log('Saving progress:', progress);
    await storage.saveInteractiveModuleProgress(moduleId, progress);
    console.log('Progress saved');
  };

  const handleActivityComplete = (data: any) => {
    const newState = { phase: 'result' as const, data };
    setState(newState);
    saveProgress(newState);
  };

  const handleStartDialogue = async (dataOrQuestion?: any) => {
    // Check if the argument is a question string
    const isQuestion = typeof dataOrQuestion === 'string';
    const initialQuestion = isQuestion ? dataOrQuestion : undefined;
    const activityData = !isQuestion && state.phase === 'result' ? state.data : (isQuestion && state.phase === 'dialogue' ? state.data : (isQuestion && state.phase === 'result' ? state.data : dataOrQuestion));

    // If a question is provided, always start a new dialogue
    if (!initialQuestion) {
      // Check if there's already a dialogue session for this game session
      const currentProgress = await storage.getInteractiveModuleSession(moduleId, currentSessionId);
      if (currentProgress && currentProgress.data) {
        const savedState = currentProgress.data as InteractiveState;
        if (savedState.phase === 'dialogue' && savedState.messages && savedState.messages.length > 0) {
          // Resume existing dialogue
          console.log('Resuming existing dialogue');
          setState({
            phase: 'dialogue',
            data: savedState.data,
            messages: savedState.messages,
          });

          // Find the dialogue session ID from the saved progress
          const dialogueModuleId = `${moduleId}-dialogue`;
          const allSessions = await storage.getModuleSessions(dialogueModuleId);
          if (allSessions.length > 0) {
            // Find the most recent dialogue session for this game
            const recentDialogue = allSessions[0];
            setDialogueSessionId(recentDialogue.sessionId);
          }

          return;
        }
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate context message based on module or use initial question
      let contextMessage = '';
      if (initialQuestion) {
        // User selected a specific question from the result page
        contextMessage = initialQuestion;
      } else if (moduleId === 'value-battle') {
        const results = activityData as Record<string, number>;
        const sortedResults = Object.entries(results)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);
        contextMessage = `価値観バトルの結果：\n${sortedResults
          .map(([value, count], i) => `${i + 1}位: ${value} (${count}回選択)`)
          .join('\n')}`;
      } else if (moduleId === 'life-simulator') {
        const selections = activityData as Record<string, string[]>;
        contextMessage = `人生シミュレーターの選択：\n${Object.entries(selections)
          .map(([path, aspects]) => `${path}の人生: ${aspects.join(', ')}`)
          .join('\n')}`;
      } else if (moduleId === 'parent-self-scale') {
        const responses = activityData as Record<number, number>;
        const average =
          Object.values(responses).reduce((sum, val) => sum + val, 0) /
          Object.values(responses).length;
        contextMessage = `天秤ゲームの結果：\n平均: ${Math.round(
          average
        )}% (0%=親の期待, 100%=自分の気持ち)`;
      } else if (moduleId === 'time-machine') {
        const { pastLetter, futureLetter } = activityData as {
          pastLetter: string;
          futureLetter: string;
        };
        contextMessage = `タイムマシンで書いた手紙：\n\n[1年前の自分へ]\n${pastLetter}\n\n[10年後の自分から]\n${futureLetter}`;
      } else if (moduleId === 'branch-map') {
        const path = activityData as Array<{ label: string }>;
        contextMessage = `IF分岐マップで選んだ道：\n${path
          .map((b) => b.label)
          .join(' → ')}`;
      }

      // Call API for initial message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: contextMessage,
            },
          ],
          systemPrompt: module?.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const responseData = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: responseData.message,
        timestamp: new Date(),
      };

      // Create a new dialogue session ID
      const newDialogueSessionId = `session-${Date.now()}`;
      setDialogueSessionId(newDialogueSessionId);

      const newState = {
        phase: 'dialogue' as const,
        data: activityData,
        messages: [assistantMessage],
      };
      setState(newState);
      saveProgress(newState);

      // Save dialogue as a regular chat module session
      const dialogueModuleId = `${moduleId}-dialogue`;
      const chatProgress: ModuleProgress = {
        moduleId: dialogueModuleId,
        sessionId: newDialogueSessionId,
        messages: [assistantMessage],
        createdAt: new Date(),
        lastUpdated: new Date(),
        completed: false,
      };
      await storage.saveModuleProgress(dialogueModuleId, chatProgress);
    } catch (error) {
      console.error('Error starting dialogue:', error);
      setError('対話を開始できませんでした。もう一度お試しください。');

      // Fallback message
      const fallbackMessage: Message = {
        role: 'assistant',
        content: 'こんにちは。一緒に考えていきましょう。',
        timestamp: new Date(),
      };
      const newState = {
        phase: 'dialogue' as const,
        data: activityData,
        messages: [fallbackMessage],
      };
      setState(newState);
      saveProgress(newState);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (state.phase !== 'dialogue') return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...state.messages, userMessage];
    const tempState = { ...state, messages: updatedMessages };
    setState(tempState);
    saveProgress(tempState);

    setIsLoading(true);
    setError(null);

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
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const newState = {
        ...state,
        messages: finalMessages,
      };
      setState(newState);
      saveProgress(newState);

      // Also save to chat module session for dialogue history
      if (dialogueSessionId) {
        const dialogueModuleId = `${moduleId}-dialogue`;
        const chatProgress: ModuleProgress = {
          moduleId: dialogueModuleId,
          sessionId: dialogueSessionId,
          messages: finalMessages,
          createdAt: new Date(),
          lastUpdated: new Date(),
          completed: false,
        };
        await storage.saveModuleProgress(dialogueModuleId, chatProgress);
      }

      // Trigger value analysis after every message exchange (minimum 2 messages)
      if (finalMessages.length >= 2 && !isAnalyzing && (finalMessages.length - lastAnalyzedMessageCount >= 2)) {
        triggerValueAnalysis(finalMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('メッセージを送信できませんでした。もう一度お試しください。');

      const errorMessage: Message = {
        role: 'assistant',
        content: 'ごめんね、うまく応答できなかった。もう一度試してみてくれる？',
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      const newState = {
        ...state,
        messages: finalMessages,
      };
      setState(newState);
      saveProgress(newState);

      // Also save to chat module session for dialogue history
      if (dialogueSessionId) {
        const dialogueModuleId = `${moduleId}-dialogue`;
        const chatProgress: ModuleProgress = {
          moduleId: dialogueModuleId,
          sessionId: dialogueSessionId,
          messages: finalMessages,
          createdAt: new Date(),
          lastUpdated: new Date(),
          completed: false,
        };
        await storage.saveModuleProgress(dialogueModuleId, chatProgress);
      }
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

  const handleBackToResult = () => {
    if (state.phase === 'dialogue') {
      setState({ phase: 'result', data: state.data });
    }
  };

  const handleMarkComplete = () => {
    saveProgress(state, true);
    router.push('/');
  };

  if (!module) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 active:text-gray-900 transition-colors flex-shrink-0 p-2 -ml-2 touch-manipulation"
                aria-label="ホームに戻る"
                type="button"
              >
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xl flex-shrink-0">{module.icon}</span>
                  <h1 className="text-base font-semibold text-gray-900 truncate">
                    {module.title}
                  </h1>
                </div>
                <p className="text-xs text-gray-500 block truncate">{module.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {state.phase === 'dialogue' && (
                <>
                  <button
                    onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    title="対話履歴"
                    aria-label="対話履歴"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowResultSidebar(!showResultSidebar)}
                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    title="結果を表示"
                    aria-label="結果を表示"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleBackToResult}
                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors block"
                    title="結果に戻る"
                    aria-label="結果に戻る"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-grow">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 ml-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className={state.phase === 'dialogue' ? '' : 'py-8'}>
        <div className="animate-fade-in">
          {state.phase === 'activity' && (
            <>
              {moduleId === 'value-battle' && (
                <ValueBattle onComplete={handleActivityComplete} />
              )}
              {moduleId === 'life-simulator' && (
                <LifeSimulator onComplete={handleActivityComplete} />
              )}
              {moduleId === 'parent-self-scale' && (
                <ParentSelfScale onComplete={handleActivityComplete} />
              )}
              {moduleId === 'time-machine' && (
                <TimeMachine
                  onComplete={(pastLetter, futureLetter) =>
                    handleStartDialogue({ pastLetter, futureLetter })
                  }
                />
              )}
              {moduleId === 'branch-map' && (
                <BranchMap onComplete={handleActivityComplete} />
              )}
            </>
          )}

          {state.phase === 'result' && (
            <>
              {moduleId === 'value-battle' && (
                <ValueBattleResultView
                  results={state.data}
                  onStartDialogue={() => handleStartDialogue()}
                />
              )}
              {moduleId === 'life-simulator' && (
                <LifeSimulatorResult
                  selections={state.data}
                  onStartDialogue={() => handleStartDialogue()}
                />
              )}
              {moduleId === 'parent-self-scale' && (
                <ParentSelfScaleResult
                  responses={state.data}
                  onStartDialogue={() => handleStartDialogue()}
                />
              )}
            </>
          )}

          {state.phase === 'dialogue' && (
            <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] relative">
              {/* History Sidebar - Left (Desktop only) */}
              {showHistorySidebar && (
                <>
                  {/* Mobile Overlay */}
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setShowHistorySidebar(false)}
                  />
                  {/* Sidebar */}
                  <div className={`${
                    showHistorySidebar
                      ? 'fixed lg:relative left-0 top-0 bottom-0 z-50 lg:z-0'
                      : 'hidden'
                  } w-80 lg:w-80 flex-shrink-0`}>
                    <DialogueHistorySidebar
                      allProgress={allProgress}
                      currentModuleId={moduleId}
                      onClose={() => setShowHistorySidebar(false)}
                    />
                  </div>
                </>
              )}

              {/* Main Content Area */}
              <div className="flex-1 min-w-0 max-w-5xl mx-auto w-full flex flex-col">
                {/* Mobile Result Section - Top (Mobile only) */}
                <div className="lg:hidden">
                  {showResultSidebar && (
                    <div className="border-b border-gray-200 bg-white">
                      <div className="max-h-[40vh] overflow-y-auto">
                        <ModuleResultSidebar
                          moduleId={moduleId}
                          data={state.data}
                          onClose={() => setShowResultSidebar(false)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Interface */}
                <div className="flex-1 min-h-0">
                  <ChatInterface
                    messages={state.messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    placeholder="メッセージを入力... (Enterで送信、Shift+Enterで改行)"
                    moduleContext={{
                      moduleId: module.id,
                      moduleTitle: module.title,
                      gameResults: JSON.stringify(state.data, null, 2)
                    }}
                  />
                </div>
              </div>

              {/* Result Sidebar - Right (Desktop only) */}
              <div className="hidden lg:block">
                {showResultSidebar && (
                  <div className="w-96 flex-shrink-0">
                    <ModuleResultSidebar
                      moduleId={moduleId}
                      data={state.data}
                      onClose={() => setShowResultSidebar(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Analyzing animation */}
      {isAnalyzing && <AnalyzingAnimation />}

      {/* Analysis complete notification */}
      {analysisComplete && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-2xl border border-blue-200 p-4 max-w-sm w-full mx-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✨</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                価値観を更新しました!
              </p>
              <p className="text-xs text-gray-600">
                ホーム画面で確認できます
              </p>
            </div>
            <button
              onClick={() => setAnalysisComplete(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
