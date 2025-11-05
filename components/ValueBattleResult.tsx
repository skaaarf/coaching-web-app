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
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out both;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
