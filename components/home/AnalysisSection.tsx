import { UserInsights, ValueSnapshot } from '@/types';
import ValuesDisplay from '@/components/ValuesDisplay';
import InsightsPanel from '@/components/InsightsPanel';

interface AnalysisSectionProps {
    activeTab: 'values' | 'insights';
    setActiveTab: (tab: 'values' | 'insights') => void;
    loadingValues: boolean;
    valuesError: Error | null;
    currentValues: ValueSnapshot | null;
    previousValues: ValueSnapshot | null;
    hasAnyProgress: boolean;
    insights: UserInsights | null;
    isLoadingInsights: boolean;
    insightsError: Error | null;
}

export default function AnalysisSection({
    activeTab,
    setActiveTab,
    loadingValues,
    valuesError,
    currentValues,
    previousValues,
    hasAnyProgress,
    insights,
    isLoadingInsights,
    insightsError,
}: AnalysisSectionProps) {
    return (
        <>
            <section className="mt-6 rounded-[28px] border border-white/70 bg-white/80 px-5 py-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Personal data</p>
                        <h3 className="text-xl font-semibold text-gray-900">あなただけのコンパス</h3>
                        <p className="text-sm text-gray-500 mt-1">価値観とキャリア志向の2軸から、今日の問いを決めましょう。</p>
                    </div>
                    <div className="rounded-full border border-gray-200/80 px-4 py-1 text-xs font-semibold text-gray-500">
                        {activeTab === 'values' ? 'Values' : 'Insights'}
                    </div>
                </div>
                <div className="mt-5 inline-flex rounded-full border border-gray-200 bg-gray-100 p-1 text-sm font-semibold text-gray-500">
                    <button
                        onClick={() => setActiveTab('values')}
                        className={`rounded-full px-4 py-2 transition ${activeTab === 'values'
                            ? 'bg-white text-gray-900 shadow'
                            : 'text-gray-500'
                            }`}
                    >
                        💎 あなたの価値観
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`rounded-full px-4 py-2 transition ${activeTab === 'insights'
                            ? 'bg-white text-gray-900 shadow'
                            : 'text-gray-500'
                            }`}
                    >
                        🧠 キャリア志向
                    </button>
                </div>

                <div className="mt-6">
                    {activeTab === 'values' && (
                        <div className="rounded-3xl border border-gray-200/70 bg-white/90 p-4">
                            {valuesError ? (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
                                    <div className="text-5xl mb-3">⚠️</div>
                                    <p className="text-red-800 mb-2 text-sm font-semibold">エラーが発生しました</p>
                                    <p className="text-xs text-red-600 mb-4">
                                        {valuesError.message}
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="text-sm text-red-700 hover:text-red-900 underline"
                                    >
                                        ページを再読み込み
                                    </button>
                                </div>
                            ) : loadingValues ? (
                                <div className="text-center py-8">
                                    <div className="flex items-center justify-center gap-3 mb-3">
                                        <div className="w-6 h-6 border-4 border-gray-900/40 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-base font-medium text-gray-700">価値観を読み込み中...</span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        対話から抽出された価値観を分析しています
                                    </p>
                                </div>
                            ) : currentValues ? (
                                <ValuesDisplay current={currentValues} previous={previousValues} showHeader={false} showFooter={false} />
                            ) : (
                                <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-8 text-center">
                                    <div className="text-5xl mb-3">💎</div>
                                    <p className="text-gray-700 mb-2 text-sm">まだ価値観が抽出されていません</p>
                                    <p className="text-xs text-gray-500">
                                        対話やゲームモジュールを進めると、AIがあなたの価値観を分析します
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'insights' && (
                        <div className="rounded-3xl border border-gray-200/70 bg-white/90 p-4">
                            {insightsError ? (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
                                    <div className="text-5xl mb-3">⚠️</div>
                                    <p className="text-red-800 mb-2 text-sm font-semibold">エラーが発生しました</p>
                                    <p className="text-xs text-red-600 mb-4">
                                        {insightsError.message}
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="text-sm text-red-700 hover:text-red-900 underline"
                                    >
                                        ページを再読み込み
                                    </button>
                                </div>
                            ) : hasAnyProgress ? (
                                <InsightsPanel insights={insights} isLoading={isLoadingInsights} />
                            ) : (
                                <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-8 text-center">
                                    <div className="text-5xl mb-3">🎯</div>
                                    <p className="text-gray-700 mb-2 text-sm">まだ対話やゲームを始めていません</p>
                                    <p className="text-xs text-gray-500">
                                        対話やゲームモジュールを進めると、AIがあなたのキャリア志向を分析します
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {!hasAnyProgress && (
                <div className="mt-6 overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
                    <div className="text-xs uppercase tracking-[0.4em] text-white/60">First step</div>
                    <h2 className="mt-3 text-2xl font-semibold">ようこそ、みかたスタジオへ</h2>
                    <p className="mt-2 text-sm text-white/80">
                        ここから先は、あなただけのキャリア実験室。直感的に話してみて、問いの連鎖を楽しみましょう。
                    </p>
                </div>
            )}
        </>
    );
}
