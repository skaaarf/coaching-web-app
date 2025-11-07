'use client';

import { useState } from 'react';
import { ValueBattleChoice, ValueBattleResult } from '@/types';

const BATTLE_CHOICES: ValueBattleChoice[] = [
  // キャリアの本質 (5問)
  {
    optionA: '年収750万・製造業の大手メーカー（残業少なめ）',
    optionB: '年収450万・ITスタートアップ（成長中・裁量大）',
    category: '安定 vs 成長環境',
    meritsA: ['安定した収入と雇用', '働きやすい環境', '長期的なキャリアパス'],
    demeritsA: ['変化が少ない', '意思決定が遅い', '新しいスキルが身につきにくい'],
    meritsB: ['急速な成長環境', '新しいスキルが身につく', '裁量権が大きい'],
    demeritsB: ['収入が低い', '将来の不確実性', '福利厚生が限定的']
  },
  {
    optionA: '地方公務員（定時退社・転勤なし）',
    optionB: 'Web制作会社（案件次第で忙しい・自由度高い）',
    category: '安定性 vs 自由度',
    meritsA: ['雇用が安定', '定時で帰れる', '地域に定住できる'],
    demeritsA: ['ルーティンワークが多い', '給与の伸びが緩やか', '仕事の裁量が限定的'],
    meritsB: ['クリエイティブな仕事', '多様な案件に関われる', '服装や働き方の自由'],
    demeritsB: ['繁忙期の残業', '収入の不安定さ', '雇用の保証が弱い']
  },
  {
    optionA: '管理職候補（会議・調整業務が中心）',
    optionB: 'スペシャリスト職（現場で専門スキルを磨く）',
    category: 'マネジメント vs 専門性',
    meritsA: ['年収が上がりやすい', 'チーム全体に影響を与えられる', '視野が広がる'],
    demeritsA: ['現場から離れる', '会議が多く時間が細切れ', '人間関係のストレス'],
    meritsB: ['専門スキルが深まる', '好きな仕事に集中できる', '技術的な達成感'],
    demeritsB: ['年収の上限が低め', '影響範囲が限定的', '市場価値が専門分野に依存']
  },
  {
    optionA: '上場企業（ネームバリュー有・手続き多い）',
    optionB: '中小企業（知名度低・意思決定早い）',
    category: '企業規模の選択',
    meritsA: ['社会的信用が高い', '福利厚生充実', '研修制度が整っている'],
    demeritsA: ['意思決定に時間がかかる', '自分の貢献が見えにくい', '承認プロセスが多い'],
    meritsB: ['意思決定が早い', '自分の影響が見える', '幅広い業務経験'],
    demeritsB: ['知名度が低い', '福利厚生が限定的', '研修制度が不十分']
  },
  {
    optionA: '大手銀行（年功序列・ルール厳格）',
    optionB: 'IT企業（実力主義・カジュアルな文化）',
    category: '組織文化の違い',
    meritsA: ['確実なキャリアパス', '手厚い福利厚生', '社会的地位が高い'],
    demeritsA: ['厳格なルール', '年功序列で若手の裁量小', '保守的な文化'],
    meritsB: ['実力で評価される', '自由な社風', '新しい技術に触れられる'],
    demeritsB: ['成果へのプレッシャー', '福利厚生が限定的', '雇用の安定性が低い']
  },

  // ワークライフバランス (5問)
  {
    optionA: '年収900万・月の残業60時間',
    optionB: '年収600万・月の残業10時間',
    category: '収入 vs 時間',
    meritsA: ['高収入', '経済的余裕', '将来の選択肢が広がる'],
    demeritsA: ['残業が多い', 'プライベートの時間が少ない', '疲労が蓄積'],
    meritsB: ['プライベートが充実', '趣味や勉強の時間', '心身の健康を保てる'],
    demeritsB: ['収入が低い', '貯蓄のペースが遅い', '経済的な制約']
  },
  {
    optionA: '総合職（転勤あり・昇進早い・年収高い）',
    optionB: '地域限定職（転勤なし・昇進遅い・年収普通）',
    category: 'キャリア vs 生活拠点',
    meritsA: ['昇進が早い', '年収が高い', '多様な経験ができる'],
    demeritsA: ['2-3年ごとに転勤', '家族への負担', '地域の人間関係が築けない'],
    meritsB: ['定住できる', '家族が安定', '地域コミュニティに参加できる'],
    demeritsB: ['昇進が遅い', '年収の伸びが限定的', '経験の幅が狭い']
  },
  {
    optionA: '海外赴任（3年・手当込み年収1.5倍）',
    optionB: '国内勤務（転勤なし・年収据え置き）',
    category: 'グローバル経験 vs 安定',
    meritsA: ['グローバル経験', '高収入', 'キャリアの選択肢が広がる'],
    demeritsA: ['3年間家族と離れる', '言語や文化の壁', '帰国後のポジション不確実'],
    meritsB: ['家族と一緒に暮らせる', '慣れた環境', '人間関係の継続'],
    demeritsB: ['年収が上がらない', 'グローバル経験なし', 'キャリアの幅が限定的']
  },
  {
    optionA: 'コンサル・外資系（年収高・激務）',
    optionB: '事業会社（年収普通・定時退社多い）',
    category: 'ハードワーク vs ワークライフバランス',
    meritsA: ['高年収', '急速なスキル向上', '市場価値が上がる'],
    demeritsA: ['長時間労働', '休日出勤あり', '心身への負担大'],
    meritsB: ['定時で帰れる日が多い', '心身の余裕', '趣味や家族との時間'],
    demeritsB: ['年収が低め', 'スキルアップのペースが遅い', '市場価値の伸びが緩やか']
  },
  {
    optionA: '希望職種・片道1.5時間通勤',
    optionB: '希望外職種・片道20分通勤',
    category: '仕事内容 vs 通勤時間',
    meritsA: ['やりたい仕事', '仕事の満足度が高い', 'モチベーション維持'],
    demeritsA: ['毎日3時間通勤', '疲労蓄積', '自由時間が減る'],
    meritsB: ['通勤が楽', '時間を有効活用', '生活の質が高い'],
    demeritsB: ['仕事への興味が低い', 'モチベーション維持が難しい', '長期的な不満']
  },

  // 働き方と環境 (5問)
  {
    optionA: '100人規模プロジェクト（役割明確・分業制）',
    optionB: '5人チーム（企画から実装まで全部）',
    category: '組織規模の違い',
    meritsA: ['大規模案件の経験', '専門性を深められる', '役割が明確'],
    demeritsA: ['自分の影響が見えにくい', '全体像が掴みにくい', '承認プロセスが多い'],
    meritsB: ['全体を把握できる', '幅広いスキルが身につく', '意思決定が早い'],
    demeritsB: ['案件規模が小さい', '専門性が浅くなりがち', '負担が大きい']
  },
  {
    optionA: 'ハイレベルな環境（優秀な人材・高い目標）',
    optionB: 'マイペースな環境（和気あいあい・目標緩め）',
    category: '成長環境の選択',
    meritsA: ['急速に成長できる', '高いレベルの知識・スキル', '刺激的'],
    demeritsA: ['常にプレッシャー', '比較されてストレス', '落ちこぼれる不安'],
    meritsB: ['ストレスが少ない', '自分のペースで働ける', '人間関係が良好'],
    demeritsB: ['成長スピードが遅い', '刺激が少ない', 'スキルの伸びが限定的']
  },
  {
    optionA: '東京勤務（年収800万・物価高い）',
    optionB: '地方都市勤務（年収550万・物価安い）',
    category: '勤務地の選択',
    meritsA: ['名目年収が高い', 'キャリアの選択肢が多い', '最新情報に触れやすい'],
    demeritsA: ['家賃・物価が高い', '通勤混雑', '実質的な余裕は少ない'],
    meritsB: ['生活費が安く余裕', '通勤が楽', 'ゆとりのある生活'],
    demeritsB: ['年収が低い', '転職の選択肢が少ない', '最新トレンドから遅れる']
  },
  {
    optionA: '営業職（成果報酬・年収の幅大きい）',
    optionB: '企画職（固定給・年収安定）',
    category: '評価制度の違い',
    meritsA: ['成果次第で高収入', 'モチベーション維持', '達成感'],
    demeritsA: ['成果が出ないと収入減', 'プレッシャーが大きい', '安定性がない'],
    meritsB: ['収入が安定', '生活設計しやすい', 'プレッシャーが少ない'],
    demeritsB: ['頑張っても収入変わらず', 'モチベーション維持が難しい', '収入の上限が低い']
  },
  {
    optionA: 'フルリモート（在宅・全国どこでも）',
    optionB: 'オフィス出社（対面・チームで働く）',
    category: '働く場所の選択',
    meritsA: ['通勤不要', '居住地自由', '時間の柔軟性'],
    demeritsA: ['孤独感', 'オンオフの切り替え難しい', '雑談から学ぶ機会減'],
    meritsB: ['対面で相談しやすい', 'チームの一体感', 'オンオフ明確'],
    demeritsB: ['通勤時間のロス', '居住地の制約', '感染症リスク']
  },

  // 価値観と報酬 (5問)
  {
    optionA: '金融・不動産（年収1200万・業務内容への共感薄）',
    optionB: '教育・福祉（年収500万・社会的意義大きい）',
    category: '収入 vs 社会貢献',
    meritsA: ['高収入', '経済的余裕', '将来の選択肢が広がる'],
    demeritsA: ['仕事への共感が薄い', '意義を感じにくい', '長期的なモチベーション維持が難しい'],
    meritsB: ['社会貢献を実感', '仕事への誇り', '長期的なやりがい'],
    demeritsB: ['収入が低い', '経済的な制約', '貯蓄ペースが遅い']
  },
  {
    optionA: 'BtoB企業（顧客の顔見えない・給与高い）',
    optionB: 'BtoC企業（顧客の反応直接・給与普通）',
    category: '報酬 vs 顧客との距離',
    meritsA: ['給与が高い', '大規模案件に関われる', 'クレーム対応が少ない'],
    demeritsA: ['顧客の顔が見えない', '成果の実感が薄い', 'やりがいを感じにくい'],
    meritsB: ['顧客の反応が直接分かる', 'やりがいを実感', '感謝の言葉がもらえる'],
    demeritsB: ['給与が低め', 'クレーム対応あり', '感情労働が多い']
  },
  {
    optionA: '歩合制（実績次第で年収500-1500万）',
    optionB: '固定給制（年収700万で安定）',
    category: 'リスク vs 安定',
    meritsA: ['成功すれば高収入', '頑張りが報われる', 'モチベーション維持'],
    demeritsA: ['収入が不安定', '生活設計が難しい', '精神的プレッシャー'],
    meritsB: ['収入が安定', '生活設計しやすい', '精神的に楽'],
    demeritsB: ['収入の上限が決まっている', '頑張っても報酬変わらず', '物足りなさを感じる']
  },
  {
    optionA: '有名企業（周囲に説明しやすい・仕事は退屈）',
    optionB: 'ニッチ企業（周囲に説明しづらい・仕事は面白い）',
    category: '外的評価 vs 内的満足',
    meritsA: ['周囲に誇れる', '社会的信用が高い', '説明が楽'],
    demeritsA: ['仕事が退屈', '日々の満足度が低い', '長期的な不満'],
    meritsB: ['仕事が面白い', '日々の満足度が高い', '成長実感'],
    demeritsB: ['周囲に理解されにくい', '説明が面倒', '社会的評価が得にくい']
  },
  {
    optionA: '業界トップ（認知度高・長時間労働）',
    optionB: '中堅企業（無名・定時退社）',
    category: 'ブランド vs ワークライフバランス',
    meritsA: ['業界トップの経験', '専門性が高まる', 'キャリアの選択肢が広がる'],
    demeritsA: ['長時間労働', '心身の負担', 'プライベートの時間が少ない'],
    meritsB: ['定時で帰れる', '心身の余裕', 'プライベート充実'],
    demeritsB: ['知名度が低い', '転職時の訴求力が弱い', 'スキルアップのペースが遅い']
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
