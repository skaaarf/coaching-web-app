'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
  const modulesSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    migrateToSessions();

    const loadData = async () => {
      const progress = await storage.getAllModuleProgress();
      const interactiveProgress = await storage.getAllInteractiveModuleProgress();
      setAllProgress(progress);
      setAllInteractiveProgress(interactiveProgress);

      const savedInsights = await storage.getUserInsights();
      const hasProgress = Object.keys(progress).length > 0 || Object.keys(interactiveProgress).length > 0;

      if (hasProgress) {
        setInsights(savedInsights);
        regenerateInsights(progress);
      } else {
        setInsights(savedInsights);
      }

      fetchValues();
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage]);

  const fetchValues = async () => {
    try {
      setLoadingValues(true);
      const snapshots = await storage.getAllValueSnapshots();

      if (snapshots && snapshots.length > 0) {
        setCurrentValues(snapshots[0]);
        setPreviousValues(snapshots.length > 1 ? snapshots[1] : null);
      } else {
        setCurrentValues(null);
        setPreviousValues(null);
      }
    } catch (err) {
      console.error('Error fetching values:', err);
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

  const instantModules = new Set(['persona-dictionary', 'career-dictionary']);

  const handleModuleClick = async (moduleId: string, moduleType: 'chat' | 'interactive') => {
    if (instantModules.has(moduleId)) {
      const path = moduleType === 'chat'
        ? `/module/${moduleId}`
        : `/interactive/${moduleId}`;
      router.push(path);
      return;
    }

    if (moduleType === 'chat') {
      const sessions = await storage.getModuleSessions(moduleId);
      setModuleSessions(sessions);
      setInteractiveModuleSessions([]);
    } else {
      const sessions = await storage.getInteractiveModuleSessions(moduleId);
      setInteractiveModuleSessions(sessions);
      setModuleSessions([]);
    }

    setSelectedModule(moduleId);
    setShowModuleDialog(true);
  };

  const handleContinue = (sessionId?: string) => {
    if (!selectedModule) return;
    const moduleDefinition = CAREER_MODULES.find(m => m.id === selectedModule);
    if (!moduleDefinition) return;

    if (sessionId) {
      const path = moduleDefinition.moduleType === 'chat'
        ? `/module/${selectedModule}?sessionId=${sessionId}`
        : `/interactive/${selectedModule}?sessionId=${sessionId}`;
      router.push(path);
    } else {
      const path = moduleDefinition.moduleType === 'chat'
        ? `/module/${selectedModule}`
        : `/interactive/${selectedModule}`;
      router.push(path);
    }
    setShowModuleDialog(false);
  };

  const handleStartNew = () => {
    if (!selectedModule) return;
    const moduleDefinition = CAREER_MODULES.find(m => m.id === selectedModule);
    if (!moduleDefinition) return;

    const newSessionId = `session-${Date.now()}`;
    const path = moduleDefinition.moduleType === 'chat'
      ? `/module/${selectedModule}?sessionId=${newSessionId}`
      : `/interactive/${selectedModule}?sessionId=${newSessionId}`;
    router.push(path);
    setShowModuleDialog(false);
  };

  const hasAnyProgress = Object.keys(allProgress).length > 0 || Object.keys(allInteractiveProgress).length > 0;
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f7]">
      <div className="pointer-events-none absolute inset-x-0 top-[-280px] h-[420px] bg-gradient-to-b from-sky-200/60 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-[-200px] top-32 h-[280px] w-[280px] rounded-full bg-indigo-300/40 blur-[140px]" />

      <header className="relative z-20 border-b border-white/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/mascot/coach-point.png"
                alt="みかたくん"
                fill
                sizes="48px"
                className="rounded-2xl object-contain drop-shadow-md"
                priority
              />
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gray-500">Mikata Studio</p>
              <h1 className="text-lg font-semibold text-gray-900">みかたくん</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="relative z-20 mx-auto w-full max-w-3xl px-5 pb-16">
        <section className="mt-6 rounded-[28px] border border-white/70 bg-white/80 px-5 py-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Personal data</p>
              <h3 className="text-xl font-semibold text-gray-900">あなただけのコンパス</h3>
              <p className="text-sm text-gray-500 mt-1">価値観とキャリア志向の2軸から、今日の問いを決めましょう。</p>
            </div>
            <div className="rounded-full border border-gray-200/80 px-4 py-1 text-xs font-semibold text-gray-500">
              {activeTab === 'values' ? 'Values' : 'Insights'}
            </div>
          </div>
          <div className="mt-5 inline-flex rounded-full border border-gray-200 bg-gray-100 p-1 text-sm font-semibold text-gray-500">
            <button
              onClick={() => setActiveTab('values')}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === 'values'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500'
              }`}
            >
              💎 あなたの価値観
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === 'insights'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500'
              }`}
            >
              🧠 キャリア志向
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'values' && (
              <div className="rounded-3xl border border-gray-200/70 bg-white/90 p-4">
                {loadingValues ? (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="w-6 h-6 border-4 border-gray-900/40 border-t-transparent rounded-full animate-spin" />
                      <span className="text-base font-medium text-gray-700">価値観を読み込み中...</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      対話から抽出された価値観を分析しています
                    </p>
                  </div>
                ) : currentValues ? (
                  <ValuesDisplay current={currentValues} previous={previousValues} showHeader={false} showFooter={false} />
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-8 text-center">
                    <div className="text-5xl mb-3">💎</div>
                    <p className="text-gray-700 mb-2 text-sm">まだ価値観が抽出されていません</p>
                    <p className="text-xs text-gray-500">
                      対話やゲームモジュールを進めると、AIがあなたの価値観を分析します
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="rounded-3xl border border-gray-200/70 bg-white/90 p-4">
                {hasAnyProgress ? (
                  <InsightsPanel insights={insights} isLoading={isLoadingInsights} />
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-8 text-center">
                    <div className="text-5xl mb-3">🎯</div>
                    <p className="text-gray-700 mb-2 text-sm">まだ対話やゲームを始めていません</p>
                    <p className="text-xs text-gray-500">
                      対話やゲームモジュールを進めると、AIがあなたのキャリア志向を分析します
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <DialogueHistoryHome
          chatProgress={allProgress}
          onSessionClick={(moduleId, sessionId) => {
            router.push(`/module/${moduleId}?sessionId=${sessionId}`);
          }}
        />

        {!hasAnyProgress && (
          <div className="mb-6 overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
            <div className="text-xs uppercase tracking-[0.4em] text-white/60">First step</div>
            <h2 className="mt-3 text-2xl font-semibold">ようこそ、みかたスタジオへ</h2>
            <p className="mt-2 text-sm text-white/80">
              ここから先は、あなただけのキャリア実験室。直感的に話してみて、問いの連鎖を楽しみましょう。
            </p>
          </div>
        )}

        <div ref={modulesSectionRef} className="scroll-mt-24">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Programs</p>
              <h2 className="text-2xl font-semibold text-gray-900">モジュール</h2>
              <p className="text-sm text-gray-500 mt-1">対話とゲームで、自分の意志を磨こう</p>
            </div>
            <div className="text-xs text-gray-500">
              {CAREER_MODULES.length}件
            </div>
          </div>

          <div className="space-y-5">
            {CAREER_MODULES.filter(m => m.moduleType === 'chat').map(moduleDefinition => (
              <ModuleCard
                key={moduleDefinition.id}
                module={moduleDefinition}
                progress={allProgress[moduleDefinition.id]}
                interactiveProgress={allInteractiveProgress[moduleDefinition.id]}
                onClick={() => handleModuleClick(moduleDefinition.id, moduleDefinition.moduleType || 'chat')}
              />
            ))}
            {CAREER_MODULES.filter(m => m.moduleType === 'interactive').map(moduleDefinition => (
              <ModuleCard
                key={moduleDefinition.id}
                module={moduleDefinition}
                progress={allProgress[moduleDefinition.id]}
                interactiveProgress={allInteractiveProgress[moduleDefinition.id]}
                onClick={() => handleModuleClick(moduleDefinition.id, moduleDefinition.moduleType || 'interactive')}
              />
            ))}
          </div>
        </div>

        <section className="mt-10 overflow-hidden rounded-[32px] border border-gray-900/10 bg-gradient-to-br from-gray-900 via-[#0d1422] to-black px-6 py-8 text-white shadow-[0_40px_90px_rgba(10,10,10,0.6)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex-1 space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Mikata signal</p>
              <h3 className="text-2xl font-semibold">気になることを見つけたら、いつでも声をかけてね</h3>
              <p className="text-sm text-white/70">
                モジュールの途中でも質問があれば「ヒントがほしい」と送ってみよう。みかたくんが次の一歩を一緒に考えます。
              </p>
            </div>
            <div className="relative h-32 w-32 flex-shrink-0">
              <Image
                src="/mascot/coach-standing.png"
                alt="みかたくん"
                fill
                sizes="128px"
                className="object-contain drop-shadow-[0_20px_40px_rgba(32,32,32,0.45)]"
              />
            </div>
          </div>
          <div className="mt-6 text-xs text-white/60">
            対話の中で価値観が見えてきたら、「価値観バトル」にも挑戦してみよう！
          </div>
        </section>
      </main>

      {showModuleDialog && selectedModule && (() => {
        const moduleDefinition = CAREER_MODULES.find(m => m.id === selectedModule);
        const isInteractive = moduleDefinition?.moduleType === 'interactive';
        const sessions = isInteractive ? interactiveModuleSessions : moduleSessions;
        const hasSessions = sessions.length > 0;

        return (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowModuleDialog(false)}
          >
            <div
              className="bg-white/95 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col animate-fade-in border border-gray-200 backdrop-blur"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Session</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {moduleDefinition?.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {hasSessions ? '新しく始めるか、過去のプレイから選んでください' : 'このモジュールを始めますか？'}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                <button
                  onClick={handleStartNew}
                  className="w-full bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-semibold transition shadow-lg shadow-gray-900/30"
                >
                  ✨ 新しく始める
                </button>

                {hasSessions && (
                  <div className="space-y-3 pt-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">過去のプレイ履歴</p>
                    {!isInteractive && moduleSessions.map((session, index) => {
                      const firstUserMessage = session.messages?.find(m => m.role === 'user');
                      const sessionTitle = firstUserMessage?.content.substring(0, 30) || `セッション ${index + 1}`;
                      const displayTitle = firstUserMessage && firstUserMessage.content.length > 30
                        ? `${sessionTitle}...`
                        : sessionTitle;

                      return (
                        <button
                          key={`${session.sessionId}-${index}`}
                          onClick={() => handleContinue(session.sessionId)}
                          className="w-full bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate group-hover:text-gray-900">
                                {displayTitle}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {session.messages?.length || 0}件のメッセージ
                              </p>
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
                          key={`${session.sessionId}-${index}`}
                          onClick={() => handleContinue(session.sessionId)}
                          className="w-full bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate group-hover:text-gray-900">
                                {sessionTitle}
                              </p>
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
                  </div>
                )}
              </div>

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
