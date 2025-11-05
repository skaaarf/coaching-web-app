'use client';

import { useState } from 'react';
import { LifePath } from '@/types';

const LIFE_PATHS: LifePath[] = [
  {
    id: 'A',
    title: 'Aの人生（安定志向）',
    timeline: [
      { age: 18, event: '大学進学（経済学部）' },
      { age: 22, event: '大手銀行に就職' },
      { age: 25, event: '安定した生活、結婚' },
      { age: 30, event: '子ども誕生、マイホーム購入' },
      { age: 40, event: '部長に昇進' },
      { age: 60, event: '定年退職、年金生活' }
    ],
    aspects: [
      '安定した収入',
      '社会的地位',
      '家族との時間',
      '将来の保証'
    ]
  },
  {
    id: 'B',
    title: 'Bの人生（クリエイティブ志向）',
    timeline: [
      { age: 18, event: '専門学校（デザイン）' },
      { age: 20, event: '制作会社でアルバイト' },
      { age: 23, event: 'フリーランスとして独立' },
      { age: 28, event: '自分のスタジオ設立' },
      { age: 35, event: '海外案件も手がける' },
      { age: 50, event: '後進の育成に力を入れる' }
    ],
    aspects: [
      '好きなことを仕事に',
      '自分のペースで働ける',
      'クリエイティブな仕事',
      '成長し続けられる'
    ]
  },
  {
    id: 'C',
    title: 'Cの人生（職人志向）',
    timeline: [
      { age: 18, event: '就職（製造業）' },
      { age: 21, event: '技術を磨く日々' },
      { age: 25, event: '職人として独立' },
      { age: 30, event: '自分の工房を持つ' },
      { age: 40, event: '弟子を取る' },
      { age: 55, event: '業界で名前が知られる存在に' }
    ],
    aspects: [
      '手に職をつける',
      '一つのことを極める',
      '実物を作る喜び',
      '師弟関係'
    ]
  }
];

interface Props {
  onComplete: (selectedAspects: Record<string, string[]>) => void;
}

export default function LifeSimulator({ onComplete }: Props) {
  const [currentPath, setCurrentPath] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const handleAspectToggle = (pathId: string, aspect: string) => {
    const currentSelections = selections[pathId] || [];
    let newSelections: string[];

    if (currentSelections.includes(aspect)) {
      newSelections = currentSelections.filter(a => a !== aspect);
    } else {
      if (currentSelections.length < 3) {
        newSelections = [...currentSelections, aspect];
      } else {
        return; // Already selected 3
      }
    }

    setSelections({
      ...selections,
      [pathId]: newSelections
    });
  };

  const handleNext = () => {
    if (currentPath < LIFE_PATHS.length - 1) {
      setCurrentPath(currentPath + 1);
    } else {
      onComplete(selections);
    }
  };

  const path = LIFE_PATHS[currentPath];
  const currentSelections = selections[path.id] || [];
  const canProceed = currentSelections.length === 3;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-center space-x-4 mb-4">
          {LIFE_PATHS.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                index === currentPath
                  ? 'bg-blue-500 text-white'
                  : index < currentPath
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {String.fromCharCode(65 + index)}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {path.title}
          </h2>
          <p className="text-sm text-gray-500">
            この人生の好きなポイントを3つ選んで
          </p>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <div className="space-y-3">
            {path.timeline.map((event, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-16 font-semibold text-blue-600">
                  {event.age}歳:
                </div>
                <div className="flex-grow text-gray-700">{event.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aspects selection */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {path.aspects.map((aspect) => {
              const isSelected = currentSelections.includes(aspect);
              const isDisabled = !isSelected && currentSelections.length >= 3;

              return (
                <button
                  key={aspect}
                  onClick={() => handleAspectToggle(path.id, aspect)}
                  disabled={isDisabled}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-100 border-blue-400 text-blue-900'
                      : isDisabled
                      ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                        isSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{aspect}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selection counter */}
        <div className="text-center text-sm text-gray-500 mb-6">
          {currentSelections.length} / 3 選択済み
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
            canProceed
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentPath < LIFE_PATHS.length - 1 ? '次の人生へ' : '結果を見る'}
        </button>
      </div>
    </div>
  );
}
