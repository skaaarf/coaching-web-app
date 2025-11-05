'use client';

import { UserInsights } from '@/types';

interface InsightsPanelProps {
  insights: UserInsights | null;
  isLoading?: boolean;
}

export default function InsightsPanel({ insights, isLoading }: InsightsPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!insights || insights.careerThinking.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200 text-center">
        <div className="text-5xl mb-4">🌱</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          まだインサイトがありません
        </h3>
        <p className="text-sm text-gray-600">
          モジュールを進めると、あなたのキャリア思考が見えてきます
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          あなたのキャリア思考
        </h2>
        {insights.lastAnalyzed && (
          <span className="text-xs text-gray-500">
            {new Date(insights.lastAnalyzed).toLocaleDateString('ja-JP')}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Career Thinking */}
        {insights.careerThinking.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              キャリアに対する考え方
            </h3>
            <ul className="space-y-2">
              {insights.careerThinking.map((item, index) => (
                <li key={index} className="text-sm text-gray-800 bg-white/50 rounded-lg px-4 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Current Concerns */}
        {insights.currentConcerns.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">💭</span>
              今考えていること
            </h3>
            <ul className="space-y-2">
              {insights.currentConcerns.map((item, index) => (
                <li key={index} className="text-sm text-gray-800 bg-white/50 rounded-lg px-4 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Thought Flow */}
        {insights.thoughtFlow.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">🌊</span>
              思考の流れ
            </h3>
            <div className="space-y-2">
              {insights.thoughtFlow.map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">→</span>
                  <span className="text-sm text-gray-800 bg-white/50 rounded-lg px-4 py-2 flex-1">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patterns */}
        {insights.patterns.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">🔍</span>
              見えてきたパターン
            </h3>
            <ul className="space-y-2">
              {insights.patterns.map((item, index) => (
                <li key={index} className="text-sm text-gray-800 bg-white/50 rounded-lg px-4 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
