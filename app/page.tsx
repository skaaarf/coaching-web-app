'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CAREER_MODULES } from '@/lib/modules';
import { useStorage } from '@/hooks/useStorage';
import { generateInsights } from '@/lib/insights';
import { ModuleProgress, InteractiveModuleProgress, UserInsights, ValueSnapshot } from '@/types';
import ModuleCard from '@/components/ModuleCard';
import InsightsPanel from '@/components/InsightsPanel';
import UserMenu from '@/components/UserMenu';
import DialogueHistoryHome from '@/components/DialogueHistoryHome';
import DiagnosticAggregation from '@/components/DiagnosticAggregation';
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

  useEffect(() => {
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
      const response = await fetch('/api/values');

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          // Not logged in or no values yet - this is fine
          setCurrentValues(null);
          setPreviousValues(null);
          return;
        }
        throw new Error('価値観の取得に失敗しました');
      }

      const data = await response.json();

      if (data.current) {
        setCurrentValues(data.current);
        setPreviousValues(data.previous || null);
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
        {/* Values Display */}
        {!loadingValues && (
          <div className="mb-8 animate-fade-in">
            <ValuesDisplay current={currentValues} previous={previousValues} />
          </div>
        )}

        {/* Diagnostic Aggregation */}
        {hasAnyProgress ? (
          <DiagnosticAggregation interactiveProgress={allInteractiveProgress} />
        ) : (
          <div className="mb-8 bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <p className="text-sm text-purple-800">
              🎮 ゲームモジュールを完了すると、ここにあなたについて分かったことが表示されます
            </p>
          </div>
        )}

        {/* Insights Panel */}
        {hasAnyProgress && (
          <div className="mb-8 animate-fade-in">
            <InsightsPanel insights={insights} isLoading={isLoadingInsights} />
          </div>
        )}

        {/* Dialogue History */}
        <DialogueHistoryHome
          allProgress={allInteractiveProgress}
          chatProgress={allProgress}
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
              />
            ))}
            {/* Then game modules */}
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
