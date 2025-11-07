'use client';

import { useState } from 'react';
import { ValueBattleChoice, ValueBattleResult } from '@/types';

const BATTLE_CHOICES: ValueBattleChoice[] = [
  // キャリアの本質 (5問)
  {
    optionA: '年収800万・興味ない業界の大手企業',
    optionB: '年収400万・憧れていた業界のベンチャー',
    category: '安定 vs 情熱',
    meritsA: ['経済的に余裕がある', '社会的信用が高い', '福利厚生が充実'],
    demeritsA: ['仕事への情熱が持てない', 'モチベーション維持が難しい', '毎日が退屈に感じる可能性'],
    meritsB: ['好きな仕事で働ける', '成長実感がある', '毎日が充実'],
    demeritsB: ['経済的に厳しい', '将来の不安がある', '生活水準を落とす必要']
  },
  {
    optionA: '親が喜ぶ公務員・毎日同じルーティン',
    optionB: '親は反対・夢だったクリエイティブ職',
    category: '家族の期待 vs 自分の夢',
    meritsA: ['家族との関係が良好', '安定した生活', '周囲の理解を得やすい'],
    demeritsA: ['自分の夢を諦める', '後悔する可能性', '単調な日々'],
    meritsB: ['自分の夢を追える', '情熱を持って働ける', '後悔しない人生'],
    demeritsB: ['親との関係悪化の可能性', '理解されない辛さ', '孤独を感じるかも']
  },
  {
    optionA: '確実に昇進・興味のない管理職コース',
    optionB: '昇進不明・現場で技術を極める',
    category: '出世 vs 専門性',
    meritsA: ['収入が増える', '社会的地位が上がる', '影響力が大きくなる'],
    demeritsA: ['やりたくない仕事', 'スキルが活かせない', 'ストレスが大きい'],
    meritsB: ['好きな技術を極められる', '専門家として認められる', '仕事の満足度が高い'],
    demeritsB: ['収入の伸びが限定的', '責任範囲が狭い', '昇進できない']
  },
  {
    optionA: '誰もが知る大企業の歯車として働く',
    optionB: '無名だが自分のアイデアが活きる会社',
    category: 'ブランド vs やりがい',
    meritsA: ['社名で信用される', '同窓会で自慢できる', '親が喜ぶ'],
    demeritsA: ['個性が埋もれる', '自分の影響が見えない', '達成感が薄い'],
    meritsB: ['自分のアイデアが形になる', '影響力が大きい', '達成感がある'],
    demeritsB: ['周囲に説明しづらい', '社会的評価が低い', '不安定かもしれない']
  },
  {
    optionA: '福利厚生完備・やりがい薄い事務',
    optionB: '待遇微妙・毎日成長を感じる仕事',
    category: '待遇 vs 成長',
    meritsA: ['健康保険や年金が充実', '休暇が取りやすい', '安心して働ける'],
    demeritsA: ['スキルが身につかない', '将来性が低い', '刺激がない'],
    meritsB: ['スキルアップできる', 'キャリアの選択肢が広がる', '自己成長を実感'],
    demeritsB: ['待遇が悪い', '福利厚生が不十分', '経済的な不安']
  },

  // ワークライフバランス (5問)
  {
    optionA: '年収1200万・週6勤務、休暇なし',
    optionB: '年収600万・週4勤務、長期休暇OK',
    category: '収入 vs 時間',
    meritsA: ['高収入で生活が豊か', '経済的自由', '貯蓄や投資の余裕'],
    demeritsA: ['プライベートの時間がない', '心身の健康リスク', '人間関係が希薄になる'],
    meritsB: ['プライベートが充実', '心身の健康を保てる', '趣味や家族との時間'],
    demeritsB: ['収入が半分', '経済的な制約', '将来への不安']
  },
  {
    optionA: '役員候補・子どもの成長を見逃す',
    optionB: '昇進なし・子どもの毎日に寄り添える',
    category: 'キャリア vs 子育て',
    meritsA: ['高い地位と収入', '会社での影響力', 'キャリアの成功'],
    demeritsA: ['子どもとの思い出が少ない', '家族との時間がない', '後で後悔するかも'],
    meritsB: ['子どもの成長を見守れる', '家族の絆が深まる', '人生の充実感'],
    demeritsB: ['キャリアが停滞', '収入が上がらない', '社会的評価が低い']
  },
  {
    optionA: '海外駐在のチャンス・恋人と遠距離',
    optionB: '国内勤務・恋人と毎日会える',
    category: 'チャンス vs 恋愛',
    meritsA: ['グローバルな経験', 'キャリアアップ', '視野が広がる'],
    demeritsA: ['恋人と離れる辛さ', '関係が壊れるリスク', '孤独感'],
    meritsB: ['恋人との関係を深められる', '安心感がある', '精神的に安定'],
    demeritsB: ['チャンスを逃す', 'キャリアの選択肢が狭まる', '後悔するかも']
  },
  {
    optionA: '激務で有名・業界トップ企業',
    optionB: 'ホワイト企業・二流の位置づけ',
    category: 'ステータス vs ワークライフバランス',
    meritsA: ['業界最高峰の経験', '社会的ステータス', '高い専門性が身につく'],
    demeritsA: ['過労のリスク', 'ストレスが大きい', '健康を害する可能性'],
    meritsB: ['健康的に働ける', 'ストレスが少ない', '長く続けられる'],
    demeritsB: ['社会的評価が低い', 'スキルアップが限定的', 'キャリアの天井が低い']
  },
  {
    optionA: '憧れの職種・通勤2時間',
    optionB: '普通の職種・徒歩10分',
    category: '仕事内容 vs 通勤時間',
    meritsA: ['やりたい仕事ができる', '仕事の満足度が高い', '夢を叶えられる'],
    demeritsA: ['通勤で疲弊', '1日4時間のロス', '生活の質が下がる'],
    meritsB: ['通勤が楽', '時間を有効活用', '生活の質が高い'],
    demeritsB: ['仕事への情熱が持てない', '不満が溜まる', 'やりがいが薄い']
  },

  // 働き方と環境 (5問)
  {
    optionA: '大プロジェクト・100人チームの一員',
    optionB: '小規模・3人で全て担当',
    category: '組織規模 vs 影響力',
    meritsA: ['大規模プロジェクトに関われる', '多様な人と働ける', 'ネットワークが広がる'],
    demeritsA: ['自分の貢献が見えにくい', '責任範囲が狭い', '歯車感がある'],
    meritsB: ['全体を把握できる', '自分の影響が明確', '達成感が大きい'],
    demeritsB: ['プロジェクト規模が小さい', '経験の幅が限定的', 'ネットワークが狭い']
  },
  {
    optionA: '優秀な同僚と切磋琢磨・競争激しい',
    optionB: '平凡な環境・ストレスなし',
    category: '刺激 vs 穏やかさ',
    meritsA: ['刺激的な環境', 'スキルが向上', '高いレベルで成長'],
    demeritsA: ['常にプレッシャー', '精神的な負担', '落ち着けない'],
    meritsB: ['ストレスフリー', '精神的に楽', '穏やかに働ける'],
    demeritsB: ['成長が遅い', '刺激がない', 'モチベーションが下がる']
  },
  {
    optionA: '東京本社勤務・給与1.5倍',
    optionB: '地元支社勤務・給与普通',
    category: '都会 vs 地元',
    meritsA: ['高収入', '都会の利便性', 'キャリアの選択肢が多い'],
    demeritsA: ['生活費が高い', '住み慣れた環境を離れる', '家族や友人と離れる'],
    meritsB: ['住み慣れた環境', '家族や友人が近い', '生活費が安い'],
    demeritsB: ['収入が低い', 'キャリアの選択肢が限定的', '刺激が少ない']
  },
  {
    optionA: '転勤3年ごと・昇進早い',
    optionB: '転勤なし・昇進遅い',
    category: 'キャリア vs 定住',
    meritsA: ['早く出世できる', '多様な経験', '視野が広がる'],
    demeritsA: ['定住できない', '人間関係がリセット', '家族への負担'],
    meritsB: ['安定した生活', '地域に根付ける', '友人関係が続く'],
    demeritsB: ['昇進が遅い', '経験の幅が狭い', 'キャリアの停滞']
  },
  {
    optionA: 'リモート完全在宅・人間関係希薄',
    optionB: 'フルオフィス・濃密な人間関係',
    category: '自由 vs つながり',
    meritsA: ['通勤不要', '時間の自由', '自分のペースで働ける'],
    demeritsA: ['孤独感', '相談しにくい', 'チームとの一体感がない'],
    meritsB: ['仲間との絆', 'コミュニケーションが取りやすい', '帰属意識が高い'],
    demeritsB: ['通勤時間のロス', '自由度が低い', 'プライベートの時間が減る']
  },

  // 価値観と報酬 (5問)
  {
    optionA: '年収1500万・社会貢献度低い',
    optionB: '年収500万・社会問題の解決',
    category: '収入 vs 社会貢献',
    meritsA: ['非常に高収入', '経済的自由', '裕福な生活'],
    demeritsA: ['社会への意義を感じない', '虚しさを感じる', '誇りを持てない'],
    meritsB: ['社会に貢献できる', '誇りを持って働ける', '意義のある仕事'],
    demeritsB: ['収入が低い', '経済的に厳しい', '生活が苦しい']
  },
  {
    optionA: 'ボーナス多い・達成感ない',
    optionB: 'ボーナスなし・誰かの笑顔が見える',
    category: '金銭報酬 vs やりがい',
    meritsA: ['ボーナスで潤う', '物質的な豊かさ', '経済的余裕'],
    demeritsA: ['仕事の意味を感じない', 'モチベーションが上がらない', '虚無感'],
    meritsB: ['感謝される喜び', '仕事の意義を実感', '心の充実'],
    demeritsB: ['収入が低い', '経済的な不安', 'ボーナスがない']
  },
  {
    optionA: '営業成績で年収2000万可能・ノルマきつい',
    optionB: '固定給700万・ノルマなし',
    category: 'インセンティブ vs 固定給',
    meritsA: ['成功すれば超高収入', '頑張りが報われる', '達成感がある'],
    demeritsA: ['常にプレッシャー', '収入が不安定', '精神的に辛い'],
    meritsB: ['安定した収入', 'プレッシャーなし', '精神的に楽'],
    demeritsB: ['収入の上限が低い', '頑張っても報酬が変わらない', 'モチベーションが上がりにくい']
  },
  {
    optionA: '同窓会で自慢できる・実はつらい',
    optionB: '同窓会で説明しにくい・実は楽しい',
    category: '見栄 vs 本音',
    meritsA: ['周囲に誇れる', '社会的評価が高い', '親が喜ぶ'],
    demeritsA: ['毎日が辛い', '本当の自分を偽る', '幸せを感じない'],
    meritsB: ['毎日が楽しい', '自分らしく生きられる', '幸福度が高い'],
    demeritsB: ['周囲に理解されない', '説明が面倒', '社会的評価が低い']
  },
  {
    optionA: '業界で有名になれる・激務',
    optionB: '誰も知らない・穏やか',
    category: '名声 vs 平穏',
    meritsA: ['業界での知名度', '専門家として認められる', 'キャリアの選択肢が広がる'],
    demeritsA: ['激務で疲弊', '健康リスク', 'プライベートがない'],
    meritsB: ['健康的な生活', 'ストレスフリー', '心の平穏'],
    demeritsB: ['無名のまま', 'キャリアの選択肢が狭い', '達成感が薄い']
  }
];

interface Props {
  onComplete: (results: ValueBattleResult) => void;
}

// Define sections for better progress tracking
const SECTIONS = [
  { name: 'キャリアの本質', start: 0, end: 4, icon: '💼', color: 'blue' },
  { name: 'ワークライフバランス', start: 5, end: 9, icon: '⚖️', color: 'green' },
  { name: '働き方と環境', start: 10, end: 14, icon: '🏢', color: 'purple' },
  { name: '価値観と報酬', start: 15, end: 19, icon: '💎', color: 'orange' }
];

export default function ValueBattle({ onComplete }: Props) {
  const [currentRound, setCurrentRound] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [showMilestone, setShowMilestone] = useState(false);

  const handleChoice = (choice: 'A' | 'B') => {
    const current = BATTLE_CHOICES[currentRound];
    const selected = choice === 'A' ? current.optionA : current.optionB;

    setChoices({
      ...choices,
      [current.category]: selected
    });

    // Check for milestones
    const nextRound = currentRound + 1;
    if (nextRound === 10) {
      // Halfway point
      setShowMilestone(true);
      setTimeout(() => {
        setShowMilestone(false);
        setCurrentRound(nextRound);
      }, 2000);
      return;
    }

    if (currentRound < BATTLE_CHOICES.length - 1) {
      setCurrentRound(nextRound);
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
  const currentSection = SECTIONS.find(s => currentRound >= s.start && currentRound <= s.end)!;
  const sectionProgress = currentRound - currentSection.start + 1;

  // Show milestone celebration
  if (showMilestone) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300 p-8 shadow-lg text-center animate-pulse">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            半分完了！
          </h2>
          <p className="text-base text-gray-700 font-medium">
            あと10問です。もう少し頑張りましょう！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Section Progress Indicators */}
      <div className="mb-4">
        <div className="flex justify-center gap-2 mb-3">
          {SECTIONS.map((section, index) => {
            const isCompleted = currentRound > section.end;
            const isCurrent = currentRound >= section.start && currentRound <= section.end;
            return (
              <div
                key={section.name}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' :
                  isCurrent ? 'bg-blue-500' :
                  'bg-gray-200'
                }`}
              />
            );
          })}
        </div>
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-gray-300 shadow-sm">
            <span className="text-xl">{currentSection.icon}</span>
            <span className="text-sm font-bold text-gray-900">{currentSection.name}</span>
            <span className="text-xs font-semibold text-gray-600">
              ({sectionProgress}/5)
            </span>
          </div>
        </div>
      </div>

      {/* Overall Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-gray-700">
            全体の進捗
          </span>
          <span className="text-xs font-bold text-blue-600">{currentRound + 1} / 20</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
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
            <div className="text-base font-bold text-gray-900 group-hover:text-blue-800 leading-relaxed mb-3">
              {current.optionA}
            </div>
            {current.meritsA && current.meritsA.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="text-xs font-semibold text-green-700 mb-1.5">✓ メリット</div>
                <ul className="text-xs text-gray-700 space-y-1">
                  {current.meritsA.map((merit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-1.5 text-green-600">•</span>
                      <span>{merit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {current.demeritsA && current.demeritsA.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-semibold text-red-700 mb-1.5">✗ デメリット</div>
                <ul className="text-xs text-gray-700 space-y-1">
                  {current.demeritsA.map((demerit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-1.5 text-red-600">•</span>
                      <span>{demerit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </button>

          <div className="text-center py-2">
            <span className="text-2xl font-bold text-gray-600 bg-white px-4 py-2 rounded-full border-2 border-gray-300 inline-block shadow-sm">vs</span>
          </div>

          <button
            onClick={() => handleChoice('B')}
            className="w-full p-5 text-left bg-purple-50 hover:bg-purple-100 active:bg-purple-200 border-3 border-purple-300 hover:border-purple-500 active:border-purple-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:shadow-xl group touch-manipulation"
            type="button"
          >
            <div className="text-base font-bold text-gray-900 group-hover:text-purple-800 leading-relaxed mb-3">
              {current.optionB}
            </div>
            {current.meritsB && current.meritsB.length > 0 && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <div className="text-xs font-semibold text-green-700 mb-1.5">✓ メリット</div>
                <ul className="text-xs text-gray-700 space-y-1">
                  {current.meritsB.map((merit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-1.5 text-green-600">•</span>
                      <span>{merit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {current.demeritsB && current.demeritsB.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-semibold text-red-700 mb-1.5">✗ デメリット</div>
                <ul className="text-xs text-gray-700 space-y-1">
                  {current.demeritsB.map((demerit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-1.5 text-red-600">•</span>
                      <span>{demerit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
