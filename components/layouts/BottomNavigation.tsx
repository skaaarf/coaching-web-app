'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Clock, User, MessageCircle } from 'lucide-react';

export default function BottomNavigation() {
    const pathname = usePathname();

    const navItems = [
        { name: 'ホーム', href: '/', icon: Home },
        { name: '探す', href: '/activities', icon: Search },
        { name: '履歴', href: '/history', icon: Clock },
        { name: 'マイページ', href: '/profile', icon: User },

    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white pb-safe">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`h-6 w-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
