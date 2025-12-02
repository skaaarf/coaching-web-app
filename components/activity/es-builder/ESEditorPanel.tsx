import React from 'react';
import { EsQuestionTemplate, EsAnswer, EsStatus, EsScoreResult } from '@/types';
import { Sparkles, Loader2 } from 'lucide-react';
import ESScoreResultView from './ESScoreResult';

interface ESEditorPanelProps {
    question: EsQuestionTemplate;
    answer: EsAnswer;
    onUpdateAnswer: (text: string) => void;
    onUpdateStatus: (status: EsStatus) => void;
    onRequestDraft: () => void;
    isTyping: boolean;
    onScore: () => void;
    isScoring: boolean;
    scoreResult: EsScoreResult | null;
    onReflectImprovement: () => void;
}

export default function ESEditorPanel({
    question,
    answer,
    onUpdateAnswer,
    onUpdateStatus,
    onRequestDraft,
    isTyping,
    onScore,
    isScoring,
    scoreResult,
    onReflectImprovement
}: ESEditorPanelProps) {
    // const charCount = answer.text.length;
    // const isOverLimit = charCount > question.recommendedLength;

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className="flex min-h-[60px] items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
                <div>
                    <h2 className="text-sm font-bold text-gray-900">回答</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onScore}
                        disabled={isScoring || answer.text.length < 100}
                        className="flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700 transition-colors hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={answer.text.length < 100 ? "100文字以上で採点可能です" : "AI採点を行う"}
                    >
                        {isScoring ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Sparkles className="h-3.5 w-3.5" />
                        )}
                        {scoreResult ? '再採点する' : '採点する'}
                    </button>

                    <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-gray-500">
                            {answer.text.length}文字
                        </span>
                    </div>
                    <select
                        value={answer.status}
                        onChange={(e) => onUpdateStatus(e.target.value as EsStatus)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                    >
                        <option value="not_started">未着手</option>
                        <option value="drafting">作成中</option>
                        <option value="needs_review">要見直し</option>
                        <option value="done">完成</option>
                    </select>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto p-6">
                <textarea
                    value={answer.text}
                    onChange={(e) => onUpdateAnswer(e.target.value)}
                    placeholder="ここに回答を入力してください..."
                    className="h-[calc(100%-20px)] w-full resize-none border-none bg-transparent text-base leading-relaxed text-gray-800 placeholder-gray-300 focus:ring-0"
                />

                {/* Score Result Area */}
                {scoreResult && (
                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <ESScoreResultView
                            result={scoreResult}
                            onReflectImprovement={onReflectImprovement}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
                {/* Footer content can be added here if needed */}
            </div>
        </div>
    );
}
