'use client';

import { useState } from 'react';
import { StrengthsData } from '@/types/profile';
import { ChevronDown, ChevronUp, Plus, Zap, Star, FileText, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface StrengthsListProps {
  data: StrengthsData;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
}

function renderStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return '⭐'.repeat(fullStars) + '☆'.repeat(emptyStars);
}

export default function StrengthsList({ data }: StrengthsListProps) {
  const [expandedStrengths, setExpandedStrengths] = useState<Set<string>>(new Set());

  const toggleStrength = (strengthId: string) => {
    const newExpanded = new Set(expandedStrengths);
    if (newExpanded.has(strengthId)) {
      newExpanded.delete(strengthId);
    } else {
      newExpanded.add(strengthId);
    }
    setExpandedStrengths(newExpanded);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
          <Zap className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">発見された強み</h2>
          <p className="text-xs text-gray-500">{data.totalCount}件の強みが特定されています</p>
        </div>
      </div>

      <div className="space-y-6">
        {data.strengths.map((strength, index) => {
          const isExpanded = expandedStrengths.has(strength.id);
          return (
            <div key={strength.id}>
              {/* 区切り線 */}
              {index > 0 && <div className="mb-6 border-t-2 border-gray-100" />}

              <div className="rounded-xl bg-white border border-gray-200 p-5 hover:border-primary/30 transition-colors">
                {/* 強みのヘッダー */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{strength.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {renderStars(strength.rating)}
                    </div>
                    <span className="text-xs font-bold text-primary">({strength.ratingText})</span>
                  </div>
                </div>

                {/* 説明 */}
                <p className="mb-4 text-sm text-gray-700">{strength.description}</p>

                {/* 典型行動 */}
                {strength.typicalBehaviors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-bold text-gray-900">典型行動：</h4>
                    <ul className="space-y-1 pl-5">
                      {strength.typicalBehaviors.map((behavior, idx) => (
                        <li key={idx} className="text-sm text-gray-700 list-disc">
                          {behavior}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* エピソード */}
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-bold text-gray-900">
                    根拠エピソード（{strength.episodes.length}件）：
                  </h4>
                  <ul className="space-y-1 pl-5">
                    {strength.episodes.map((episode) => (
                      <li key={episode.id} className="text-sm text-gray-700 list-none flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          {episode.title}
                          {episode.fullText && isExpanded && (
                            <div className="mt-1 ml-5 text-xs text-gray-600 italic">
                              {episode.fullText}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* エピソード不足の警告 */}
                {strength.needsMoreEpisodes && (
                  <div className="mb-4 rounded-lg bg-blue-50 p-3 border border-blue-100">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">もう1〜2件エピソードがあると信頼度UP</span>
                    </div>
                  </div>
                )}

                {/* 最終更新と詳細ボタン */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    最終更新：{formatDate(strength.lastUpdated)}
                  </span>
                  <button
                    onClick={() => toggleStrength(strength.id)}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
                  >
                    {isExpanded ? (
                      <>
                        <span>詳細を閉じる</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>詳細を見る</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
