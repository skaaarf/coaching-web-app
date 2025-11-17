'use client';

import type {
  BranchMapPath,
  CareerProfile,
  InteractiveActivityData,
  InteractiveModuleId,
  LifeSimulatorSelections,
  ParentSelfScaleResponses,
  TimeMachineLetters,
  ValueBattleResult
} from '@/types';

const MODULE_RESULT_IDS: readonly InteractiveModuleId[] = [
  'value-battle',
  'life-simulator',
  'parent-self-scale',
  'time-machine',
  'branch-map',
  'career-dictionary'
] as const;

type ResultModuleId = typeof MODULE_RESULT_IDS[number];

const isResultModuleId = (moduleId: string): moduleId is ResultModuleId =>
  MODULE_RESULT_IDS.includes(moduleId as ResultModuleId);

const resolveDataForModule = (
  moduleId: ResultModuleId,
  rawData: InteractiveActivityData | undefined
): InteractiveActivityData | null => {
  if (!rawData) return null;

  switch (moduleId) {
    case 'value-battle':
      return rawData;
    case 'life-simulator':
      return rawData;
    case 'parent-self-scale':
      return rawData;
    case 'time-machine':
      return rawData;
    case 'branch-map':
      return rawData;
    case 'career-dictionary':
      return rawData;
    default:
      return null;
  }
};

interface Props {
  moduleId: string;
  data: InteractiveActivityData | undefined;
  onClose: () => void;
}

export default function ModuleResultSidebar({ moduleId, data, onClose }: Props) {
  if (!isResultModuleId(moduleId)) {
    return null;
  }

  const resolvedData = resolveDataForModule(moduleId, data);

  // Render different content based on module type
  const renderContent = () => {
    switch (moduleId) {
      case 'value-battle':
        return <ValueBattleResultSummary results={(resolvedData as ValueBattleResult) || {}} />;
      case 'life-simulator':
        return <LifeSimulatorResultSummary selections={(resolvedData as LifeSimulatorSelections) || {}} />;
      case 'parent-self-scale':
        return <ParentSelfScaleResultSummary responses={(resolvedData as ParentSelfScaleResponses) || {}} />;
      case 'time-machine':
        return <TimeMachineResultSummary letters={(resolvedData as TimeMachineLetters) || { pastLetter: '', futureLetter: '' }} />;
      case 'branch-map':
        return <BranchMapResultSummary path={(resolvedData as BranchMapPath) || []} />;
      case 'career-dictionary':
        return <CareerStoryResultSummary profile={(resolvedData as CareerProfile) || null} />;
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

function ValueBattleResultSummary({ results }: { results: ValueBattleResult }) {
  // Analyze patterns
  const moneyRelated = ['年収800万・興味ない業界の大手企業', '年収1200万・週6勤務、休暇なし', '東京本社勤務・給与1.5倍', '年収1500万・社会貢献度低い', '営業成績で年収2000万可能・ノルマきつい'];
  const nonMoneyRelated = ['年収400万・憧れていた業界のベンチャー', '年収600万・週4勤務、長期休暇OK', '地元支社勤務・給与普通', '年収500万・社会問題の解決', '固定給700万・ノルマなし'];

  const moneyCount = Object.keys(results).filter(k => moneyRelated.includes(k)).length;
  const nonMoneyCount = Object.keys(results).filter(k => nonMoneyRelated.includes(k)).length;

  const othersApproval = ['親が喜ぶ公務員・毎日同じルーティン', '誰もが知る大企業の歯車として働く', '同窓会で自慢できる・実はつらい'];
  const selfSatisfaction = ['親は反対・夢だったクリエイティブ職', '無名だが自分のアイデアが活きる会社', '同窓会で説明しにくい・実は楽しい'];

  const othersCount = Object.keys(results).filter(k => othersApproval.includes(k)).length;
  const selfCount = Object.keys(results).filter(k => selfSatisfaction.includes(k)).length;

  const insights = [];
  if (moneyCount > nonMoneyCount + 1) {
    insights.push({ icon: '💰', label: '経済的安定重視' });
  } else if (nonMoneyCount > moneyCount + 1) {
    insights.push({ icon: '❤️', label: 'やりがい重視' });
  } else {
    insights.push({ icon: '⚖️', label: 'バランス型' });
  }

  if (othersCount > selfCount) {
    insights.push({ icon: '👥', label: '他者評価を気にする' });
  } else if (selfCount > othersCount) {
    insights.push({ icon: '💪', label: '自分軸で生きる' });
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <div className="text-3xl mb-2">🎯</div>
        <h4 className="font-bold text-gray-900 mb-3">あなたの傾向</h4>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className="text-xl mr-2">{insight.icon}</span>
              <span className="text-gray-800 font-medium">{insight.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-xs text-gray-600">
          💡 詳しい分析は結果画面で確認できます
        </p>
      </div>
    </div>
  );
}

function LifeSimulatorResultSummary({ selections }: { selections: LifeSimulatorSelections }) {
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

function ParentSelfScaleResultSummary({ responses }: { responses: ParentSelfScaleResponses }) {
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

function TimeMachineResultSummary({ letters }: { letters: TimeMachineLetters }) {
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

function BranchMapResultSummary({ path }: { path: BranchMapPath }) {
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

function CareerStoryResultSummary({ profile }: { profile: CareerProfile | null }) {
  if (!profile) return null;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
        <div className="text-3xl mb-2">🧭</div>
        <h4 className="font-bold text-gray-900 mb-1">{profile.name}</h4>
        <p className="text-sm text-blue-700 font-semibold">{profile.headline}</p>
        <p className="text-xs text-gray-600 mt-2">{profile.summary}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2">人生年表</p>
        <div className="space-y-2">
          {profile.timeline.slice(0, 3).map(entry => (
            <div key={entry.label} className="text-xs text-gray-700">
              <span className="font-semibold text-blue-600 mr-2">{entry.label}</span>
              {entry.description}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
