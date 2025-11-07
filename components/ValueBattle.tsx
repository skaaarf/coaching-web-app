'use client';

import { useState } from 'react';
import { ValueBattleChoice, ValueBattleResult } from '@/types';

const BATTLE_CHOICES: ValueBattleChoice[] = [
  // キャリアの本質 (5問)
  { optionA: '年収800万・興味ない業界の大手企業', optionB: '年収400万・憧れていた業界のベンチャー', category: '安定 vs 情熱' },
  { optionA: '親が喜ぶ公務員・毎日同じルーティン', optionB: '親は反対・夢だったクリエイティブ職', category: '家族の期待 vs 自分の夢' },
  { optionA: '確実に昇進・興味のない管理職コース', optionB: '昇進不明・現場で技術を極める', category: '出世 vs 専門性' },
  { optionA: '誰もが知る大企業の歯車として働く', optionB: '無名だが自分のアイデアが活きる会社', category: 'ブランド vs やりがい' },
  { optionA: '福利厚生完備・やりがい薄い事務', optionB: '待遇微妙・毎日成長を感じる仕事', category: '待遇 vs 成長' },

  // ワークライフバランス (5問)
  { optionA: '年収1200万・週6勤務、休暇なし', optionB: '年収600万・週4勤務、長期休暇OK', category: '収入 vs 時間' },
  { optionA: '役員候補・子どもの成長を見逃す', optionB: '昇進なし・子どもの毎日に寄り添える', category: 'キャリア vs 子育て' },
  { optionA: '海外駐在のチャンス・恋人と遠距離', optionB: '国内勤務・恋人と毎日会える', category: 'チャンス vs 恋愛' },
  { optionA: '激務で有名・業界トップ企業', optionB: 'ホワイト企業・二流の位置づけ', category: 'ステータス vs ワークライフバランス' },
  { optionA: '憧れの職種・通勤2時間', optionB: '普通の職種・徒歩10分', category: '仕事内容 vs 通勤時間' },

  // 働き方と環境 (5問)
  { optionA: '大プロジェクト・100人チームの一員', optionB: '小規模・3人で全て担当', category: '組織規模 vs 影響力' },
  { optionA: '優秀な同僚と切磋琢磨・競争激しい', optionB: '平凡な環境・ストレスなし', category: '刺激 vs 穏やかさ' },
  { optionA: '東京本社勤務・給与1.5倍', optionB: '地元支社勤務・給与普通', category: '都会 vs 地元' },
  { optionA: '転勤3年ごと・昇進早い', optionB: '転勤なし・昇進遅い', category: 'キャリア vs 定住' },
  { optionA: 'リモート完全在宅・人間関係希薄', optionB: 'フルオフィス・濃密な人間関係', category: '自由 vs つながり' },

  // 価値観と報酬 (5問)
  { optionA: '年収1500万・社会貢献度低い', optionB: '年収500万・社会問題の解決', category: '収入 vs 社会貢献' },
  { optionA: 'ボーナス多い・達成感ない', optionB: 'ボーナスなし・誰かの笑顔が見える', category: '金銭報酬 vs やりがい' },
  { optionA: '営業成績で年収2000万可能・ノルマきつい', optionB: '固定給700万・ノルマなし', category: 'インセンティブ vs 固定給' },
  { optionA: '同窓会で自慢できる・実はつらい', optionB: '同窓会で説明しにくい・実は楽しい', category: '見栄 vs 本音' },
  { optionA: '業界で有名になれる・激務', optionB: '誰も知らない・穏やか', category: '名声 vs 平穏' }
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
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-900">
            ラウンド {currentRound + 1} / {BATTLE_CHOICES.length}
          </span>
          <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Battle card */}
      <div className="bg-white rounded-2xl border-2 border-gray-300 p-5 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            どっちを選ぶ？
          </h2>
          <p className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg inline-block">
            {current.category}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleChoice('A')}
            className="w-full p-5 text-left bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border-3 border-blue-300 hover:border-blue-500 active:border-blue-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:shadow-xl group touch-manipulation"
            type="button"
          >
            <div className="text-base font-bold text-gray-900 group-hover:text-blue-800 leading-relaxed">
              {current.optionA}
            </div>
          </button>

          <div className="text-center py-2">
            <span className="text-2xl font-bold text-gray-600 bg-white px-4 py-2 rounded-full border-2 border-gray-300 inline-block shadow-sm">vs</span>
          </div>

          <button
            onClick={() => handleChoice('B')}
            className="w-full p-5 text-left bg-purple-50 hover:bg-purple-100 active:bg-purple-200 border-3 border-purple-300 hover:border-purple-500 active:border-purple-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:shadow-xl group touch-manipulation"
            type="button"
          >
            <div className="text-base font-bold text-gray-900 group-hover:text-purple-800 leading-relaxed">
              {current.optionB}
            </div>
          </button>
        </div>
      </div>

      {/* Instruction */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-700 font-medium bg-yellow-50 border-2 border-yellow-200 px-4 py-3 rounded-lg inline-block">
          💡 直感で選んでOK。深く考えすぎないで！
        </p>
      </div>
    </div>
  );
}
