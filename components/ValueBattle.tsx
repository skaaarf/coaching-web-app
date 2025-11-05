'use client';

import { useState } from 'react';
import { ValueBattleChoice, ValueBattleResult } from '@/types';

const BATTLE_CHOICES: ValueBattleChoice[] = [
  { optionA: '安定した収入', optionB: 'やりがいのある仕事', category: '安定 vs やりがい' },
  { optionA: '大企業で働く', optionB: '自分で起業する', category: '安定 vs 自由' },
  { optionA: '高収入', optionB: '自由な時間', category: '収入 vs 時間' },
  { optionA: '都会で働く', optionB: '地元で働く', category: '場所' },
  { optionA: '専門性を深める', optionB: '幅広い経験', category: 'キャリア' },
  { optionA: '一人で集中', optionB: 'チームで協力', category: '働き方' },
  { optionA: '社会的地位', optionB: '自己実現', category: '価値観' },
  { optionA: '即戦力になる', optionB: 'じっくり学ぶ', category: '成長' },
  { optionA: '有名企業', optionB: '好きな分野', category: 'ブランド vs 興味' },
  { optionA: '給与が高い', optionB: '残業が少ない', category: '収入 vs ワークライフバランス' },
  { optionA: '安全な道', optionB: '挑戦的な道', category: '安定 vs 挑戦' },
  { optionA: '親が喜ぶ', optionB: '自分が楽しい', category: '親の期待 vs 自分' },
  { optionA: '尊敬される仕事', optionB: '好きなことを仕事に', category: '評価 vs 情熱' },
  { optionA: '福利厚生が充実', optionB: 'クリエイティブな環境', category: '待遇 vs 環境' },
  { optionA: 'キャリアアップ', optionB: 'プライベート重視', category: 'キャリア vs プライベート' },
  { optionA: '大きなプロジェクト', optionB: '自分のペース', category: '規模 vs ペース' },
  { optionA: '将来の保証', optionB: '今の充実', category: '未来 vs 現在' },
  { optionA: '競争環境', optionB: '協調環境', category: '環境' },
  { optionA: '学歴を活かす', optionB: '好きを追求', category: '学歴 vs 情熱' },
  { optionA: '計画的なキャリア', optionB: '柔軟なキャリア', category: 'キャリア観' }
];

interface Props {
  onComplete: (results: ValueBattleResult) => void;
}

export default function ValueBattle({ onComplete }: Props) {
  const [currentRound, setCurrentRound] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});

  const handleChoice = (choice: 'A' | 'B') => {
    const current = BATTLE_CHOICES[currentRound];
    const selected = choice === 'A' ? current.optionA : current.optionB;

    setChoices({
      ...choices,
      [current.category]: selected
    });

    if (currentRound < BATTLE_CHOICES.length - 1) {
      setCurrentRound(currentRound + 1);
    } else {
      // Calculate results
      const results: ValueBattleResult = {};
      Object.values(choices).forEach(value => {
        results[value] = (results[value] || 0) + 1;
      });
      // Add final choice
      results[selected] = (results[selected] || 0) + 1;
      onComplete(results);
    }
  };

  const current = BATTLE_CHOICES[currentRound];
  const progress = ((currentRound + 1) / BATTLE_CHOICES.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            ラウンド {currentRound + 1} / {BATTLE_CHOICES.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Battle card */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            どっちを選ぶ？
          </h2>
          <p className="text-sm text-gray-500">{current.category}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleChoice('A')}
            className="w-full p-6 text-center bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all duration-200 group"
          >
            <div className="text-xl font-semibold text-gray-900 group-hover:text-blue-700">
              {current.optionA}
            </div>
          </button>

          <div className="text-center py-2">
            <span className="text-2xl font-bold text-gray-400">vs</span>
          </div>

          <button
            onClick={() => handleChoice('B')}
            className="w-full p-6 text-center bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl transition-all duration-200 group"
          >
            <div className="text-xl font-semibold text-gray-900 group-hover:text-purple-700">
              {current.optionB}
            </div>
          </button>
        </div>
      </div>

      {/* Instruction */}
      <div className="mt-6 text-center text-sm text-gray-500">
        直感で選んでOK。深く考えすぎないで！
      </div>
    </div>
  );
}
