'use client';

import AppLayout from '@/components/layouts/AppLayout';
import AnalysisResults from '@/components/profile/analysis/AnalysisResults';
import { useCareerData } from '@/hooks/useCareerData';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { normalizeProfileAnalysis } from '@/lib/normalizeProfileAnalysis';

export default function ProfilePage() {
    const { state, isLoaded, saveProfileAnalysis } = useCareerData();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const bestHistory = useMemo(() => {
        const entries = Object.entries(state.chatHistory || {});
        if (entries.length === 0) return null;
        return entries
            .map(([activityId, history]) => ({ activityId, history }))
            .sort((a, b) => (b.history?.length || 0) - (a.history?.length || 0))[0];
    }, [state.chatHistory]);

    // 自動で分析を生成（履歴があるのにprofileAnalysisがない場合）
    useEffect(() => {
        const shouldAnalyze =
            isLoaded &&
            !state.profileAnalysis &&
            !isAnalyzing &&
            bestHistory &&
            (bestHistory.history?.length || 0) > 0;

        if (!shouldAnalyze) return;

        const run = async () => {
            try {
                setIsAnalyzing(true);
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chatHistory: bestHistory.history,
                        activityId: bestHistory.activityId,
                    }),
                });
                if (!res.ok) throw new Error('analysis failed');
                const raw = await res.json();
                const normalized = normalizeProfileAnalysis(raw, state.profileAnalysis || undefined);
                saveProfileAnalysis(normalized);
            } catch (e) {
                console.error('Profile auto analysis failed:', e);
            } finally {
                setIsAnalyzing(false);
            }
        };

        run();
    }, [bestHistory, isLoaded, isAnalyzing, saveProfileAnalysis, state.profileAnalysis]);

    if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;

    return (
        <AppLayout>
            {/* New Analysis Results */}
            <div className="mb-20 lg:mb-10">
                {state.profileAnalysis ? (
                    <>
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            AIによる最新の分析結果を表示しています
                        </div>
                        <AnalysisResults data={state.profileAnalysis} />
                    </>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-10 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">
                            !
                        </div>
                        <h2 className="mb-3 text-lg font-bold text-gray-900">分析結果はまだありません</h2>
                        <p className="mb-6 text-sm text-gray-600">
                            {isAnalyzing
                                ? '保存済みの会話履歴からAI分析を生成しています...'
                                : 'アクティビティを完了すると、ここにAI分析結果が表示されます。'}
                        </p>
                        {!isAnalyzing && (
                            <Link
                                href="/activities"
                                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                            >
                                アクティビティ一覧へ進む
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
