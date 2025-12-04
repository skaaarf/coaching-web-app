import { ActivityDefinition } from '@/types/activity';
import { Sparkles, Zap, Heart, Compass } from 'lucide-react';

interface RealTimeAnalysisPanelProps {
    activity: ActivityDefinition;
    stepCount: number;
}

export default function RealTimeAnalysisPanel({ activity, stepCount }: RealTimeAnalysisPanelProps) {
    return (
        <div className="hidden lg:flex w-80 flex-col border-l border-gray-200 bg-white/50 backdrop-blur-sm p-6 overflow-y-auto">
            <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    リアルタイム分析中
                </h3>
                <div className="text-xs text-gray-400">
                    あなたの回答から、以下の要素を抽出しています
                </div>
            </div>

            <div className="space-y-6">
                {/* Strengths */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-gray-700 text-sm">強みの種</span>
                    </div>
                    {stepCount > 2 ? (
                        <div className="space-y-2">
                            <div className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-100">
                                構造化力 (推定)
                            </div>
                            <div className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-100">
                                没頭する力 (推定)
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 italic">
                            回答を分析中...
                        </div>
                    )}
                </div>

                {/* Values */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="font-bold text-gray-700 text-sm">価値観の欠片</span>
                    </div>
                    {stepCount > 4 ? (
                        <div className="space-y-2">
                            <div className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded border border-pink-100">
                                自由への渇望
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 italic">
                            回答を分析中...
                        </div>
                    )}
                </div>

                {/* Orientation */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Compass className="w-4 h-4 text-indigo-500" />
                        <span className="font-bold text-gray-700 text-sm">キャリア志向</span>
                    </div>
                    <div className="text-xs text-gray-400 italic">
                        まだデータが足りません
                    </div>
                </div>
            </div>
        </div>
    );
}
