'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getModuleById } from '@/lib/modules';
import { getInteractiveModuleProgress, saveInteractiveModuleProgress, getAllInteractiveModuleProgress } from '@/lib/storage';
import { Message, InteractiveModuleProgress } from '@/types';
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

type InteractiveState =
  | { phase: 'activity'; activityData?: any }
  | { phase: 'result'; data: any }
  | { phase: 'dialogue'; data: any; messages: Message[] };

export default function InteractiveModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  const [module, setModule] = useState(() => getModuleById(moduleId));
  const [state, setState] = useState<InteractiveState>({ phase: 'activity' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState<InteractiveModuleProgress | null>(null);
  const [showResultSidebar, setShowResultSidebar] = useState(true);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [allProgress, setAllProgress] = useState<Record<string, InteractiveModuleProgress>>({});

  useEffect(() => {
    if (!module || module.moduleType !== 'interactive') {
      router.push('/');
      return;
    }

    // Load saved progress
    const progress = getInteractiveModuleProgress(moduleId);
    if (progress && !progress.completed) {
      setSavedProgress(progress);
      setShowResumePrompt(true);
    }

    // Load all progress for history sidebar
    const allInteractiveProgress = getAllInteractiveModuleProgress();
    setAllProgress(allInteractiveProgress);
  }, [module, router, moduleId]);

  const handleResumeProgress = () => {
    if (savedProgress) {
      const savedState = savedProgress.data as InteractiveState;
      setState(savedState);
    }
    setShowResumePrompt(false);
  };

  const handleStartFresh = () => {
    setShowResumePrompt(false);
    setState({ phase: 'activity' });
    // Clear saved progress
    saveInteractiveModuleProgress(moduleId, {
      moduleId,
      data: { phase: 'activity' },
      lastUpdated: new Date(),
      completed: false
    });
  };

  const saveProgress = (newState: InteractiveState, completed: boolean = false) => {
    const progress: InteractiveModuleProgress = {
      moduleId,
      data: newState,
      lastUpdated: new Date(),
      completed
    };
    saveInteractiveModuleProgress(moduleId, progress);
  };

  const handleActivityComplete = (data: any) => {
    const newState = { phase: 'result' as const, data };
    setState(newState);
    saveProgress(newState);
  };

  const handleStartDialogue = async (data?: any) => {
    const activityData = state.phase === 'result' ? state.data : data;

    setIsLoading(true);
    setError(null);

    try {
      // Generate context message based on module
      let contextMessage = '';
      if (moduleId === 'value-battle') {
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

      const newState = {
        phase: 'dialogue' as const,
        data: activityData,
        messages: [assistantMessage],
      };
      setState(newState);
      saveProgress(newState);
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

      const newState = {
        ...state,
        messages: [...updatedMessages, assistantMessage],
      };
      setState(newState);
      saveProgress(newState);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('メッセージを送信できませんでした。もう一度お試しください。');

      const errorMessage: Message = {
        role: 'assistant',
        content: 'ごめんね、うまく応答できなかった。もう一度試してみてくれる？',
        timestamp: new Date(),
      };
      const newState = {
        ...state,
        messages: [...updatedMessages, errorMessage],
      };
      setState(newState);
      saveProgress(newState);
    } finally {
      setIsLoading(false);
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
      {/* Resume prompt modal */}
      {showResumePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all animate-fade-in">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">💾</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                続きから始めますか？
              </h2>
              <p className="text-sm text-gray-600">
                前回の進捗が保存されています
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleResumeProgress}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 text-sm"
              >
                続きから始める
              </button>
              <button
                onClick={handleStartFresh}
                className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 active:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200 text-sm"
              >
                最初からやり直す
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <button
                    onClick={handleMarkComplete}
                    className="px-2 py-2 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors whitespace-nowrap"
                  >
                    完了
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
