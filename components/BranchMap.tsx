'use client';

import { useState } from 'react';

interface Branch {
  id: string;
  level: number;
  label: string;
  description: string;
  parent?: string;
}

const BRANCHES: Branch[] = [
  { id: 'start', level: 0, label: '高校卒業', description: 'ここからスタート' },

  // Level 1
  { id: '1a', level: 1, label: '大学進学', description: '4年間の学び', parent: 'start' },
  { id: '1b', level: 1, label: '専門学校', description: '専門技術を習得', parent: 'start' },
  { id: '1c', level: 1, label: '就職', description: 'すぐに社会人', parent: 'start' },

  // Level 2 - from 大学
  { id: '2a', level: 2, label: '文系学部', description: '経済・文学など', parent: '1a' },
  { id: '2b', level: 2, label: '理系学部', description: '工学・理学など', parent: '1a' },

  // Level 2 - from 専門学校
  { id: '2c', level: 2, label: 'デザイン', description: 'クリエイティブ', parent: '1b' },
  { id: '2d', level: 2, label: '技術系', description: 'IT・工業など', parent: '1b' },

  // Level 2 - from 就職
  { id: '2e', level: 2, label: '大企業', description: '安定志向', parent: '1c' },
  { id: '2f', level: 2, label: '中小企業', description: '幅広い経験', parent: '1c' },

  // Level 3 - sample endpoints
  { id: '3a', level: 3, label: '金融業界', description: '銀行・証券', parent: '2a' },
  { id: '3b', level: 3, label: '公務員', description: '安定した職', parent: '2a' },
  { id: '3c', level: 3, label: 'エンジニア', description: '技術職', parent: '2b' },
  { id: '3d', level: 3, label: '研究者', description: '大学院へ', parent: '2b' },
  { id: '3e', level: 3, label: 'デザイナー', description: 'フリーランス', parent: '2c' },
  { id: '3f', level: 3, label: 'プログラマー', description: 'IT企業', parent: '2d' },
];

interface Props {
  onComplete: (path: Branch[]) => void;
}

export default function BranchMap({ onComplete }: Props) {
  const [selectedPath, setSelectedPath] = useState<Branch[]>([
    BRANCHES.find(b => b.id === 'start')!
  ]);
  const [canExplore, setCanExplore] = useState(false);

  const currentBranch = selectedPath[selectedPath.length - 1];
  const nextOptions = BRANCHES.filter(b => b.parent === currentBranch.id);

  const handleSelect = (branch: Branch) => {
    const newPath = [...selectedPath, branch];
    setSelectedPath(newPath);

    // Check if we've reached the end (level 3)
    if (branch.level === 3) {
      setCanExplore(true);
    }
  };

  const handleReset = (toLevel: number) => {
    setSelectedPath(selectedPath.slice(0, toLevel + 1));
    setCanExplore(false);
  };

  const handleExploreOther = () => {
    // Reset to start to explore other paths
    setSelectedPath([BRANCHES.find(b => b.id === 'start')!]);
    setCanExplore(false);
  };

  const handleComplete = () => {
    onComplete(selectedPath);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🗺️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            IF分岐マップ
          </h2>
          <p className="text-gray-600">
            あなたの選択で、人生はどう変わる？
          </p>
        </div>

        {/* Path visualization */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">📍</span>
              今、あなたが選んだ道
            </h3>
            <div className="space-y-3">
              {selectedPath.map((branch, index) => (
                <div key={branch.id} className="flex items-center">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === selectedPath.length - 1
                        ? 'bg-blue-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    {index}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="font-semibold text-gray-900">
                      {branch.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {branch.description}
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      onClick={() => handleReset(index - 1)}
                      className="ml-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      やり直す
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next options */}
        {nextOptions.length > 0 && !canExplore && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4">次の分岐点を選んで：</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextOptions.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => handleSelect(branch)}
                  className="p-6 text-left bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all duration-200"
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {branch.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {branch.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* End of path */}
        {canExplore && (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                一つの可能性が見えた！
              </h3>
              <p className="text-gray-700">
                これが正解というわけではありません。
                <br />
                他の道も見てみますか？
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleExploreOther}
                className="py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200"
              >
                別の道を探索する
              </button>
              <button
                onClick={handleComplete}
                className="py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
              >
                この道について話す
              </button>
            </div>
          </div>
        )}

        {/* Instruction */}
        {!canExplore && nextOptions.length > 0 && (
          <div className="text-center text-sm text-gray-500 mt-6">
            どの道にも正解はない。大事なのは、納得して選べるかどうか。
          </div>
        )}
      </div>
    </div>
  );
}
