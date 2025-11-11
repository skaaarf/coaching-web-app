'use client';

import { ValueSnapshot } from '@/types';
import ValueSlider from './ValueSlider';

interface ValuesDisplayProps {
  current: ValueSnapshot;
  previous?: ValueSnapshot | null;
}

const AXIS_CONFIG = [
  {
    key: 'money_vs_meaning' as const,
    label: 'お金 vs やりがい',
    leftLabel: 'お金',
    rightLabel: 'やりがい',
    leftEmoji: '💰',
    rightEmoji: '🎯',
    getDescription: (value: number) => {
      if (value < 30) return 'お金・給料を重視';
      if (value < 70) return 'バランス型';
      return 'やりがい重視';
    },
  },
  {
    key: 'stability_vs_challenge' as const,
    label: '安定 vs 挑戦',
    leftLabel: '安定',
    rightLabel: '挑戦',
    leftEmoji: '🛡️',
    rightEmoji: '🚀',
    getDescription: (value: number) => {
      if (value < 30) return '安定を重視';
      if (value < 70) return 'バランス型';
      return '挑戦したい!';
    },
  },
  {
    key: 'team_vs_solo' as const,
    label: '人と vs 一人で',
    leftLabel: '人と',
    rightLabel: '一人で',
    leftEmoji: '👥',
    rightEmoji: '🧑',
    getDescription: (value: number) => {
      if (value < 30) return 'チームで働きたい';
      if (value < 70) return 'バランス型';
      return '一人で働きたい';
    },
  },
  {
    key: 'specialist_vs_generalist' as const,
    label: '専門 vs 幅広',
    leftLabel: '専門',
    rightLabel: '幅広',
    leftEmoji: '🎯',
    rightEmoji: '🌈',
    getDescription: (value: number) => {
      if (value < 30) return '専門性を極めたい';
      if (value < 70) return 'バランス型';
      return '幅広くやりたい';
    },
  },
  {
    key: 'growth_vs_balance' as const,
    label: '成長 vs バランス',
    leftLabel: '成長',
    rightLabel: 'バランス',
    leftEmoji: '📈',
    rightEmoji: '⚖️',
    getDescription: (value: number) => {
      if (value < 30) return '成長重視';
      if (value < 70) return 'バランス型';
      return 'プライベート重視';
    },
  },
  {
    key: 'corporate_vs_startup' as const,
    label: '大企業 vs 起業',
    leftLabel: '大企業',
    rightLabel: '起業',
    leftEmoji: '🏢',
    rightEmoji: '💡',
    getDescription: (value: number) => {
      if (value < 30) return '大企業志向';
      if (value < 70) return 'ベンチャー志向';
      return '起業志向!';
    },
  },
  {
    key: 'social_vs_self' as const,
    label: '社会貢献 vs 自己実現',
    leftLabel: '社会',
    rightLabel: '自分',
    leftEmoji: '🌍',
    rightEmoji: '⭐',
    getDescription: (value: number) => {
      if (value < 30) return '社会貢献したい';
      if (value < 70) return 'バランス型';
      return '自己実現したい';
    },
  },
];

export default function ValuesDisplay({ current, previous }: ValuesDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">あなたの価値観</h2>
        <p className="text-sm opacity-90">
          対話から抽出された、あなたのキャリア価値観です
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            信頼度: {current.overall_confidence}%
          </span>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            {new Date(current.created_at).toLocaleDateString('ja-JP')}
          </span>
        </div>
      </div>

      {/* Change indicator */}
      {previous && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800">
            📊 前回({new Date(previous.created_at).toLocaleDateString('ja-JP')})との比較を表示しています
          </p>
        </div>
      )}

      {/* Sliders */}
      <div>
        {AXIS_CONFIG.map((config) => {
          const value = current.axes[config.key];
          const previousValue = previous?.axes[config.key];
          const reasoning = current.reasoning[config.key];

          return (
            <ValueSlider
              key={config.key}
              label={config.label}
              leftLabel={config.leftLabel}
              rightLabel={config.rightLabel}
              leftEmoji={config.leftEmoji}
              rightEmoji={config.rightEmoji}
              value={value}
              previousValue={previousValue}
              description={config.getDescription(value)}
              reason={reasoning?.reason}
              confidence={reasoning?.confidence}
            />
          );
        })}
      </div>

      {/* Footer note */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 この価値観は対話内容から自動的に抽出されたものです。もっと対話を重ねることで、より正確な分析が可能になります。
        </p>
      </div>
    </div>
  );
}
