'use client';

import { ActivityDefinition } from '@/types/activity';
import { Sparkles, NotebookPen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface RealTimeAnalysisPanelProps {
    activity: ActivityDefinition;
    stepCount: number;
    history: { type: 'mikata' | 'user' | 'summary'; content: string | any }[];
}

export default function RealTimeAnalysisPanel({ activity, stepCount, history }: RealTimeAnalysisPanelProps) {
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const lastSummarizedStep = useRef(0);

    useEffect(() => {
        if (!history || history.length === 0) {
            setSummary('');
            return;
        }

        const shouldSummarize = stepCount >= 10 && stepCount % 10 === 0 && stepCount !== lastSummarizedStep.current;
        if (!shouldSummarize) return;

        const run = async () => {
            try {
                setIsLoading(true);
                const res = await fetch('/api/summarize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatHistory: history }),
                });
                if (!res.ok) throw new Error('Failed to summarize');
                const data = await res.json();
                setSummary(data.summary || '');
                lastSummarizedStep.current = stepCount;
            } catch (e) {
                console.error('Summarize error', e);
            } finally {
                setIsLoading(false);
            }
        };

        run();
    }, [history, stepCount]);

    return (
        <div className="hidden w-80 flex-col border-l border-gray-200 bg-white lg:flex">
            <div className="p-6">
                <div className="mb-6 flex items-center gap-2 text-blue-600">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span className="font-bold">ざっくりメモ</span>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl bg-gray-50 p-4 transition-all duration-500">
                        <div className="mb-3 flex items-center gap-2 text-gray-700">
                            <NotebookPen className="h-4 w-4" />
                            <h3 className="font-bold text-sm">10ラリーごとのまとめ</h3>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm border border-gray-100 min-h-[80px] flex items-center">
                            {isLoading && <span className="text-xs text-gray-400">生成中...</span>}
                            {!isLoading && summary && (
                                <div className="whitespace-pre-line leading-relaxed">{summary}</div>
                            )}
                            {!isLoading && !summary && (
                                <span className="text-xs text-gray-400">やりとりが始まるとメモを表示します</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 rounded-lg bg-blue-50 p-4 text-xs text-blue-800">
                    <p className="font-bold mb-1">チャットメモについて</p>
                    <p className="opacity-80">
                        このパネルは今のチャット内容だけを手元メモとして表示しています。正式な分析は完了後にマイページへ反映されます。
                    </p>
                </div>
            </div>
        </div>
    );
}
