'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CAREER_MODULES } from '@/lib/modules';
import { useStorage } from '@/hooks/useStorage';
import { generateInsights } from '@/lib/insights';
import { migrateToSessions } from '@/lib/storage';
import { ModuleProgress, InteractiveModuleProgress, UserInsights, ValueSnapshot } from '@/types';
import ModuleCard from '@/components/ModuleCard';
import InsightsPanel from '@/components/InsightsPanel';
import UserMenu from '@/components/UserMenu';
import DialogueHistoryHome from '@/components/DialogueHistoryHome';
import ValuesDisplay from '@/components/ValuesDisplay';

export default function Home() {
  const router = useRouter();
  const storage = useStorage();
  const [allProgress, setAllProgress] = useState<Record<string, ModuleProgress>>({});
  const [allInteractiveProgress, setAllInteractiveProgress] = useState<Record<string, InteractiveModuleProgress>>({});
  const [insights, setInsights] = useState<UserInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [currentValues, setCurrentValues] = useState<ValueSnapshot | null>(null);
  const [previousValues, setPreviousValues] = useState<ValueSnapshot | null>(null);
  const [loadingValues, setLoadingValues] = useState(false);
  const [activeTab, setActiveTab] = useState<'values' | 'insights'>('values');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [moduleSessions, setModuleSessions] = useState<ModuleProgress[]>([]);
  const [interactiveModuleSessions, setInteractiveModuleSessions] = useState<InteractiveModuleProgress[]>([]);

  useEffect(() => {
    // Migrate old data to new sessions format on first load
    migrateToSessions();

    // Load progress and insights on mount
    const loadData = async () => {
      const progress = await storage.getAllModuleProgress();
      const interactiveProgress = await storage.getAllInteractiveModuleProgress();
      setAllProgress(progress);
      setAllInteractiveProgress(interactiveProgress);

      const savedInsights = await storage.getUserInsights();

      // Always regenerate insights if we have progress (auto-update)
      const hasProgress = Object.keys(progress).length > 0 || Object.keys(interactiveProgress).length > 0;
      if (hasProgress) {
        setInsights(savedInsights); // Show old insights while regenerating
        regenerateInsights(progress); // Auto-regenerate
      } else {
        setInsights(savedInsights);
      }

      // Load values
      fetchValues();
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage]); // Re-load when storage changes (userId changes)

  const fetchValues = async () => {
    try {
      setLoadingValues(true);

      // Get all snapshots from localStorage
      const snapshots = await storage.getAllValueSnapshots();

      if (snapshots && snapshots.length > 0) {
        setCurrentValues(snapshots[0]); // Most recent
        setPreviousValues(snapshots.length > 1 ? snapshots[1] : null); // Second most recent
      } else {
        setCurrentValues(null);
        setPreviousValues(null);
      }
    } catch (err) {
      console.error('Error fetching values:', err);
      // Silent fail - values are optional
    } finally {
      setLoadingValues(false);
    }
  };

  const regenerateInsights = async (progress?: Record<string, ModuleProgress>) => {
    setIsLoadingInsights(true);
    try {
      const progressToUse = progress || allProgress;
      const newInsights = await generateInsights(progressToUse);
      setInsights(newInsights);
      await storage.saveUserInsights(newInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleModuleClick = async (moduleId: string, moduleType: 'chat' | 'interactive') => {
    console.log('=== handleModuleClick ===');
    console.log('moduleId:', moduleId);
    console.log('moduleType:', moduleType);

    // Debug: Check localStorage directly
    const sessionsKey = 'mikata-sessions';
    const rawSessions = localStorage.getItem(sessionsKey);
    console.log('Raw localStorage sessions:', rawSessions);

    // Load all sessions for this module
    if (moduleType === 'chat') {
      const sessions = await storage.getModuleSessions(moduleId);
      console.log('Chat sessions for', moduleId, ':', sessions);
      console.log('Number of chat sessions:', sessions.length);
      setModuleSessions(sessions);
      setInteractiveModuleSessions([]);
    } else {
      const sessions = await storage.getInteractiveModuleSessions(moduleId);
      console.log('Interactive sessions for', moduleId, ':', sessions);
      console.log('Number of interactive sessions:', sessions.length);
      setInteractiveModuleSessions(sessions);
      setModuleSessions([]);
    }

    // Always show dialog
    setSelectedModule(moduleId);
    setShowModuleDialog(true);
  };

  const handleContinue = (sessionId?: string) => {
    if (!selectedModule) return;
    const module = CAREER_MODULES.find(m => m.id === selectedModule);
    if (!module) return;

    if (sessionId) {
      // Load specific session
      const path = module.moduleType === 'chat' ? `/module/${selectedModule}?sessionId=${sessionId}` : `/interactive/${selectedModule}?sessionId=${sessionId}`;
      router.push(path);
    } else {
      // Load latest session
      const path = module.moduleType === 'chat' ? `/module/${selectedModule}` : `/interactive/${selectedModule}`;
      router.push(path);
    }
    setShowModuleDialog(false);
  };

  const handleStartNew = async () => {
    if (!selectedModule) return;
    const module = CAREER_MODULES.find(m => m.id === selectedModule);
    if (!module) return;

    // Generate new sessionId
    const newSessionId = `session-${Date.now()}`;

    // Navigate to module with new sessionId
    const path = module.moduleType === 'chat'
      ? `/module/${selectedModule}?sessionId=${newSessionId}`
      : `/interactive/${selectedModule}?sessionId=${newSessionId}`;
    router.push(path);
    setShowModuleDialog(false);
  };

  const hasAnyProgress = Object.keys(allProgress).length > 0 || Object.keys(allInteractiveProgress).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">みかたくん</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Tab buttons */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('values')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === 'values'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                💎 あなたの価値観
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === 'insights'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                🧠 あなたのキャリア志向
              </button>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'values' && loadingValues && (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg font-medium text-gray-700">価値観を読み込み中...</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    対話から抽出された価値観を分析しています
                  </p>
                </div>
              )}
              {activeTab === 'values' && !loadingValues && (
                <div className="animate-fade-in">
                  {currentValues ? (
                    <ValuesDisplay current={currentValues} previous={previousValues} showHeader={false} showFooter={false} />
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💎</div>
                      <p className="text-gray-600 mb-2">まだ価値観が抽出されていません</p>
                      <p className="text-sm text-gray-500">
                        対話やゲームモジュールを進めると、AIがあなたの価値観を分析します
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="animate-fade-in">
                  {hasAnyProgress ? (
                    <InsightsPanel insights={insights} isLoading={isLoadingInsights} />
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎯</div>
                      <p className="text-gray-600 mb-2">まだ対話やゲームを始めていません</p>
                      <p className="text-sm text-gray-500">
                        対話やゲームモジュールを進めると、AIがあなたのキャリア志向を分析します
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialogue History */}
        <DialogueHistoryHome
          chatProgress={allProgress}
          onSessionClick={(moduleId, sessionId) => {
            router.push(`/module/${moduleId}?sessionId=${sessionId}`);
          }}
        />

        {/* Welcome message for new users */}
        {!hasAnyProgress && (
          <div className="mb-8 bg-white rounded-2xl p-8 border border-gray-200 text-center animate-fade-in">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ようこそ！
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              「みかたくん」は、進路やキャリアについて一緒に考えるAIカウンセラーです。<br />
              対話を通じて、あなた自身の考えを整理していきましょう。
            </p>
          </div>
        )}

        {/* All Modules */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>モジュール</span>
            <span className="text-sm font-normal text-gray-500">対話とゲームで自分を知ろう</span>
          </h2>
          <div className="space-y-8">
            {/* Chat module first */}
            {CAREER_MODULES.filter(m => m.moduleType === 'chat').map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={allProgress[module.id]}
                interactiveProgress={allInteractiveProgress[module.id]}
                onClick={() => handleModuleClick(module.id, module.moduleType || 'chat')}
              />
            ))}
            {/* Then game modules */}
            {CAREER_MODULES.filter(m => m.moduleType === 'interactive').map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={allProgress[module.id]}
                interactiveProgress={allInteractiveProgress[module.id]}
                onClick={() => handleModuleClick(module.id, module.moduleType || 'interactive')}
              />
            ))}
          </div>
        </div>

        {/* Info note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>対話の中で価値観が見えてきたら、「価値観バトル」にも挑戦してみよう！</p>
        </div>
      </main>

      {/* Module Dialog */}
      {showModuleDialog && selectedModule && (() => {
        const module = CAREER_MODULES.find(m => m.id === selectedModule);
        const isInteractive = module?.moduleType === 'interactive';
        const sessions = isInteractive ? interactiveModuleSessions : moduleSessions;
        const hasSessions = sessions.length > 0;

        return (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModuleDialog(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col animate-fade-in border-2 border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {module?.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {hasSessions ? '新しく始めるか、過去のプレイから選んでください' : 'このモジュールを始めますか？'}
                </p>
              </div>

              {/* Content - scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {/* New session button - always at the top */}
                  <button
                    onClick={handleStartNew}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md"
                  >
                    ✨ 新しく始める
                  </button>

                  {/* Past sessions list */}
                  {hasSessions && (
                    <>
                      <div className="pt-2 pb-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">過去のプレイ履歴</p>
                      </div>
                      {!isInteractive && moduleSessions.map((session, index) => {
                        const firstUserMessage = session.messages?.find(m => m.role === 'user');
                        const sessionTitle = firstUserMessage?.content.substring(0, 30) || `セッション ${index + 1}`;
                        const displayTitle = firstUserMessage && firstUserMessage.content.length > 30
                          ? `${sessionTitle}...`
                          : sessionTitle;

                        return (
                          <button
                            key={session.sessionId}
                            onClick={() => handleContinue(session.sessionId)}
                            className="w-full bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-left px-4 py-3 rounded-lg transition-all group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-700">
                                  {displayTitle}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-gray-500">
                                    {session.messages?.length || 0}件のメッセージ
                                  </p>
                                  {session.completed && (
                                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                                      完了
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs text-gray-400">
                                  {new Date(session.lastUpdated).toLocaleDateString('ja-JP', {
                                    month: 'numeric',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      {isInteractive && interactiveModuleSessions.map((session, index) => {
                        const sessionTitle = `プレイ ${index + 1}`;

                        return (
                          <button
                            key={session.sessionId}
                            onClick={() => handleContinue(session.sessionId)}
                            className="w-full bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-left px-4 py-3 rounded-lg transition-all group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-700">
                                  {sessionTitle}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {session.completed && (
                                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                                      完了
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs text-gray-400">
                                  {new Date(session.lastUpdated).toLocaleDateString('ja-JP', {
                                    month: 'numeric',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <button
                  onClick={() => setShowModuleDialog(false)}
                  className="w-full text-gray-500 hover:text-gray-700 px-6 py-2 text-sm font-medium transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <style jsx global>{`
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
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
