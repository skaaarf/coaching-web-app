'use client';

import { useState } from 'react';

interface Props {
    eraId: string;
    eraName: string;
    currentSatisfaction: number | null;
    onSave: (satisfaction: number) => void;
    onBack: () => void;
}

export default function SatisfactionInputScreen({
    eraId,
    eraName,
    currentSatisfaction,
    onSave,
    onBack,
}: Props) {
    const [satisfaction, setSatisfaction] = useState<number>(
        currentSatisfaction ?? 5
    );

    const handleSave = () => {
        onSave(satisfaction);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 flex items-center gap-1"
                >
                    ← 戻る
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    {eraName}を振り返って
                </h2>
                <p className="text-base text-gray-700 text-center">
                    全体としてどのくらい満足していましたか？
                </p>
            </div>

            {/* Large Satisfaction Display */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-300 rounded-3xl p-8 mb-8 text-center">
                <div className="text-7xl font-bold text-blue-600 mb-2">
                    {satisfaction}
                </div>
                <div className="text-sm font-semibold text-gray-600">
                    /10
                </div>
            </div>

            {/* Slider */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-600">
                        1 - 全然満足していない
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                        10 - とても満足している
                    </span>
                </div>

                <input
                    type="range"
                    min="1"
                    max="10"
                    value={satisfaction}
                    onChange={(e) => setSatisfaction(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                    style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((satisfaction - 1) / 9) * 100
                            }%, #e5e7eb ${((satisfaction - 1) / 9) * 100}%, #e5e7eb 100%)`,
                    }}
                />

                {/* Tick marks */}
                <div className="flex justify-between mt-2 px-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => setSatisfaction(num)}
                            className={`text-xs font-medium transition-colors ${satisfaction === num ? 'text-blue-600' : 'text-gray-400'
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
                💾 保存する
            </button>

            {/* Info */}
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg inline-block">
                    💡 満足度は後から編集できます
                </p>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
        </div>
    );
}
