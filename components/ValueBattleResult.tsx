'use client';

import { ValueBattleResult } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  results: ValueBattleResult;
  onStartDialogue: (initialQuestion?: string) => void;
}

function ShareIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

export default function ValueBattleResultView({ results, onStartDialogue }: Props) {
  const router = useRouter();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sort results by count
  const sortedResults = Object.entries(results)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topValue = sortedResults[0];

  // Generate comprehensive insights based on selection patterns
  const generateInsights = () => {
    const insights: string[] = [];

    // Analyze top values
    const top3 = sortedResults.slice(0, 3).map(([v]) => v);

    // Pattern 1: 金銭 vs 非金銭
    const moneyRelated = [
      '年収750万・製造業の大手メーカー（残業少なめ）',
      '年収900万・月の残業60時間',
      '総合職（転勤あり・昇進早い・年収高い）',
      '海外赴任（3年・手当込み年収1.5倍）',
      'コンサル・外資系（年収高・激務）',
      '東京勤務（年収800万・物価高い）',
      '営業職（成果報酬・年収の幅大きい）',
      '金融・不動産（年収1200万・業務内容への共感薄）',
      'BtoB企業（顧客の顔見えない・給与高い）',
      '歩合制（実績次第で年収500-1500万）'
    ];
    const nonMoneyRelated = [
      '年収450万・ITスタートアップ（成長中・裁量大）',
      'Web制作会社（案件次第で忙しい・自由度高い）',
      'スペシャリスト職（現場で専門スキルを磨く）',
      '年収600万・月の残業10時間',
      '地域限定職（転勤なし・昇進遅い・年収普通）',
      '国内勤務（転勤なし・年収据え置き）',
      '地方都市勤務（年収550万・物価安い）',
      '教育・福祉（年収500万・社会的意義大きい）',
      'BtoC企業（顧客の反応直接・給与普通）',
      'ニッチ企業（周囲に説明しづらい・仕事は面白い）'
    ];

    const moneyCount = Object.keys(results).filter(k => moneyRelated.includes(k)).length;
    const nonMoneyCount = Object.keys(results).filter(k => nonMoneyRelated.includes(k)).length;

    if (moneyCount > nonMoneyCount + 2) {
      insights.push('💰 **経済的安定を最重視するタイプ**：収入や待遇の良さを優先する選択が目立ちます。経済基盤をしっかり築くことで、将来の選択肢を広げたいという考えが強いようです。お金があることで得られる安心感や自由を大切にしています。');
    } else if (nonMoneyCount > moneyCount + 2) {
      insights.push('❤️ **価値観・やりがい重視タイプ**：収入よりも仕事の内容や自己実現を優先する傾向が見られます。お金では買えない充実感や成長を求めており、自分が心から納得できる選択を重視しています。');
    } else {
      insights.push('⚖️ **バランス重視タイプ**：収入とやりがいの両方を大切にしたいという姿勢が見られます。極端な選択を避け、現実的な収入を確保しながらも、仕事の意義や満足度も諦めたくないという思いがあるようです。');
    }

    // Pattern 2: 安定性 vs 挑戦・成長
    const stability = [
      '年収750万・製造業の大手メーカー（残業少なめ）',
      '地方公務員（定時退社・転勤なし）',
      '大手銀行（年功序列・ルール厳格）',
      '上場企業（ネームバリュー有・手続き多い）',
      '地域限定職（転勤なし・昇進遅い・年収普通）',
      'マイペースな環境（和気あいあい・目標緩め）',
      '企画職（固定給・年収安定）',
      '固定給制（年収700万で安定）',
      '事業会社（年収普通・定時退社多い）'
    ];
    const challenge = [
      '年収450万・ITスタートアップ（成長中・裁量大）',
      'Web制作会社（案件次第で忙しい・自由度高い）',
      'IT企業（実力主義・カジュアルな文化）',
      'スペシャリスト職（現場で専門スキルを磨く）',
      'ハイレベルな環境（優秀な人材・高い目標）',
      'コンサル・外資系（年収高・激務）',
      '営業職（成果報酬・年収の幅大きい）',
      '歩合制（実績次第で年収500-1500万）',
      '業界トップ（認知度高・長時間労働）'
    ];

    const stabilityCount = Object.keys(results).filter(k => stability.includes(k)).length;
    const challengeCount = Object.keys(results).filter(k => challenge.includes(k)).length;

    if (stabilityCount > challengeCount + 1) {
      insights.push('🛡️ **安定性重視タイプ**：予測可能で確実性の高い環境を好む傾向があります。リスクを最小限に抑え、長期的に安心して働ける環境を求めています。急激な変化よりも、着実な積み重ねを大切にするタイプです。');
    } else if (challengeCount > stabilityCount + 1) {
      insights.push('🚀 **挑戦・成長志向タイプ**：刺激的な環境で自分を試したいという気持ちが強いようです。安定よりも成長機会を優先し、不確実性を恐れずに新しいことに挑戦できるタイプです。変化を楽しめる柔軟性があります。');
    }

    // Pattern 3: ワークライフバランス
    const workFocus = [
      '年収900万・月の残業60時間',
      '総合職（転勤あり・昇進早い・年収高い）',
      '海外赴任（3年・手当込み年収1.5倍）',
      'コンサル・外資系（年収高・激務）',
      '希望職種・片道1.5時間通勤',
      '業界トップ（認知度高・長時間労働）'
    ];
    const lifeFocus = [
      '年収600万・月の残業10時間',
      '地域限定職（転勤なし・昇進遅い・年収普通）',
      '国内勤務（転勤なし・年収据え置き）',
      '事業会社（年収普通・定時退社多い）',
      '希望外職種・片道20分通勤',
      '中堅企業（無名・定時退社）'
    ];

    const workCount = Object.keys(results).filter(k => workFocus.includes(k)).length;
    const lifeCount = Object.keys(results).filter(k => lifeFocus.includes(k)).length;

    if (workCount > lifeCount + 1) {
      insights.push('💼 **キャリア優先タイプ**：今はキャリア形成に注力したい時期のようです。プライベートの時間を犠牲にしてでも、仕事で成果を出すことや経験を積むことを優先する姿勢が見られます。');
    } else if (lifeCount > workCount + 1) {
      insights.push('🏠 **ワークライフバランス重視タイプ**：仕事は大切だけど、人生の全てではないという考えが強いようです。プライベートの時間や心の余裕を確保し、仕事以外の人生も大切にしたいという価値観が見られます。');
    }

    // Pattern 4: 組織規模・働き方
    const largeCorp = [
      '年収750万・製造業の大手メーカー（残業少なめ）',
      '上場企業（ネームバリュー有・手続き多い）',
      '大手銀行（年功序列・ルール厳格）',
      '100人規模プロジェクト（役割明確・分業制）',
      'オフィス出社（対面・チームで働く）'
    ];
    const smallAgile = [
      '年収450万・ITスタートアップ（成長中・裁量大）',
      '中小企業（知名度低・意思決定早い）',
      '5人チーム（企画から実装まで全部）',
      'フルリモート（在宅・全国どこでも）'
    ];

    const largeCount = Object.keys(results).filter(k => largeCorp.includes(k)).length;
    const smallCount = Object.keys(results).filter(k => smallAgile.includes(k)).length;

    if (largeCount > smallCount + 1) {
      insights.push('🏢 **大規模組織向きタイプ**：整った制度や明確な役割分担がある環境を好むようです。組織の一員として、確立されたシステムの中で力を発揮するタイプです。');
    } else if (smallCount > largeCount + 1) {
      insights.push('⚡ **小規模・機動力重視タイプ**：意思決定が早く、自分の裁量が大きい環境を好む傾向があります。幅広い業務に関わり、自分の影響を直接感じられる環境で働きたいという思いが強いようです。');
    }

    // Pattern 5: 外的評価 vs 内的満足
    const externalFocus = [
      '上場企業（ネームバリュー有・手続き多い）',
      '大手銀行（年功序列・ルール厳格）',
      '総合職（転勤あり・昇進早い・年収高い）',
      '有名企業（周囲に説明しやすい・仕事は退屈）',
      '業界トップ（認知度高・長時間労働）'
    ];
    const internalFocus = [
      'スペシャリスト職（現場で専門スキルを磨く）',
      'ニッチ企業（周囲に説明しづらい・仕事は面白い）',
      'BtoC企業（顧客の反応直接・給与普通）',
      '中堅企業（無名・定時退社）'
    ];

    const externalCount = Object.keys(results).filter(k => externalFocus.includes(k)).length;
    const internalCount = Object.keys(results).filter(k => internalFocus.includes(k)).length;

    if (externalCount > internalCount + 1) {
      insights.push('👔 **社会的評価を意識するタイプ**：企業の知名度や社会的地位を重視する傾向が見られます。周囲に説明しやすく、理解されやすい選択を好むようです。キャリアの「見え方」も大切にしています。');
    } else if (internalCount > externalCount + 1) {
      insights.push('✨ **内的満足を重視するタイプ**：周囲の評価よりも、自分自身の満足度や成長実感を優先する傾向があります。他人にどう見られるかよりも、自分が納得できるかどうかを判断基準にしています。');
    }

    return insights;
  };

  // Generate questions/contradictions to explore in dialogue
  const generateQuestions = () => {
    const questions: string[] = [];
    const allChoices = Object.keys(results);

    // Check for contradictions
    if (allChoices.includes('年収900万・月の残業60時間') &&
        allChoices.includes('年収600万・月の残業10時間')) {
      questions.push('「高収入だけど残業多い」と「収入低めだけど残業少ない」の両方を選んでいます。あなたにとって、お金と時間のどちらが本当に大切なのでしょうか？');
    }

    if (allChoices.includes('総合職（転勤あり・昇進早い・年収高い）') &&
        allChoices.includes('地域限定職（転勤なし・昇進遅い・年収普通）')) {
      questions.push('「転勤ありの総合職」と「転勤なしの地域限定職」の両方に魅力を感じています。キャリアアップと生活の安定、どちらを優先したいのでしょうか？');
    }

    if (allChoices.includes('上場企業（ネームバリュー有・手続き多い）') &&
        allChoices.includes('中小企業（知名度低・意思決定早い）')) {
      questions.push('大企業の安定感と中小企業のスピード感、両方を選んでいます。組織規模についてどう考えていますか？');
    }

    if (allChoices.includes('ハイレベルな環境（優秀な人材・高い目標）') &&
        allChoices.includes('マイペースな環境（和気あいあい・目標緩め）')) {
      questions.push('「ハイレベルな環境」と「マイペースな環境」の両方を選択しています。今のあなたにとって、成長とストレス管理のバランスをどう取りたいですか？');
    }

    // Check for strong patterns
    const moneyChoices = [
      '年収900万・月の残業60時間',
      '総合職（転勤あり・昇進早い・年収高い）',
      'コンサル・外資系（年収高・激務）'
    ].filter(c => allChoices.includes(c));

    if (moneyChoices.length >= 2) {
      questions.push('収入を重視する選択が多く見られますが、その背景には何がありますか？将来への不安、達成したい目標、守りたい人がいるなど、具体的な理由はありますか？');
    }

    const balanceChoices = [
      '年収600万・月の残業10時間',
      '地域限定職（転勤なし・昇進遅い・年収普通）',
      '中堅企業（無名・定時退社）'
    ].filter(c => allChoices.includes(c));

    if (balanceChoices.length >= 2) {
      questions.push('ワークライフバランスを重視する選択が目立ちます。プライベートの時間で何を大切にしたいですか？');
    }

    return questions.slice(0, 3); // 最大3つまで
  };

  const comprehensiveInsights = generateInsights();
  const explorationQuestions = generateQuestions();

  // Prepare data for pie chart
  const total = sortedResults.reduce((sum, [, count]) => sum + count, 0);
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Calculate pie chart segments
  let currentAngle = -90; // Start from top
  const pieSegments = sortedResults.map(([value, count], index) => {
    const percentage = (count / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate arc path
    const x1 = 50 + 45 * Math.cos(startRad);
    const y1 = 50 + 45 * Math.sin(startRad);
    const x2 = 50 + 45 * Math.cos(endRad);
    const y2 = 50 + 45 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const path = `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { value, count, percentage, path, color: colors[index] };
  });

  const handleShare = async () => {
    const shareText = `価値観バトルの結果！\n\n${sortedResults
      .map(([value, count], i) => `${i + 1}位: ${value} (${count}回選択)`)
      .join('\n')}\n\nみかたくんで自分の価値観を発見しよう`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '価値観バトルの結果',
          text: shareText
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
    setShowShareMenu(false);
  };

  const handleDownload = () => {
    const text = sortedResults
      .map(([value, count], i) => `${i + 1}位: ${value} (${count}回選択)`)
      .join('\n');
    const blob = new Blob([`価値観バトルの結果\n\n${text}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '価値観バトル結果.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowShareMenu(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg relative">
        {/* Share button */}
        <div className="absolute top-6 right-6">
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="共有"
            >
              <ShareIcon />
            </button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-fade-in">
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <ShareIcon />
                  <span className="ml-2">{copied ? 'コピーしました！' : '共有する'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <DownloadIcon />
                  <span className="ml-2">ダウンロード</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-in">🎯</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            あなたの価値観診断
          </h2>
          <p className="text-gray-600">
            20回の選択から見えてきたもの
          </p>
        </div>

        {/* Comprehensive Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 mb-6">
          <div className="flex items-start mb-4">
            <div className="text-3xl mr-3">🔍</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-xl">
                選択パターンから見えてきたあなた
              </h3>
              <p className="text-sm text-gray-600">
                単に「何を選んだか」だけじゃない。選択の組み合わせから、あなたの深層心理が見えてくる
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {comprehensiveInsights.map((insight, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="text-gray-800 leading-relaxed text-sm">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-0" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />
                    }}
                  >
                    {insight}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exploration Questions */}
        {explorationQuestions.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-6 mb-6">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-3">💭</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-xl">
                  一緒に考えたいこと
                </h3>
                <p className="text-sm text-gray-600">
                  気になる論点をタップして、対話を始めましょう
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {explorationQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    onStartDialogue(question);
                  }}
                  className="w-full bg-white rounded-xl p-4 border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200 text-left group active:scale-98"
                  type="button"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-amber-200 transition-colors">
                      <span className="text-sm font-bold text-amber-700">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm flex-grow group-hover:text-gray-900 transition-colors">
                      {question}
                    </p>
                    <div className="flex-shrink-0 ml-2 text-amber-400 group-hover:text-amber-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            ここからが本番
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            これらは20回の選択から見えてきた「あなたの傾向」です。
            <br />
            <br />
            でも、選択の結果だけでは見えないことがたくさんあります。
            <br />
            <br />
            💡 <strong>「なぜそう選んだのか」</strong>
            <br />
            💡 <strong>「本当に大切にしたいことは何か」</strong>
            <br />
            💡 <strong>「矛盾する選択の背景にある想い」</strong>
            <br />
            <br />
            対話を通じて、一緒に深く掘り下げていきましょう。
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => onStartDialogue()}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
            type="button"
          >
            対話を始める
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200"
          >
            ホームに戻る
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes spin-in {
          from {
            transform: rotate(-90deg) scale(0.8);
            opacity: 0;
          }
          to {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }
        @keyframes segment-appear {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out both;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        .animate-spin-in {
          animation: spin-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
