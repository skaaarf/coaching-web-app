'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Clock, User, Settings, HelpCircle } from 'lucide-react';
import Image from 'next/image';

export default function SidebarNavigation() {
    const pathname = usePathname();

    const navItems = [
        { name: 'ホーム', href: '/', icon: Home },
        { name: '探す', href: '/activities', icon: Search },
        { name: '履歴', href: '/history', icon: Clock },
        { name: 'マイページ', href: '/profile', icon: User },
        { name: 'ES質問ビルダー', href: '/interactive/es-builder', icon: Search }, // Added ES Builder
    ];

    const bottomItems = [
        { name: 'ヘルプ', href: '/help', icon: HelpCircle },
        { name: '設定', href: '/settings', icon: Settings },
    ];

    return (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
            <div className="flex h-16 items-center px-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 p-[2px]">
                        <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                            <Image src="/mascot/coach-point.png" alt="Logo" fill className="object-cover" />
                        </div>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Coach</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                                ? 'bg-blue-50 text-blue-700 shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-gray-200 p-3">
                {bottomItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
