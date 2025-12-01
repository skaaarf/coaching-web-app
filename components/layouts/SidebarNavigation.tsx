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
    ];

    const bottomItems = [
        { name: 'ヘルプ', href: '/help', icon: HelpCircle },
        { name: '設定', href: '/settings', icon: Settings },
    ];

    return (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
            <div className="flex h-16 items-center px-6">
                <div className="flex items-center gap-2">
                    {/* Logo placeholder - using text for now or existing image if available */}
                    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                        <Image src="/mascot/coach-point.png" alt="Logo" fill className="object-cover" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Coach</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
