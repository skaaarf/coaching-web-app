'use client';

import { useEffect, useState } from 'react';
import { CAREER_MODULES } from '@/lib/modules';
import { getAllModuleProgress, getUserInsights, saveUserInsights } from '@/lib/storage';
import { generateInsights } from '@/lib/insights';
import { ModuleProgress, UserInsights } from '@/types';
import ModuleCard from '@/components/ModuleCard';
import InsightsPanel from '@/components/InsightsPanel';
import UserMenu from '@/components/UserMenu';

export default function Home() {
  const [allProgress, setAllProgress] = useState<Record<string, ModuleProgress>>({});
  const [insights, setInsights] = useState<UserInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    // Load progress and insights on mount
    const progress = getAllModuleProgress();
    setAllProgress(progress);

    const savedInsights = getUserInsights();
    setInsights(savedInsights);

    // Generate insights if we have progress but no insights
    const hasProgress = Object.keys(progress).length > 0;
    if (hasProgress && !savedInsights) {
      regenerateInsights(progress);
    }
  }, []);

  const regenerateInsights = async (progress?: Record<string, ModuleProgress>) => {
    setIsLoadingInsights(true);
    try {
      const progressToUse = progress || allProgress;
      const newInsights = await generateInsights(progressToUse);
      setInsights(newInsights);
      saveUserInsights(newInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const hasAnyProgress = Object.keys(allProgress).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">みかたくん</h1>
              <p className="text-sm text-gray-600 mt-1">キャリアについて一緒に考えよう</p>
            </div>
            <div className="flex items-center gap-4">
              {hasAnyProgress && insights && (
                <button
                  onClick={() => regenerateInsights()}
                  disabled={isLoadingInsights}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoadingInsights ? '分析中...' : 'インサイトを更新'}
                </button>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Insights Panel */}
        {hasAnyProgress && (
          <div className="mb-8">
            <InsightsPanel insights={insights} isLoading={isLoadingInsights} />
          </div>
        )}

        {/* Welcome message for new users */}
        {!hasAnyProgress && (
          <div className="mb-8 bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ようこそ！
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ここには様々なキャリアについて考えるモジュールがあります。<br />
              気になるものから始めてみてください。全て完了する必要はありません。<br />
              あなたのペースで、考えたいことから考えていきましょう。
            </p>
          </div>
        )}

        {/* Modules Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            キャリアモジュール
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_MODULES.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                progress={allProgress[module.id]}
              />
            ))}
          </div>
        </div>

        {/* Category filters could go here in the future */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>各モジュールは独立しているので、好きな順番で進められます</p>
        </div>
      </main>
    </div>
  );
}
