'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CAREER_MODULES } from '@/lib/modules';
import { useStorage } from '@/hooks/useStorage';
import { generateInsights } from '@/lib/insights';
import { ModuleProgress, InteractiveModuleProgress, UserInsights } from '@/types';
import ModuleCard from '@/components/ModuleCard';
import InsightsPanel from '@/components/InsightsPanel';
import UserMenu from '@/components/UserMenu';
import DiagnosticAggregation from '@/components/DiagnosticAggregation';
import DialogueHistoryHome from '@/components/DialogueHistoryHome';

export default function Home() {
  const router = useRouter();
  const storage = useStorage();
  const [allProgress, setAllProgress] = useState<Record<string, ModuleProgress>>({});
  const [allInteractiveProgress, setAllInteractiveProgress] = useState<Record<string, InteractiveModuleProgress>>({});
  const [insights, setInsights] = useState<UserInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    // Load progress and insights on mount
    const loadData = async () => {
      const progress = await storage.getAllModuleProgress();
      const interactiveProgress = await storage.getAllInteractiveModuleProgress();
      setAllProgress(progress);
      setAllInteractiveProgress(interactiveProgress);

      const savedInsights = await storage.getUserInsights();
      setInsights(savedInsights);

      // Generate insights if we have progress but no insights
      const hasProgress = Object.keys(progress).length > 0 || Object.keys(interactiveProgress).length > 0;
      if (hasProgress && !savedInsights) {
        regenerateInsights(progress);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage]); // Re-load when storage changes (userId changes)

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

  const hasAnyProgress = Object.keys(allProgress).length > 0 || Object.keys(allInteractiveProgress).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-shrink">
              <h1 className="text-2xl font-bold text-gray-900">みかたくん</h1>
              <p className="text-xs text-gray-600 mt-1">キャリアについて一緒に考えよう</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasAnyProgress && insights && (
                <button
                  onClick={() => regenerateInsights()}
                  disabled={isLoadingInsights}
                  className="px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {isLoadingInsights ? '分析中...' : 'インサイトを更新'}
                </button>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Values Link */}
        {hasAnyProgress && (
          <div className="mb-6">
            <a
              href="/values"
              className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <span className="text-xl">✨</span>
              <span>あなたの価値観を見る</span>
              <span className="text-sm opacity-80">(7つの軸)</span>
            </a>
          </div>
        )}

        {/* Diagnostic Aggregation */}
        {hasAnyProgress && (
          <DiagnosticAggregation interactiveProgress={allInteractiveProgress} />
        )}

        {/* Insights Panel */}
        {hasAnyProgress && (
          <div className="mb-8 animate-fade-in">
            <InsightsPanel insights={insights} isLoading={isLoadingInsights} />
          </div>
        )}

        {/* Dialogue History */}
        <DialogueHistoryHome allProgress={allInteractiveProgress} />

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

        {/* Main Chat Module - Highlighted */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1 rounded-2xl shadow-lg">
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0">💬</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    みかたくんと対話する
                  </h2>
                  <p className="text-gray-600 mb-4">
                    「大学に行った方がいいのかな？」「進路で悩んでる」「自分の価値観がわからない」…どんな悩みでも大丈夫。対話を通じて、あなたの考えを一緒に整理していきましょう。
                  </p>
                  <button
                    onClick={() => router.push('/module/university-decision')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                  >
                    <span>対話を始める</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Modules */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>ゲームモジュール</span>
            <span className="text-sm font-normal text-gray-500">楽しく自分を知ろう</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAREER_MODULES.filter(m => m.moduleType === 'interactive').map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={allProgress[module.id]}
                interactiveProgress={allInteractiveProgress[module.id]}
              />
            ))}
          </div>
        </div>

        {/* Info note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>対話の中で価値観が見えてきたら、「価値観バトル」にも挑戦してみよう！</p>
        </div>
      </main>

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
