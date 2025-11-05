'use client';

import { useRouter } from 'next/navigation';

interface Props {
  selections: Record<string, string[]>;
  onStartDialogue: () => void;
}

export default function LifeSimulatorResult({ selections, onStartDialogue }: Props) {
  const router = useRouter();

  // Count all selected aspects
  const aspectCounts: Record<string, number> = {};
  Object.values(selections).forEach(aspects => {
    aspects.forEach(aspect => {
      aspectCounts[aspect] = (aspectCounts[aspect] || 0) + 1;
    });
  });

  // Sort by count
  const sortedAspects = Object.entries(aspectCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Find which path was most selected
  const pathCounts = {
    A: selections.A?.length || 0,
    B: selections.B?.length || 0,
    C: selections.C?.length || 0
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            あなたが惹かれたポイント
          </h2>
          <p className="text-gray-600">
            3つの人生から見えてきたこと
          </p>
        </div>

        {/* Bar Chart */}
        <div className="mb-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-center font-semibold text-gray-900 mb-6">惹かれたポイントTop5</h3>
          <div className="flex items-end justify-between h-48 gap-3">
            {sortedAspects.map(([aspect, count], index) => {
              const maxCount = sortedAspects[0][1];
              const heightPercent = (count / maxCount) * 100;
              const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-green-500'];

              return (
                <div key={aspect} className="flex-1 flex flex-col items-center">
                  {/* Bar */}
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <div className="text-sm font-bold text-gray-700 mb-2">
                      {count}回
                    </div>
                    <div
                      className={`w-full ${colors[index]} rounded-t-lg transition-all duration-700 ease-out`}
                      style={{
                        height: `${heightPercent}%`,
                        animation: `bar-grow 0.8s ease-out ${index * 0.1}s both`
                      }}
                    />
                  </div>
                  {/* Label */}
                  <div className="mt-3 text-xs text-center font-medium text-gray-700 line-clamp-2 w-full">
                    {aspect}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most selected aspects */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-4">詳細:</h3>
          <div className="space-y-3">
            {sortedAspects.map(([aspect, count], index) => (
              <div
                key={aspect}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-semibold text-gray-900">{aspect}</span>
                <span className="text-blue-600 font-bold">({count}回)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Path preference */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">選択の分布:</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">Aの人生:</span>
              <div className="flex-grow h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(pathCounts.A / 9) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm text-gray-600 ml-2">
                {pathCounts.A}個
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">Bの人生:</span>
              <div className="flex-grow h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${(pathCounts.B / 9) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm text-gray-600 ml-2">
                {pathCounts.B}個
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm font-medium">Cの人生:</span>
              <div className="flex-grow h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(pathCounts.C / 9) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm text-gray-600 ml-2">
                {pathCounts.C}個
              </span>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            あなたの傾向
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {sortedAspects.length > 0 && (
              <>
                あなたは「{sortedAspects[0][0]}」や「{sortedAspects[1]?.[0] || 'その他の要素'}」を
                大切にしているみたい。
                <br />
                <br />
                {pathCounts.A === Math.max(pathCounts.A, pathCounts.B, pathCounts.C)
                  ? 'Aの人生の「安定」には全く惹かれなかったね。'
                  : 'でも、選ばなかった要素もある。'}
                <br />
                それって、本当にいらないの？
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onStartDialogue}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            この違和感について話す
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
        @keyframes bar-grow {
          from {
            height: 0%;
          }
          to {
            height: var(--final-height);
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
        .animate-slide-in {
          animation: slide-in 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
}
