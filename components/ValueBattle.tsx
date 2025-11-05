'use client';

import { useState } from 'react';
import { ValueBattleChoice, ValueBattleResult } from '@/types';

const BATTLE_CHOICES: ValueBattleChoice[] = [
  // Career stability vs passion (7 choices)
  { optionA: '年収800万・興味ない業界の大手企業', optionB: '年収400万・憧れていた業界のベンチャー', category: '安定 vs 情熱' },
  { optionA: '誰もが知る大企業の歯車として働く', optionB: '無名だが自分のアイデアが活きる会社', category: 'ブランド vs やりがい' },
  { optionA: '終身雇用保証・単調な業務', optionB: '成果主義・刺激的だが不安定', category: '安定 vs 刺激' },
  { optionA: '親が喜ぶ公務員・毎日同じルーティン', optionB: '親は反対・夢だったクリエイティブ職', category: '家族の期待 vs 自分の夢' },
  { optionA: '確実に昇進・興味のない管理職コース', optionB: '昇進不明・現場で技術を極める', category: '出世 vs 専門性' },
  { optionA: '福利厚生完備・やりがい薄い事務', optionB: '待遇微妙・毎日成長を感じる仕事', category: '待遇 vs 成長' },
  { optionA: '倒産リスクゼロ・つまらない仕事', optionB: '倒産リスクあり・ワクワクする仕事', category: '安全 vs ワクワク' },

  // Work-life balance vs career (7 choices)
  { optionA: '年収1200万・週6勤務、休暇なし', optionB: '年収600万・週4勤務、長期休暇OK', category: '収入 vs 時間' },
  { optionA: 'キャリアアップ確実・家族との時間なし', optionB: '平社員のまま・毎日18時退社', category: '出世 vs 家族時間' },
  { optionA: '役員候補・子どもの成長を見逃す', optionB: '昇進なし・子どもの毎日に寄り添える', category: 'キャリア vs 子育て' },
  { optionA: '海外駐在のチャンス・恋人と遠距離', optionB: '国内勤務・恋人と毎日会える', category: 'チャンス vs 恋愛' },
  { optionA: 'プロジェクトリーダー・休日も仕事', optionB: 'メンバー・完全週休2日', category: '責任 vs プライベート' },
  { optionA: '激務で有名・業界トップ企業', optionB: 'ホワイト企業・二流の位置づけ', category: 'ステータス vs ワークライフバランス' },
  { optionA: '憧れの職種・通勤2時間', optionB: '普通の職種・徒歩10分', category: '仕事内容 vs 通勤時間' },

  // Team vs individual (5 choices)
  { optionA: '大プロジェクト・100人チームの一員', optionB: '小規模・3人で全て担当', category: '組織規模 vs 影響力' },
  { optionA: 'チームワーク重視・自分の意見通りにくい', optionB: '一人で完結・全責任を負う', category: 'チーム vs 個人' },
  { optionA: '優秀な同僚と切磋琢磨・競争激しい', optionB: '平凡な環境・ストレスなし', category: '刺激 vs 穏やかさ' },
  { optionA: 'リモート完全在宅・人間関係希薄', optionB: 'フルオフィス・濃密な人間関係', category: '自由 vs つながり' },
  { optionA: '意見を言いやすい・給与低い', optionB: '上下関係厳しい・給与高い', category: '風通し vs 待遇' },

  // Location & lifestyle (6 choices)
  { optionA: '東京本社勤務・給与1.5倍', optionB: '地元支社勤務・給与普通', category: '都会 vs 地元' },
  { optionA: '海外転勤あり・グローバルキャリア', optionB: '転勤なし・地域に根ざす', category: '国際 vs 地域密着' },
  { optionA: '都心オフィス・満員電車1時間', optionB: '郊外オフィス・車で快適通勤', category: '都心立地 vs 通勤快適' },
  { optionA: '出張多い・全国を飛び回る', optionB: '出張なし・同じ場所で深める', category: '変化 vs 安定' },
  { optionA: '転勤3年ごと・昇進早い', optionB: '転勤なし・昇進遅い', category: 'キャリア vs 定住' },
  { optionA: '都会の刺激・狭い部屋', optionB: '田舎の静けさ・広い家', category: '刺激 vs ゆとり' },

  // Skill development (5 choices)
  { optionA: '最先端技術・常に勉強必須', optionB: '枯れた技術・安定運用', category: '最新 vs 安定技術' },
  { optionA: 'ゼネラリスト育成・浅く広く', optionB: 'スペシャリスト育成・狭く深く', category: '幅広さ vs 専門性' },
  { optionA: '若手から裁量大・失敗も多い', optionB: '先輩の指示通り・ミスなし', category: '裁量 vs 安全' },
  { optionA: '資格取得支援充実・勉強時間拘束', optionB: '資格支援なし・自由な時間', category: '成長支援 vs 時間自由' },
  { optionA: '研修豊富・3年間は雑用', optionB: '研修なし・即戦力として活躍', category: '育成 vs 即戦力' },

  // Financial vs meaning (7 choices)
  { optionA: '年収1500万・社会貢献度低い', optionB: '年収500万・社会問題の解決', category: '収入 vs 社会貢献' },
  { optionA: 'ボーナス多い・達成感ない', optionB: 'ボーナスなし・誰かの笑顔が見える', category: '金銭報酬 vs やりがい' },
  { optionA: '高給・環境に悪い事業', optionB: '低給・環境保護の事業', category: '収入 vs 価値観' },
  { optionA: 'ストックオプション・大金の可能性', optionB: '安定給与・確実な生活', category: 'ハイリスクハイリターン vs 安定' },
  { optionA: '営業成績で年収2000万可能・ノルマきつい', optionB: '固定給700万・ノルマなし', category: 'インセンティブ vs 固定給' },
  { optionA: '副業OK・本業は給与低い', optionB: '副業禁止・本業は高給', category: '副業自由 vs 高給' },
  { optionA: '投資・運用で将来不安なし', optionB: 'やりたいこと・金銭面は不安', category: '経済的安定 vs 情熱' },

  // Status & recognition (5 choices)
  { optionA: '誰もが知る有名企業・歯車', optionB: '無名企業・社長から評価', category: '知名度 vs 評価' },
  { optionA: '肩書きは立派・実務は雑用', optionB: '肩書きなし・重要な仕事', category: '肩書き vs 仕事内容' },
  { optionA: '同窓会で自慢できる・実はつらい', optionB: '同窓会で説明しにくい・実は楽しい', category: '見栄 vs 本音' },
  { optionA: '親戚に誇れる・自分は不満', optionB: '親戚は理解不能・自分は大満足', category: '他者評価 vs 自己満足' },
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
