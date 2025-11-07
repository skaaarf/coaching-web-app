'use client';

import { useState, useEffect } from 'react';

export default function ViewModeToggle() {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved view mode from localStorage
    const savedMode = localStorage.getItem('viewMode') as 'mobile' | 'desktop' | null;
    if (savedMode) {
      setViewMode(savedMode);
      applyViewMode(savedMode);
    } else {
      // Detect initial screen size
      const isMobile = window.innerWidth < 768;
      const initialMode = isMobile ? 'mobile' : 'desktop';
      setViewMode(initialMode);
      applyViewMode(initialMode);
    }
  }, []);

  const applyViewMode = (mode: 'mobile' | 'desktop') => {
    const html = document.documentElement;
    if (mode === 'mobile') {
      html.classList.add('force-mobile-view');
      html.classList.remove('force-desktop-view');
    } else {
      html.classList.add('force-desktop-view');
      html.classList.remove('force-mobile-view');
    }
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'mobile' ? 'desktop' : 'mobile';
    setViewMode(newMode);
    localStorage.setItem('viewMode', newMode);
    applyViewMode(newMode);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleViewMode}
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:from-purple-800 active:to-blue-800 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 font-bold text-sm border-2 border-white/20 backdrop-blur-sm touch-manipulation group"
      aria-label={`${viewMode === 'mobile' ? 'デスクトップ' : 'モバイル'}表示に切り替え`}
      title={`${viewMode === 'mobile' ? 'デスクトップ' : 'モバイル'}表示に切り替え`}
    >
      {viewMode === 'mobile' ? (
        <>
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="hidden sm:inline">PC表示</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="hidden sm:inline">スマホ表示</span>
        </>
      )}
    </button>
  );
}
