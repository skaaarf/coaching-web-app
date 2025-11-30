'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

interface AppLayoutProps {
    children: ReactNode;
    currentSection?: 'analysis' | 'modules' | 'history';
    onSectionChange?: (section: 'analysis' | 'modules' | 'history') => void;
    showNavigation?: boolean;
}

export default function AppLayout({
    children,
    currentSection = 'modules',
    onSectionChange,
    showNavigation = true
}: AppLayoutProps) {
    const navItems = [
        { id: 'analysis' as const, label: '分析', icon: '/icons/analysis.svg' },
        { id: 'modules' as const, label: 'モジュール', icon: '/icons/modules.svg' },
        { id: 'history' as const, label: '履歴', icon: '/icons/history.svg' },
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            {/* デスクトップ: 左サイドバー */}
            {showNavigation && (
                <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 z-50 border-r border-gray-200/70 bg-white/95 backdrop-blur-xl shadow-sm">
                    {/* ロゴエリア */}
                    <div className="p-6 border-b border-gray-200/70">
                        <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12">
                                <Image
                                    src="/mascot/coach-point.png"
                                    alt="AI進路くん"
                                    fill
                                    sizes="48px"
                                    className="object-contain rounded-2xl drop-shadow-md"
                                    priority
                                />
                            </div>
                            <div>
                                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gray-500">Mikata Studio</p>
                                <h1 className="text-lg font-semibold text-gray-900">AI進路くん</h1>
                            </div>
                        </div>
                    </div>

                    {/* ナビゲーション */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navItems.map(item => {
                            const isActive = currentSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onSectionChange?.(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                                        ? 'bg-gray-900 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="relative w-6 h-6">
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            fill
                                            sizes="24px"
                                            className={`object-contain transition ${isActive ? 'brightness-0 invert' : ''}`}
                                        />
                                    </div>
                                    <span className="font-semibold">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>
            )}

            {/* メインコンテンツ */}
            <main className={`relative ${showNavigation ? 'lg:pl-64' : ''}`}>
                {children}
            </main>

            {/* モバイル: 下部ナビ */}
            {showNavigation && (
                <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-gray-200/70 bg-white/95 py-3 shadow-lg backdrop-blur">
                    <div className="flex w-full items-center justify-around">
                        {navItems.map(item => {
                            const isActive = currentSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onSectionChange?.(item.id)}
                                    className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${isActive ? 'text-gray-900' : 'text-gray-400'
                                        }`}
                                >
                                    <div className="relative w-6 h-6">
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            fill
                                            sizes="24px"
                                            className={`object-contain transition ${isActive ? 'opacity-100' : 'opacity-40'}`}
                                        />
                                    </div>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
