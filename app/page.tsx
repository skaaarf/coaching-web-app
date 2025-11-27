'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import UserMenu from '@/components/UserMenu';
import SelfAnalysisSection from '@/components/home/SelfAnalysisSection';
import ModulesSection from '@/components/home/ModulesSection';
import HistorySection from '@/components/home/HistorySection';
import ModuleSelectionDialog from '@/components/home/ModuleSelectionDialog';
import { useHomeData } from '@/hooks/useHomeData';

export default function Home() {
  const searchParams = useSearchParams();
  const {
    allProgress,
    allInteractiveProgress,
    activeSection,
    setActiveSection,
    selectedModule,
    showModuleDialog,
    setShowModuleDialog,
    moduleSessions,
    interactiveModuleSessions,
    modulesSectionRef,
    handleModuleClick,
    handleContinue,
    handleStartNew,
    hasAnyProgress,
  } = useHomeData();

  const sectionTabs: Array<{ id: 'analysis' | 'modules' | 'history'; label: string; icon: string }> = [
    { id: 'analysis', label: '分析', icon: '📊' },
    { id: 'modules', label: 'モジュール', icon: '🎮' },
    { id: 'history', label: '履歴', icon: '🕘' },
  ];

  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam === 'analysis' || sectionParam === 'modules' || sectionParam === 'history') {
      setActiveSection(sectionParam);
    }
  }, [searchParams, setActiveSection]);

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

      <main className="relative z-20 mx-auto w-full max-w-3xl px-5 pb-32">
        {activeSection === 'analysis' && (
          <SelfAnalysisSection
            allProgress={allProgress}
            allInteractiveProgress={allInteractiveProgress}
          />
        )}

        {activeSection === 'modules' && (
          <ModulesSection
            modulesSectionRef={modulesSectionRef}
            allProgress={allProgress}
            allInteractiveProgress={allInteractiveProgress}
            onModuleClick={handleModuleClick}
          />
        )}

        {activeSection === 'history' && (
          <HistorySection
            allProgress={allProgress}
            onSessionClick={(moduleId, sessionId) => handleContinue(sessionId)}
          />
        )}
      </main>

      <nav className="fixed bottom-6 inset-x-0 z-30 px-4">
        <div className="mx-auto flex w-full max-w-md items-center justify-between rounded-3xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl shadow-gray-900/10 backdrop-blur">
          {sectionTabs.map(tab => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex flex-col items-center text-xs font-semibold transition ${isActive ? 'text-gray-900' : 'text-gray-400'
                  }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <ModuleSelectionDialog
        isOpen={showModuleDialog}
        onClose={() => setShowModuleDialog(false)}
        selectedModuleId={selectedModule}
        moduleSessions={moduleSessions}
        interactiveModuleSessions={interactiveModuleSessions}
        onStartNew={handleStartNew}
        onContinue={handleContinue}
      />

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
