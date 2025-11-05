'use client';

import { ValueBattleResult } from '@/types';
import { useRouter } from 'next/navigation';

interface Props {
  results: ValueBattleResult;
  onStartDialogue: () => void;
}

export default function ValueBattleResultView({ results, onStartDialogue }: Props) {
  const router = useRouter();

  // Sort results by count
  const sortedResults = Object.entries(results)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topValue = sortedResults[0];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
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
              className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200"
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
    </div>
  );
}
