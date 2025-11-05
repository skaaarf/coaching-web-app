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
            あなたの価値観ランキング
          </h2>
          <p className="text-gray-600">
            20回の選択から見えてきたもの
          </p>
        </div>

        {/* Pie Chart */}
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-center font-semibold text-gray-900 mb-4">価値観の分布</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Chart */}
            <div className="relative">
              <svg viewBox="0 0 100 100" className="w-48 h-48 animate-spin-in">
                {pieSegments.map((segment, index) => (
                  <g key={segment.value}>
                    <path
                      d={segment.path}
                      fill={segment.color}
                      className="transition-opacity hover:opacity-80 cursor-pointer"
                      style={{
                        animation: `segment-appear 0.6s ease-out ${index * 0.1}s both`
                      }}
                    />
                  </g>
                ))}
                {/* Center circle for donut effect */}
                <circle cx="50" cy="50" r="20" fill="white" />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-gray-700"
                >
                  {total}
                </text>
                <text
                  x="50"
                  y="56"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[0.3rem] fill-gray-500"
                >
                  選択
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {pieSegments.map((segment, index) => (
                <div
                  key={segment.value}
                  className="flex items-center space-x-3 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: segment.color }}
                  />
                  <div className="flex-grow min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {segment.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {segment.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div className="space-y-4 mb-8">
          {sortedResults.map(([value, count], index) => (
            <div
              key={value}
              className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-lg rounded-full">
                {index + 1}
              </div>
              <div className="ml-4 flex-grow">
                <div className="font-semibold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500">
                  {count}回選択 ({Math.round((count / 20) * 100)}%)
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(count / 20) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Diagnostic Summary */}
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-[2px] animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                📊
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  診断結果サマリー
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <p className="text-gray-700">
                      <strong>最重視する価値観:</strong> {topValue[0]} ({topValue[1]}回選択)
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <p className="text-gray-700">
                      <strong>価値観タイプ:</strong> {
                        topValue[1] >= 15 ? '明確な価値観' :
                        topValue[1] >= 10 ? 'バランス型' : '多様な価値観'
                      }
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <p className="text-gray-700">
                      <strong>上位3つの価値観:</strong> {sortedResults.slice(0, 3).map(([v]) => v).join('、')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            あなたの傾向
          </h3>
          <p className="text-gray-700 leading-relaxed">
            あなたは「{topValue[0]}」を何より大切にしている。
            <br />
            でも、それってどうして？
            <br />
            一緒に考えてみよう。
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
