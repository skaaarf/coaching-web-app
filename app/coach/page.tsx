'use client';

import ChatInterface from '@/components/coach/ChatInterface';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CoachPage() {
    const router = useRouter();

    return (
        <div className="flex h-screen flex-col bg-white lg:hidden">
            {/* Mobile Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
                <button
                    onClick={() => router.back()}
                    className="rounded-lg p-2 hover:bg-gray-100"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">コーチ</h1>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden">
                <ChatInterface />
            </div>
        </div>
    );
}
