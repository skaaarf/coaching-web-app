'use client';

import { useRouter } from 'next/navigation';

interface Props {
  responses: Record<number, number>;
  onStartDialogue: () => void;
}

export default function ParentSelfScaleResult({ responses, onStartDialogue }: Props) {
  const router = useRouter();

  // Calculate average
  const values = Object.values(responses);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Find extreme responses
  const extremes = Object.entries(responses)
    .filter(([, value]) => value < 30 || value > 70)
    .sort(([, a], [, b]) => Math.abs(50 - b) - Math.abs(50 - a))
    .slice(0, 3);

  const getQuestionText = (id: number) => {
    const questions = [
      '大学に行くべきだと思う？',
      '安定した仕事につきたい？',
      'やりたいことより、稼げることを優先？',
      '親の期待に応えたい？',
      '有名な企業で働きたい？',
      '将来の安定は大切？',
      '好きなことを仕事にしたい？',
      '自分で道を決めたい？',
      '周りの評価は気になる？',
      'リスクを取っても挑戦したい？'
    ];
    return questions[id - 1];
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            あなたの天秤
          </h2>
          <p className="text-gray-600">
            10個の質問から見えてきたバランス
          </p>
        </div>

        {/* Balance display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-purple-600">親の期待</span>
            <span className="text-lg font-semibold text-blue-600">自分の気持ち</span>
          </div>

          <div className="relative h-16 bg-gradient-to-r from-purple-100 via-gray-100 to-blue-100 rounded-full flex items-center px-4">
            <div
              className="absolute w-6 h-6 bg-gray-800 rounded-full border-4 border-white shadow-lg transition-all duration-500"
              style={{ left: `calc(${average}% - 12px)` }}
            />
          </div>

          <div className="text-center mt-4">
            <div className="inline-block px-6 py-3 bg-gray-100 rounded-xl">
              <span className="text-2xl font-bold text-gray-900">
                {Math.round(100 - average)}% : {Math.round(average)}%
              </span>
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            分析結果
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {average < 40 && (
              <>あなたは親の期待を強く意識している。</>
            )}
            {average >= 40 && average <= 60 && (
              <>あなたは親の期待と自分の気持ちのバランスを取ろうとしている。</>
            )}
            {average > 60 && (
              <>あなたは自分の気持ちを優先している。</>
            )}
          </p>

          {extremes.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                特に偏りがあった質問:
              </h4>
              <ul className="space-y-2">
                {extremes.map(([id, value]) => (
                  <li key={id} className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <div className="flex-grow">
                      <div className="text-sm text-gray-700">
                        {getQuestionText(Number(id))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {value < 50 ? '親の期待' : '自分の気持ち'}寄り (
                        {Math.round(value)}%)
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Insight */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">
            考えてみよう
          </h3>
          <p className="text-gray-700 leading-relaxed">
            質問によって答えが違ったね。
            <br />
            何が違ったんだろう？
            <br />
            <br />
            一緒に考えてみよう。
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onStartDialogue}
            className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors duration-200"
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
