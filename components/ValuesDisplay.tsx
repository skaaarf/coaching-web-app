'use client';

import { ValueSnapshot } from '@/types';
import ValueSlider from './ValueSlider';
import SimpleRadarChart from './SimpleRadarChart';

interface ValuesDisplayProps {
  current?: ValueSnapshot | null;
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
    tooltip: '仕事において、金銭的な報酬と仕事の意義・やりがいのどちらを重視するかを示します。左に行くほど給料や待遇を重視し、右に行くほど社会的意義や個人的な充実感を重視します。',
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
    tooltip: 'キャリアにおいて、安定性とリスクを取った挑戦のどちらを好むかを示します。左に行くほど確実性や予測可能性を重視し、右に行くほど新しいことへの挑戦や変化を求めます。',
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
    tooltip: '仕事のスタイルとして、チームワークと個人作業のどちらを好むかを示します。左に行くほど協働や人との関わりを重視し、右に行くほど独立して作業することを好みます。',
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
    tooltip: 'キャリアの方向性として、特定分野の専門性と幅広い経験のどちらを求めるかを示します。左に行くほど一つの分野を深く掘り下げることを好み、右に行くほど多様な経験や知識を求めます。',
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
    tooltip: '仕事と生活のバランスにおいて、成長・スキルアップとプライベートの充実のどちらを優先するかを示します。左に行くほど仕事での成長を重視し、右に行くほどワークライフバランスを重視します。',
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
    tooltip: '働く組織の規模や形態の好みを示します。左に行くほど大企業や確立された組織を好み、右に行くほどスタートアップや起業に興味があります。中間はベンチャー企業志向を示します。',
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
    tooltip: '仕事の目的として、社会や他者への貢献と自分自身の実現のどちらを重視するかを示します。左に行くほど社会的インパクトや他者への貢献を重視し、右に行くほど個人的な目標達成や自己表現を重視します。',
    getDescription: (value: number) => {
      if (value < 30) return '社会貢献したい';
      if (value < 70) return 'バランス型';
      return '自己実現したい';
    },
  },
];

export default function ValuesDisplay({ current, previous }: ValuesDisplayProps) {
  // Create default values if no current data exists
  const displayData = current || {
    axes: {
      money_vs_meaning: 50,
      stability_vs_challenge: 50,
      team_vs_solo: 50,
      specialist_vs_generalist: 50,
      growth_vs_balance: 50,
      corporate_vs_startup: 50,
      social_vs_self: 50,
    },
    reasoning: {},
    overall_confidence: 0,
    created_at: new Date().toISOString(),
  };

  const hasData = !!current;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${hasData ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'} text-white p-6 rounded-lg shadow-lg`}>
        <h2 className="text-2xl font-bold mb-2">あなたの価値観</h2>
        <p className="text-sm opacity-90">
          {hasData ? '対話から抽出された、あなたのキャリア価値観です' : '対話を進めると、ここに価値観が表示されます'}
        </p>
        {hasData && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
              信頼度: {displayData.overall_confidence}%
            </span>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
              {new Date(displayData.created_at).toLocaleDateString('ja-JP')}
            </span>
          </div>
        )}
      </div>

      {/* Change indicator */}
      {previous && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800">
            📊 前回({new Date(previous.created_at).toLocaleDateString('ja-JP')})との比較を表示しています
          </p>
        </div>
      )}

      {/* Simple Radar Chart */}
      {hasData && <SimpleRadarChart current={current!} />}

      {/* Sliders */}
      <div>
        {AXIS_CONFIG.map((config) => {
          const value = displayData.axes[config.key];
          const previousValue = previous?.axes[config.key];
          const reasoning = displayData.reasoning[config.key];

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
              description={hasData ? config.getDescription(value) : 'まだデータがありません'}
              reason={reasoning?.reason}
              confidence={reasoning?.confidence}
              tooltip={config.tooltip}
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
