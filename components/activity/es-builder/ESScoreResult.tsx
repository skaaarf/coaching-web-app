import React from 'react';
import { EsScoreResult } from '@/types';
import { Star, ThumbsUp, AlertCircle, ArrowRight } from 'lucide-react';

interface ESScoreResultProps {
    result: EsScoreResult;
    onReflectImprovement: () => void;
}

export default function ESScoreResult({ result, onReflectImprovement }: ESScoreResultProps) {
    const renderStars = (score: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                        key={i}
                        className={`h-3 w-3 ${i <= score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header: Total Score */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">AI採点結果</h3>
                    <p className="text-xs text-gray-500">現在の回答の評価スコアです</p>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${getScoreColor(result.totalScore)}`}>
                        {result.totalScore}
                    </span>
                    <span className="text-sm text-gray-400">/ 100点</span>
                </div>
            </div>

            {/* Criteria Scores */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">構成</span>
                    {renderStars(result.criteriaScores.structure)}
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">具体性</span>
                    {renderStars(result.criteriaScores.specificity)}
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">論理性</span>
                    {renderStars(result.criteriaScores.logic)}
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">独自性</span>
                    {renderStars(result.criteriaScores.uniqueness)}
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">読みやすさ</span>
                    {renderStars(result.criteriaScores.readability)}
                </div>
            </div>

            {/* Feedback Points */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-blue-700">
                        <ThumbsUp className="h-4 w-4" />
                        <h4 className="text-sm font-bold">良かった点</h4>
                    </div>
                    <ul className="space-y-2">
                        {result.goodPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-blue-800">
                                <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-lg bg-orange-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-orange-700">
                        <AlertCircle className="h-4 w-4" />
                        <h4 className="text-sm font-bold">改善ポイント</h4>
                    </div>
                    <ul className="space-y-2">
                        {result.improvementPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-orange-800">
                                <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-orange-400" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={onReflectImprovement}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-md"
            >
                この内容をもとに改善案を作る
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
}
