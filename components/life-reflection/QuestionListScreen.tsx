'use client';

import { EraData } from '@/types';
import { getEraById } from '@/lib/lifeReflectionData';

interface Props {
    eraId: string;
    eraData: EraData;
    onQuestionSelect: (questionId: string) => void;
    onSatisfactionInput: () => void;
    onBack: () => void;
}

export default function QuestionListScreen({
    eraId,
    eraData,
    onQuestionSelect,
    onSatisfactionInput,
    onBack,
}: Props) {
    const eraConfig = getEraById(eraId);

    if (!eraConfig) {
        return <div>Era not found</div>;
    }

    const totalQuestions = eraConfig.questions.length;
    const answeredQuestions = eraData.questionResponses.length;
    const allQuestionsAnswered = answeredQuestions === totalQuestions;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-3 flex items-center gap-1"
                >
                    ← 戻る
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{eraConfig.emoji}</span>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {eraConfig.name}
                        </h2>
                        <p className="text-sm text-gray-600">{eraConfig.catchphrase}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                            進捗状況
                        </span>
                        <span className="text-xs font-bold text-blue-600">
                            {answeredQuestions}/{totalQuestions} 完了
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                            style={{
                                width: `${(answeredQuestions / totalQuestions) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Question Cards */}
            <div className="space-y-4 mb-6">
                {eraConfig.questions.map((question, index) => {
                    const response = eraData.questionResponses.find(
                        (r) => r.questionId === question.id
                    );
                    const isAnswered = !!response;

                    return (
                        <button
                            key={question.id}
                            onClick={() => onQuestionSelect(question.id)}
                            className="w-full bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-5 transition-all duration-200 shadow-md hover:shadow-lg text-left group"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            質問 {index + 1}
                                        </span>
                                        {isAnswered && (
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                                                <span>✓</span>
                                                <span>完了</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-base font-medium text-gray-900 leading-relaxed">
                                        {question.text}
                                    </p>
                                    {response && (
                                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                            {response.response}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors">
                                    {isAnswered ? '✏️' : '→'}
                                </div>
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
                <button
                    onClick={onSatisfactionInput}
                    disabled={!allQuestionsAnswered}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-200 ${allQuestionsAnswered
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {eraData.satisfaction !== null && eraData.satisfaction !== undefined
                        ? '📊 満足度を編集する'
                        : '📊 満足度を入力する'}
                </button>
            </div>
        </div>
    );
}
