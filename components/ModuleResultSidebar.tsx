'use client';

interface Props {
  moduleId: string;
  data: any;
  onClose: () => void;
}

export default function ModuleResultSidebar({ moduleId, data, onClose }: Props) {
  // Render different content based on module type
  const renderContent = () => {
    switch (moduleId) {
      case 'value-battle':
        return <ValueBattleResultSummary results={data} />;
      case 'life-simulator':
        return <LifeSimulatorResultSummary selections={data} />;
      case 'parent-self-scale':
        return <ParentSelfScaleResultSummary responses={data} />;
      case 'time-machine':
        return <TimeMachineResultSummary letters={data} />;
      case 'branch-map':
        return <BranchMapResultSummary path={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">あなたの結果</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          aria-label="閉じる"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
}

function ValueBattleResultSummary({ results }: { results: Record<string, number> }) {
  const sortedResults = Object.entries(results)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topValue = sortedResults[0];

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <div className="text-3xl mb-2">🎯</div>
        <h4 className="font-bold text-gray-900 mb-2">最重視する価値観</h4>
        <p className="text-lg font-semibold text-blue-600">{topValue[0]}</p>
        <p className="text-sm text-gray-600 mt-1">
          タイプ: {topValue[1] >= 15 ? '明確な価値観' : topValue[1] >= 10 ? 'バランス型' : '多様な価値観'}
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">価値観ランキング</h4>
        <div className="space-y-2">
          {sortedResults.map(([value, count], index) => (
            <div key={value} className="flex items-center text-sm">
              <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-xs rounded-full flex-shrink-0">
                {index + 1}
              </div>
              <div className="ml-2 flex-grow min-w-0">
                <div className="text-gray-900 truncate">{value}</div>
              </div>
              <div className="ml-2 flex-shrink-0 text-xs text-gray-500">
                {Math.round((count / 20) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LifeSimulatorResultSummary({ selections }: { selections: Record<string, string[]> }) {
  const aspectCounts: Record<string, number> = {};
  Object.values(selections).forEach(aspects => {
    aspects.forEach(aspect => {
      aspectCounts[aspect] = (aspectCounts[aspect] || 0) + 1;
    });
  });

  const sortedAspects = Object.entries(aspectCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const pathCounts = {
    A: selections.A?.length || 0,
    B: selections.B?.length || 0,
    C: selections.C?.length || 0
  };

  const preferredPath =
    pathCounts.A > pathCounts.B && pathCounts.A > pathCounts.C ? 'A（安定志向）' :
    pathCounts.B > pathCounts.C ? 'B（クリエイティブ志向）' : 'C（職人志向）';

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
        <div className="text-3xl mb-2">🎬</div>
        <h4 className="font-bold text-gray-900 mb-2">あなたの傾向</h4>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">最も惹かれた人生:</span><br />
          {preferredPath}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">重視する要素:</span><br />
          {sortedAspects.map(([a]) => a).join('、')}
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">選択の分布</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Aの人生</span>
              <span>{pathCounts.A}個</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${(pathCounts.A / 9) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Bの人生</span>
              <span>{pathCounts.B}個</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${(pathCounts.B / 9) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Cの人生</span>
              <span>{pathCounts.C}個</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${(pathCounts.C / 9) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParentSelfScaleResultSummary({ responses }: { responses: Record<number, number> }) {
  const values = Object.values(responses);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl p-4 border border-orange-200">
        <div className="text-3xl mb-2">⚖️</div>
        <h4 className="font-bold text-gray-900 mb-2">バランス</h4>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-purple-600 font-semibold">親の期待<br />{Math.round(100 - average)}%</span>
          <span className="text-blue-600 font-semibold">自分の気持ち<br />{Math.round(average)}%</span>
        </div>
        <div className="h-3 bg-gradient-to-r from-purple-200 via-gray-200 to-blue-200 rounded-full relative">
          <div
            className="absolute w-4 h-4 bg-gray-800 rounded-full border-2 border-white shadow-lg -top-0.5"
            style={{ left: `calc(${average}% - 8px)` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-3">
          {average < 40 && '親の期待を強く意識'}
          {average >= 40 && average <= 60 && 'バランスが取れている'}
          {average > 60 && '自分の気持ちを優先'}
        </p>
      </div>
    </div>
  );
}

function TimeMachineResultSummary({ letters }: { letters: { pastLetter: string; futureLetter: string } }) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl p-4 border border-indigo-200">
        <div className="text-3xl mb-2">⏰</div>
        <h4 className="font-bold text-gray-900 mb-3">あなたが書いた手紙</h4>

        <div className="space-y-3">
          <div>
            <h5 className="text-xs font-semibold text-gray-700 mb-1">1年前の自分へ</h5>
            <div className="text-sm text-gray-600 bg-white rounded p-2 max-h-24 overflow-y-auto">
              {letters.pastLetter}
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-gray-700 mb-1">10年後の自分から</h5>
            <div className="text-sm text-gray-600 bg-white rounded p-2 max-h-24 overflow-y-auto">
              {letters.futureLetter}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchMapResultSummary({ path }: { path: Array<{ label: string }> }) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border border-green-200">
        <div className="text-3xl mb-2">🗺️</div>
        <h4 className="font-bold text-gray-900 mb-3">選んだ道</h4>
        <div className="space-y-2">
          {path.map((branch, index) => (
            <div key={index} className="flex items-start text-sm">
              <div className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-700 font-bold text-xs rounded-full flex-shrink-0">
                {index + 1}
              </div>
              <div className="ml-2 flex-grow text-gray-700">
                {branch.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
