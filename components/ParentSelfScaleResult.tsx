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

        {/* Gauge Chart */}
        <div className="mb-8 bg-gradient-to-br from-orange-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-col items-center">
            {/* Semi-circular gauge */}
            <div className="relative w-64 h-32">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 10 90 A 90 90 0 0 1 190 90"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                {/* Purple (parent) section */}
                <path
                  d="M 10 90 A 90 90 0 0 1 190 90"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={`${(100 - average) * 2.83} 283`}
                  className="transition-all duration-1000"
                />
                {/* Blue (self) section */}
                <path
                  d="M 10 90 A 90 90 0 0 1 190 90"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={`${average * 2.83} 283`}
                  strokeDashoffset={`-${(100 - average) * 2.83}`}
                  className="transition-all duration-1000"
                  style={{ animationDelay: '0.3s' }}
                />
                {/* Needle */}
                <g
                  transform={`rotate(${(average / 100) * 180 - 90} 100 90)`}
                  className="transition-transform duration-1000"
                  style={{ animation: 'needle-swing 1.5s ease-out' }}
                >
                  <line
                    x1="100"
                    y1="90"
                    x2="100"
                    y2="20"
                    stroke="#1f2937"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="90" r="6" fill="#1f2937" />
                </g>
              </svg>
            </div>

            {/* Labels */}
            <div className="flex items-center justify-between w-full mt-4 px-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(100 - average)}%
                </div>
                <div className="text-sm font-medium text-gray-600 mt-1">
                  親の期待
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(average)}%
                </div>
                <div className="text-sm font-medium text-gray-600 mt-1">
                  自分の気持ち
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-purple-600">親の期待</span>
            <span className="text-lg font-semibold text-blue-600">自分の気持ち</span>
          </div>

          <div className="relative h-16 bg-gradient-to-r from-purple-100 via-gray-100 to-blue-100 rounded-full flex items-center px-4">
            <div
              className="absolute w-6 h-6 bg-gray-800 rounded-full border-4 border-white shadow-lg transition-all duration-500 animate-slide-in"
              style={{ left: `calc(${average}% - 12px)`, animationDelay: '1s' }}
            />
          </div>

          <div className="text-center mt-4">
            <div className="inline-block px-6 py-3 bg-gray-100 rounded-xl animate-fade-in" style={{ animationDelay: '1.2s' }}>
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

        {/* Diagnostic Summary */}
        <div className="mb-6 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl p-[2px] animate-fade-in" style={{ animationDelay: '1.8s' }}>
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                ⚖️
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  診断結果サマリー
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <p className="text-gray-700">
                      <strong>全体的な傾向:</strong> {
                        average < 35 ? '親の期待を強く意識' :
                        average < 45 ? 'やや親の期待寄り' :
                        average < 55 ? 'バランスが取れている' :
                        average < 65 ? 'やや自分の気持ち寄り' : '自分の気持ちを優先'
                      }
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <p className="text-gray-700">
                      <strong>バランス比:</strong> 親の期待{Math.round(100 - average)}% : 自分の気持ち{Math.round(average)}%
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <p className="text-gray-700">
                      <strong>特徴:</strong> {
                        extremes.length > 0
                          ? `${extremes.length}個の質問で明確な偏りあり`
                          : '各質問で一貫した回答'
                      }
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

      <style jsx>{`
        @keyframes needle-swing {
          0% {
            transform: rotate(-90deg);
          }
          60% {
            transform: rotate(${(average / 100) * 180 - 85}deg);
          }
          80% {
            transform: rotate(${(average / 100) * 180 - 95}deg);
          }
          100% {
            transform: rotate(${(average / 100) * 180 - 90}deg);
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
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out both;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
