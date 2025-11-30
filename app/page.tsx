'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layouts/AppLayout';
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



  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam === 'analysis' || sectionParam === 'modules' || sectionParam === 'history') {
      setActiveSection(sectionParam);
    }
  }, [searchParams, setActiveSection]);

  return (
    <AppLayout
      currentSection={activeSection}
      onSectionChange={setActiveSection}
      showNavigation={true}
    >
      {/* 装飾背景 */}
      <div className="pointer-events-none absolute inset-x-0 top-[-280px] h-[420px] bg-gradient-to-b from-sky-200/60 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-[-200px] top-32 h-[280px] w-[280px] rounded-full bg-indigo-300/40 blur-[140px]" />

      {/* トップバー（デスクトップではUserMenuのみ、モバイルでは完全なヘッダー） */}
      <header className="lg:hidden relative z-20 border-b border-white/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/mascot/coach-point.png"
                alt="AI進路くん"
                fill
                sizes="48px"
                className="rounded-2xl object-contain drop-shadow-md"
                priority
              />
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gray-500">Mikata Studio</p>
              <h1 className="text-lg font-semibold text-gray-900">AI進路くん</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserMenu />
          </div>
        </div>
      </header>

      {/* デスクトップ用のUserMenuバー */}
      <div className="hidden lg:block sticky top-0 z-20 border-b border-white/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-end px-5 py-3">
          <UserMenu />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl lg:max-w-6xl px-5 py-6 pb-20 lg:pb-8">
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
      </div>

      <ModuleSelectionDialog
        isOpen={showModuleDialog}
        onClose={() => setShowModuleDialog(false)}
        selectedModuleId={selectedModule}
        moduleSessions={moduleSessions}
        interactiveModuleSessions={interactiveModuleSessions}
        onStartNew={handleStartNew}
        onContinue={handleContinue}
      />
    </AppLayout>
  );
}
