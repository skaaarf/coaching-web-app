'use client';

import { Search } from 'lucide-react';

export default function WelcomeHeader() {
    return (
        <div className="mb-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                ようこそ、凌太朗さん 👋
            </h1>

            <div className="relative max-w-2xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-xl border-0 bg-white py-3 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    placeholder="アクティビティを探す..."
                />
            </div>
        </div>
    );
}
