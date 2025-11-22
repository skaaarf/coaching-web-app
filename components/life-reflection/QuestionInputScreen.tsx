'use client';

import { useState } from 'react';
import { getEraById } from '@/lib/lifeReflectionData';

interface Props {
    eraId: string;
    questionId: string;
    existingResponse?: string;
    onSaveResponse: (response: string) => void;
    onBack: () => void;
}

export default function QuestionInputScreen({
    eraId,
    questionId,
    existingResponse,
    onSaveResponse,
    onBack,
}: Props) {
    const [response, setResponse] = useState(existingResponse || '');

    const eraConfig = getEraById(eraId);
    const question = eraConfig?.questions.find((q) => q.id === questionId);

    const handleSaveAndBack = () => {
        if (response.trim()) {
            onSaveResponse(response.trim());
        }
        onBack();
    };

    const handleBackClick = () => {
        if (response.trim()) {
            onSaveResponse(response.trim());
        }
        onBack();
    };

    if (!question) {
        return <div>Question not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={handleBackClick}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 flex items-center gap-1"
                >
                    ← 時代一覧に戻る
                </button>

                <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{eraConfig?.emoji}</span>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            {eraConfig?.name}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {question.text}
                    </h3>
                </div>
            </div>

            {/* Textarea */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    あなたの答え
                </label>
                <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="自由に書いてください。思い出せることを書くだけでOKです。"
                    className="w-full min-h-[200px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none text-base"
                />
                <p className="text-xs text-gray-500 mt-2">
                    {response.length} 文字
                </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
                <button
                    onClick={handleSaveAndBack}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                    💾 保存して戻る
                </button>
            </div>

            {/* Info */}
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg inline-block">
                    💡 後から編集できます。まずは思いついたことを書いてみましょう
                </p>
            </div>
        </div>
    );
}
