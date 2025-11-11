'use client';

import { ValueSnapshot } from '@/types';

interface SimpleRadarChartProps {
  current: ValueSnapshot;
}

export default function SimpleRadarChart({ current }: SimpleRadarChartProps) {
  const axes = [
    { key: 'money_vs_meaning', label: 'やりがい', emoji: '🎯' },
    { key: 'stability_vs_challenge', label: '挑戦', emoji: '🚀' },
    { key: 'team_vs_solo', label: '個人', emoji: '🧑' },
    { key: 'specialist_vs_generalist', label: '幅広', emoji: '🌈' },
    { key: 'growth_vs_balance', label: 'バランス', emoji: '⚖️' },
    { key: 'corporate_vs_startup', label: '起業', emoji: '💡' },
    { key: 'social_vs_self', label: '自己実現', emoji: '⭐' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        価値観サマリー
      </h3>

      {/* Simple visual representation */}
      <div className="grid grid-cols-1 gap-3">
        {axes.map((axis) => {
          const value = current.axes[axis.key as keyof typeof current.axes];
          return (
            <div key={axis.key} className="flex items-center gap-3">
              <span className="text-lg w-6 flex-shrink-0">{axis.emoji}</span>
              <span className="text-xs font-medium text-gray-600 w-20 flex-shrink-0">
                {axis.label}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-500"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700 w-8 text-right">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Overall confidence */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">全体の信頼度</span>
          <span className="font-bold text-gray-800">
            {current.overall_confidence}%
          </span>
        </div>
      </div>
    </div>
  );
}
