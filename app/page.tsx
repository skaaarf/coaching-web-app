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

  const handleModuleClick = (moduleId: string, moduleType: 'chat' | 'interactive') => {
    const hasProgress = moduleType === 'chat'
      ? allProgress[moduleId] && allProgress[moduleId].messages.length > 0
      : allInteractiveProgress[moduleId];

    if (hasProgress) {
      setSelectedModule(moduleId);
      setShowModuleDialog(true);
    } else {
      // No progress, go directly to module
      const path = moduleType === 'chat' ? `/module/${moduleId}` : `/interactive/${moduleId}`;
      router.push(path);
    }
  };

  const handleContinue = () => {
    if (!selectedModule) return;
    const module = CAREER_MODULES.find(m => m.id === selectedModule);
    if (!module) return;

    const path = module.moduleType === 'chat' ? `/module/${selectedModule}` : `/interactive/${selectedModule}`;
    router.push(path);
    setShowModuleDialog(false);
  };

  const handleStartNew = async () => {
    if (!selectedModule) return;
    const module = CAREER_MODULES.find(m => m.id === selectedModule);
    if (!module) return;

    // Clear progress for this module
    if (module.moduleType === 'chat') {
      await storage.saveModuleProgress(selectedModule, {
        moduleId: selectedModule,
        messages: [],
        lastUpdated: new Date(),
        completed: false
      });
    } else {
      await storage.saveInteractiveModuleProgress(selectedModule, {
        moduleId: selectedModule,
        data: null,
        lastUpdated: new Date(),
        completed: false
      });
    }

    // Reload progress
    const progress = await storage.getAllModuleProgress();
    const interactiveProgress = await storage.getAllInteractiveModuleProgress();
    setAllProgress(progress);
    setAllInteractiveProgress(interactiveProgress);

    // Navigate to module
    const path = module.moduleType === 'chat' ? `/module/${selectedModule}` : `/interactive/${selectedModule}`;
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
              {activeTab === 'values' && !loadingValues && (
                <div className="animate-fade-in">
                  <ValuesDisplay current={currentValues} previous={previousValues} />
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
      {showModuleDialog && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {CAREER_MODULES.find(m => m.id === selectedModule)?.title}
            </h3>
            <p className="text-gray-600 mb-6">
              このモジュールには保存された進行状況があります。どうしますか？
            </p>
            <div className="space-y-3">
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                続きから始める
              </button>
              <button
                onClick={handleStartNew}
                className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all"
              >
                新しく始める
              </button>
              <button
                onClick={() => setShowModuleDialog(false)}
                className="w-full text-gray-500 hover:text-gray-700 px-6 py-2 text-sm font-medium transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

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
