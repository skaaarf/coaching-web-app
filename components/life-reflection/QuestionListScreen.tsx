'use client';

import { EraData, LifeReflectionData } from '@/types';
import { getEraById } from '@/lib/lifeReflectionData';

interface Props {
    eraId: string;
    data: LifeReflectionData;
    onSelectQuestion: (eraId: string, questionId: string) => void;
    onUpdateSatisfaction: (eraId: string, value: number) => void;
    onBack: () => void;
}

export default function QuestionListScreen({ eraId, data, onSelectQuestion, onUpdateSatisfaction, onBack }: Props) {
    const eraConfig = getEraById(eraId);
    const eraKey = eraId as keyof typeof data.eras;
    const eraData = data.eras[eraKey];

    if (!eraConfig) return null;
    // Ensure eraData exists so answered状態を正しく判定
    const ensuredEraData = eraData || {
        eraId,
        questionResponses: [],
        satisfaction: null,
        completed: false,
    };

    const totalQuestions = eraConfig.questions.length;
    const answeredQuestions = ensuredEraData.questionResponses.length;
    const allQuestionsAnswered = answeredQuestions === totalQuestions;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={onBack}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        時代一覧に戻る
                    </button>
                </div>

                {/* Era Header */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="text-5xl">{eraConfig.emoji}</div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{eraConfig.name}</h2>
                            <p className="text-sm text-gray-600">{eraConfig.catchphrase}</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mt-4">
                        <div className="text-sm font-semibold text-purple-700">
                            進捗: {answeredQuestions}/{totalQuestions}
                        </div>
                        <div className="flex-1 bg-purple-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3">
                    {eraConfig.questions.map((question, index) => {
                        const response = ensuredEraData.questionResponses.find(
                            (r) => r.questionId === question.id
                        );
                        const isAnswered = !!response;

                        return (
                            <button
                                key={question.id}
                                onClick={() => onSelectQuestion(eraId, question.id)}
                                className={`w-full border-2 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md text-left group ${isAnswered
                                    ? 'bg-blue-50 border-blue-200 hover:border-blue-400'
                                    : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isAnswered
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-600 group-hover:bg-blue-500 group-hover:text-white'
                                        }`}>
                                        {isAnswered ? '✓' : index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium mb-1 ${isAnswered ? 'text-blue-900' : 'text-gray-900'
                                            }`}>
                                            {question.text}
                                        </p>
                                        {isAnswered ? (
                                            <div className="mt-2 bg-white/60 rounded-lg p-2 border border-blue-100">
                                                <p className="text-xs text-gray-600 line-clamp-2">
                                                    {response?.response}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 mt-1">
                                                未回答
                                            </p>
                                        )}
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Satisfaction Input Section */}
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-2xl p-5">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                        {allQuestionsAnswered
                            ? '✅ すべての質問に答えました！満足度を入力してください'
                            : '📝 すべての質問に答えると、満足度を入力できます'}
                    </p>
                    {eraData.satisfaction !== null && eraData.satisfaction !== undefined ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">現在の満足度:</span>
                                <span className="text-2xl font-bold text-blue-600">{eraData.satisfaction}/10</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={eraData.satisfaction}
                                onChange={(e) => onUpdateSatisfaction(eraId, parseInt(e.target.value))}
                                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => onUpdateSatisfaction(eraId, 5)}
                            disabled={!allQuestionsAnswered}
                            className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-200 ${allQuestionsAnswered
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            📊 満足度を入力する
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
