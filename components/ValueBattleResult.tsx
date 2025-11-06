'use client';

import { ValueBattleResult } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  results: ValueBattleResult;
  onStartDialogue: () => void;
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
    const top3Categories = sortedResults.slice(0, 3).map(([v]) => v);

    // Pattern 1: 金銭 vs 非金銭
    const moneyRelated = ['年収800万・興味ない業界の大手企業', '年収1200万・週6勤務、休暇なし', '東京本社勤務・給与1.5倍', '年収1500万・社会貢献度低い', '営業成績で年収2000万可能・ノルマきつい'];
    const nonMoneyRelated = ['年収400万・憧れていた業界のベンチャー', '年収600万・週4勤務、長期休暇OK', '地元支社勤務・給与普通', '年収500万・社会問題の解決', '固定給700万・ノルマなし'];

    const moneyCount = Object.keys(results).filter(k => moneyRelated.includes(k)).length;
    const nonMoneyCount = Object.keys(results).filter(k => nonMoneyRelated.includes(k)).length;

    if (moneyCount > nonMoneyCount + 2) {
      insights.push('💰 **経済的安定を最重視するタイプ**：収入や待遇を優先する選択が多い。将来の不安を避けたい気持ちが強い。');
    } else if (nonMoneyCount > moneyCount + 2) {
      insights.push('❤️ **価値観・やりがい重視タイプ**：お金より大切なものがある。自分の心が動く方向を選んでいる。');
    } else {
      insights.push('⚖️ **バランス重視タイプ**：お金も大事だし、やりがいも欲しい。現実と理想の間で揺れている。');
    }

    // Pattern 2: 他者評価 vs 自分
    const othersApproval = ['親が喜ぶ公務員・毎日同じルーティン', '誰もが知る大企業の歯車として働く', '同窓会で自慢できる・実はつらい', '業界で有名になれる・激務'];
    const selfSatisfaction = ['親は反対・夢だったクリエイティブ職', '無名だが自分のアイデアが活きる会社', '同窓会で説明しにくい・実は楽しい', '誰も知らない・穏やか'];

    const othersCount = Object.keys(results).filter(k => othersApproval.includes(k)).length;
    const selfCount = Object.keys(results).filter(k => selfSatisfaction.includes(k)).length;

    if (othersCount > selfCount) {
      insights.push('👥 **他者の目を気にするタイプ**：親や周りからの評価が気になる。「どう見られるか」が選択基準になっている。');
    } else if (selfCount > othersCount) {
      insights.push('💪 **自分軸で生きるタイプ**：他人の評価より自分の満足。人からどう思われようと、自分が納得できる道を選ぶ。');
    }

    // Pattern 3: 安定 vs 挑戦
    const stability = ['確実に昇進・興味のない管理職コース', '福利厚生完備・やりがい薄い事務', '固定給700万・ノルマなし', '平凡な環境・ストレスなし'];
    const challenge = ['昇進不明・現場で技術を極める', '待遇微妙・毎日成長を感じる仕事', '営業成績で年収2000万可能・ノルマきつい', '優秀な同僚と切磋琢磨・競争激しい'];

    const stabilityCount = Object.keys(results).filter(k => stability.includes(k)).length;
    const challengeCount = Object.keys(results).filter(k => challenge.includes(k)).length;

    if (stabilityCount > challengeCount) {
      insights.push('🛡️ **リスク回避型**：確実性と安定性を求める。失敗や不確実性は避けたい。');
    } else if (challengeCount > stabilityCount) {
      insights.push('🚀 **挑戦志向型**：刺激と成長を求めている。安定より変化、安全より挑戦。');
    }

    // Pattern 4: Work-life balance
    const workFirst = ['役員候補・子どもの成長を見逃す', '海外駐在のチャンス・恋人と遠距離', '激務で有名・業界トップ企業', '転勤3年ごと・昇進早い'];
    const lifeFirst = ['昇進なし・子どもの毎日に寄り添える', '国内勤務・恋人と毎日会える', 'ホワイト企業・二流の位置づけ', '転勤なし・昇進遅い'];

    const workCount = Object.keys(results).filter(k => workFirst.includes(k)).length;
    const lifeCount = Object.keys(results).filter(k => lifeFirst.includes(k)).length;

    if (workCount > lifeCount + 1) {
      insights.push('💼 **仕事最優先タイプ**：キャリアのためなら私生活を犠牲にできる。今は仕事に集中したい時期。');
    } else if (lifeCount > workCount + 1) {
      insights.push('🏠 **プライベート重視タイプ**：家族や恋人、自分の時間を大切にしたい。仕事は人生の一部でしかない。');
    }

    // Pattern 5: チーム vs 個人
    const teamOriented = ['大プロジェクト・100人チームの一員', 'フルオフィス・濃密な人間関係'];
    const individualOriented = ['小規模・3人で全て担当', 'リモート完全在宅・人間関係希薄'];

    const teamCount = Object.keys(results).filter(k => teamOriented.includes(k)).length;
    const individualCount = Object.keys(results).filter(k => individualOriented.includes(k)).length;

    if (teamCount > individualCount) {
      insights.push('🤝 **チームプレイヤー**：人と一緒に働きたい。つながりや協力関係を大切にする。');
    } else if (individualCount > teamCount) {
      insights.push('🎯 **一匹狼タイプ**：一人で完結したい。人間関係より自由と裁量が欲しい。');
    }

    return insights.slice(0, 4); // 最大4つまで
  };

  const comprehensiveInsights = generateInsights();

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
                <p className="text-gray-800 leading-relaxed text-sm">
                  {insight.split('：')[0]}
                  <br />
                  <span className="text-gray-600">
                    {insight.split('：')[1]}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            でも、これって本当？
          </h3>
          <p className="text-gray-700 leading-relaxed">
            データから見えたあなたの傾向。
            <br />
            でも、これは選択の結果でしかない。
            <br />
            <br />
            <strong>「なぜそう選んだのか」</strong>を一緒に掘り下げてみよう。
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onStartDialogue}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
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
