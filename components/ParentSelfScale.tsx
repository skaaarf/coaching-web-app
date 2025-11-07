'use client';

import { useState } from 'react';
import { ScaleQuestion } from '@/types';

const QUESTIONS: ScaleQuestion[] = [
  { id: 1, question: '大学に行くべきだと思う？' },
  { id: 2, question: '安定した仕事につきたい？' },
  { id: 3, question: 'やりたいことより、稼げることを優先？' },
  { id: 4, question: '親の期待に応えたい？' },
  { id: 5, question: '有名な企業で働きたい？' },
  { id: 6, question: '将来の安定は大切？' },
  { id: 7, question: '好きなことを仕事にしたい？' },
  { id: 8, question: '自分で道を決めたい？' },
  { id: 9, question: '周りの評価は気になる？' },
  { id: 10, question: 'リスクを取っても挑戦したい？' }
];

interface Props {
  onComplete: (responses: Record<number, number>) => void;
}

export default function ParentSelfScale({ onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [sliderValue, setSliderValue] = useState(50);

  const handleNext = () => {
    const newResponses = {
      ...responses,
      [QUESTIONS[currentQuestion].id]: sliderValue
    };
    setResponses(newResponses);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSliderValue(50); // Reset slider
    } else {
      onComplete(newResponses);
    }
  };

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            質問 {currentQuestion + 1} / {QUESTIONS.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            天秤ゲーム
          </h2>
          <p className="text-gray-600">
            あなたの気持ちはどちら寄り？
          </p>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
            {question.question}
          </h3>

          {/* Scale */}
          <div className="relative">
            {/* Labels - Now tappable for quick selection */}
            <div className="flex justify-between mb-6">
              <button
                type="button"
                onClick={() => setSliderValue(0)}
                className="px-4 py-3 rounded-xl bg-purple-50 border-2 border-purple-300 active:bg-purple-100 transition-colors touch-manipulation"
              >
                <span className="text-sm font-bold text-purple-700">← 親の期待</span>
              </button>
              <button
                type="button"
                onClick={() => setSliderValue(100)}
                className="px-4 py-3 rounded-xl bg-blue-50 border-2 border-blue-300 active:bg-blue-100 transition-colors touch-manipulation"
              >
                <span className="text-sm font-bold text-blue-700">自分の気持ち →</span>
              </button>
            </div>

            {/* Slider - Enhanced for mobile touch */}
            <div className="relative mb-6 py-4">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-5 bg-gradient-to-r from-purple-200 via-gray-200 to-blue-200 rounded-full appearance-none cursor-pointer slider touch-manipulation"
                style={{
                  background: `linear-gradient(to right,
                    #c084fc ${sliderValue}%,
                    #93c5fd ${sliderValue}%)`
                }}
              />
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  width: 44px;
                  height: 44px;
                  border-radius: 50%;
                  background: #1f2937;
                  cursor: pointer;
                  border: 4px solid white;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                  transition: all 0.2s;
                }
                .slider::-webkit-slider-thumb:active {
                  transform: scale(1.1);
                  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
                }
                .slider::-moz-range-thumb {
                  width: 44px;
                  height: 44px;
                  border-radius: 50%;
                  background: #1f2937;
                  cursor: pointer;
                  border: 4px solid white;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                  transition: all 0.2s;
                }
                .slider::-moz-range-thumb:active {
                  transform: scale(1.1);
                  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
                }
              `}</style>
            </div>

            {/* Value indicator */}
            <div className="text-center">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl border-2 border-gray-300 shadow-sm">
                <div className="text-base font-bold text-gray-900">
                  {sliderValue < 40 && '← 親の期待寄り'}
                  {sliderValue >= 40 && sliderValue <= 60 && '⚖️ どちらとも言えない'}
                  {sliderValue > 60 && '自分の気持ち寄り →'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {sliderValue}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-sm font-medium text-gray-700">
            💡 スライダーを動かすか、両端のボタンをタップしてください
          </p>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-base rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg touch-manipulation"
        >
          {currentQuestion < QUESTIONS.length - 1 ? '次へ →' : '完了して結果を見る'}
        </button>
      </div>
    </div>
  );
}
