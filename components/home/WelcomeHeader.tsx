'use client';

import { Search } from 'lucide-react';

export default function WelcomeHeader() {
    return (
        <div className="mb-10">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                ようこそ、凌太朗さん 👋
            </h1>
            <p className="mb-6 text-gray-600 text-lg">
                今日も一歩ずつキャリアを前進させましょう
            </p>

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
