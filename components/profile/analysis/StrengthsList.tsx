'use client';

import { useState } from 'react';
import { StrengthsData } from '@/types/profile';
import { ChevronDown, ChevronUp, Zap, FileText, AlertCircle, ShieldCheck } from 'lucide-react';

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
    <div className="rounded-3xl bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-lg shadow-orange-100 border border-white/70">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700 shadow-inner">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">発見された強み</h2>
            <p className="text-xs text-gray-500">{data.totalCount}件の強みが抽出されています</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-orange-700 border border-orange-100 shadow-sm">
          <ShieldCheck className="h-4 w-4" />
          信頼度
        </div>
      </div>

      <div className="space-y-5">
        {data.strengths.map((strength, index) => {
          const isExpanded = expandedStrengths.has(strength.id);
          return (
            <div key={strength.id} className="rounded-2xl border border-orange-100 bg-white/90 p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{strength.name}</h3>
                    <p className="text-xs text-gray-500">最終更新 {formatDate(strength.lastUpdated)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-100">
                    {strength.ratingText}
                  </span>
                  <span className="text-yellow-400 text-sm">{renderStars(strength.rating)}</span>
                </div>
              </div>

              <p className="mb-4 text-sm text-gray-700 leading-relaxed">{strength.description}</p>

              {strength.typicalBehaviors.length > 0 && (
                <div className="mb-4 rounded-xl bg-orange-50/60 p-3 border border-orange-100/70">
                  <h4 className="mb-2 text-xs font-bold text-orange-800">典型行動</h4>
                  <ul className="flex flex-wrap gap-2">
                    {strength.typicalBehaviors.map((behavior, idx) => (
                      <li key={idx} className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 border border-orange-100 shadow-sm">
                        {behavior}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <h4 className="mb-2 text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  根拠エピソード（{strength.episodes.length}件）
                </h4>
                <ul className="space-y-2">
                  {strength.episodes.map((episode) => (
                    <li key={episode.id} className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 text-sm text-gray-700">
                      <div className="font-medium text-gray-900">{episode.title}</div>
                      {episode.fullText && isExpanded && (
                        <p className="mt-1 text-xs text-gray-600 leading-relaxed">{episode.fullText}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {strength.needsMoreEpisodes && (
                <div className="mb-4 rounded-lg bg-blue-50 p-3 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">もう1〜2件エピソードを追加すると信頼度UP</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">詳細を開いてエピソード全文を確認</span>
                <button
                  onClick={() => toggleStrength(strength.id)}
                  className="flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50"
                >
                  {isExpanded ? (
                    <>
                      <span>閉じる</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>全文を見る</span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
