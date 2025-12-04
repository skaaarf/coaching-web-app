'use client';

import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';

interface WelcomeHeaderProps {
    title?: string;
    subtitle?: string;
    variantLabel?: string;
    switchHref?: string;
    switchLabel?: string;
}

export default function WelcomeHeader({
    title = 'ようこそ、凌太朗さん 👋',
    subtitle = '今日も一歩ずつキャリアを前進させましょう',
    variantLabel,
    switchHref,
    switchLabel,
}: WelcomeHeaderProps) {
    return (
        <div className="mb-10">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {variantLabel && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                                <Sparkles className="h-4 w-4" />
                                {variantLabel}
                            </span>
                        )}
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                        {title}
                    </h1>
                    <p className="mb-6 text-gray-600 text-lg">
                        {subtitle}
                    </p>
                </div>
                {switchHref && switchLabel && (
                    <Link
                        href={switchHref}
                        className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        {switchLabel}
                    </Link>
                )}
            </div>

            <div className="relative max-w-2xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-base transition-all"
                    placeholder="モジュールやアクティビティを探す..."
                />
            </div>
        </div>
    );
}
