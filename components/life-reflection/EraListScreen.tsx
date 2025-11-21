'use client';

import { LifeReflectionData } from '@/types';
import { getErasForAge } from '@/lib/lifeReflectionData';

interface Props {
    userAge: number;
    lifeData: LifeReflectionData;
    onEraSelect: (eraId: string) => void;
}

export default function EraListScreen({
    userAge,
    lifeData,
    onEraSelect,
}: Props) {
    const availableEras = getErasForAge(userAge);

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">人生を振り返る</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            各時代をタップして、思い出を語りましょう
                        </p>
                    </div>
                </div>
            </div>

            {/* Era Cards */}
            <div className="space-y-4">
                {availableEras.map((era) => {
                    const eraData = lifeData.eras[era.id];
                    const totalQuestions = era.questions.length;
                    const answeredQuestions =
                        eraData?.questionResponses.length || 0;
                    const satisfaction = eraData?.satisfaction;
                    const completed = eraData?.completed || false;

                    return (
                        <button
                            key={era.id}
                            onClick={() => onEraSelect(era.id)}
                            className="w-full bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-5 transition-all duration-200 shadow-md hover:shadow-lg text-left group relative"
                        >
                            {/* Completion Badge */}
                            {completed && (
                                <div className="absolute top-3 right-3">
                                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        ✓ 完了
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="text-5xl flex-shrink-0">{era.emoji}</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {era.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-3">
                                        {era.catchphrase}
                                    </p>

                                    {/* Progress */}
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs font-semibold text-blue-600">
                                                質問: {answeredQuestions}/{totalQuestions}
                                            </div>
                                            <div className="flex gap-1">
                                                {Array.from({ length: totalQuestions }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-2 rounded-full ${i < answeredQuestions
                                                            ? 'bg-blue-500'
                                                            : 'bg-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-xs font-semibold">
                                            {satisfaction !== null && satisfaction !== undefined ? (
                                                <span className="text-amber-600">
                                                    満足度: {satisfaction}/10
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">満足度: 未入力</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Info Footer */}
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg inline-block">
                    💡 どの時代から始めてもOK。途中で保存されるので、いつでも続きから再開できます
                </p>
            </div>
        </div>
    );
}
