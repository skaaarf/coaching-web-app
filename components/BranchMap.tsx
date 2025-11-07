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
  { id: 'start', level: 0, label: '18歳・高校卒業', description: 'あなたの人生が始まる。進路を決める時' },

  // Level 1 - Post high school (3 choices)
  { id: '1a', level: 1, label: '大学進学（国立）', description: '学費は抑えめ。真面目に4年間学ぶ', parent: 'start' },
  { id: '1b', level: 1, label: '大学進学（私立）', description: '学費は高いが設備充実。自由な雰囲気', parent: 'start' },
  { id: '1c', level: 1, label: '専門学校', description: '2年で実践的スキル。即戦力を目指す', parent: 'start' },
  { id: '1d', level: 1, label: '就職（高卒）', description: '18歳から社会人。同級生より4年早くキャリアスタート', parent: 'start' },

  // Level 2 - University specialization (from 国立大学)
  { id: '2a1', level: 2, label: '経済学部', description: 'サークル活動充実。就活に強い学部', parent: '1a' },
  { id: '2a2', level: 2, label: '工学部', description: '課題多い。でも技術が身につく', parent: '1a' },
  { id: '2a3', level: 2, label: '教育学部', description: '教員免許取得。安定志向の仲間が多い', parent: '1a' },

  // Level 2 - from 私立大学
  { id: '2b1', level: 2, label: '経営学部', description: '実践的。企業とのつながり多い', parent: '1b' },
  { id: '2b2', level: 2, label: '芸術学部', description: '好きなことに没頭。就職は不安', parent: '1b' },
  { id: '2b3', level: 2, label: '国際学部', description: '留学チャンスあり。語学力が伸びる', parent: '1b' },

  // Level 2 - from 専門学校
  { id: '2c1', level: 2, label: 'IT専門', description: 'プログラミング漬け。2年後には即戦力', parent: '1c' },
  { id: '2c2', level: 2, label: 'デザイン専門', description: 'ポートフォリオ制作に明け暮れる', parent: '1c' },
  { id: '2c3', level: 2, label: '医療専門', description: '資格取得で安定。勉強はハード', parent: '1c' },

  // Level 2 - from 高卒就職
  { id: '2d1', level: 2, label: '地元の製造業', description: '工場勤務。先輩が優しい。給料普通', parent: '1d' },
  { id: '2d2', level: 2, label: '大手企業（一般職）', description: '大卒と差を感じる。でも安定', parent: '1d' },
  { id: '2d3', level: 2, label: '接客業', description: '人と話すのは楽しい。将来は不安', parent: '1d' },

  // Level 3 - 22歳 First job (from 経済学部)
  { id: '3a1', level: 3, label: '大手メーカー営業職', description: '初任給25万。転勤あり。福利厚生◎', parent: '2a1' },
  { id: '3a2', level: 3, label: 'ベンチャー企業', description: '初任給22万。裁量大。成長できる', parent: '2a1' },
  { id: '3a3', level: 3, label: '公務員', description: '初任給20万。安定。土日休み確実', parent: '2a1' },

  // Level 3 - from 工学部
  { id: '3b1', level: 3, label: 'IT企業エンジニア', description: '初任給28万。技術が活かせる。残業多い', parent: '2a2' },
  { id: '3b2', level: 3, label: '大学院進学', description: '研究を続ける。2年後の就職は有利？', parent: '2a2' },
  { id: '3b3', level: 3, label: 'メーカー技術職', description: '初任給26万。工場配属。ものづくり', parent: '2a2' },

  // Level 3 - from 教育学部
  { id: '3c1', level: 3, label: '公立学校教員', description: '初任給23万。やりがいあり。忙しい', parent: '2a3' },
  { id: '3c2', level: 3, label: '私立学校教員', description: '初任給21万。落ち着いた環境', parent: '2a3' },
  { id: '3c3', level: 3, label: '教育系企業', description: '初任給24万。土日休み。営業要素あり', parent: '2a3' },

  // Level 3 - from 経営学部（私立）
  { id: '3d1', level: 3, label: 'コンサル業界', description: '初任給35万。激務。成長スピード速い', parent: '2b1' },
  { id: '3d2', level: 3, label: '金融業界', description: '初任給28万。ノルマあり。安定', parent: '2b1' },

  // Level 3 - from 芸術学部
  { id: '3e1', level: 3, label: 'デザイン会社', description: '初任給20万。好きな仕事。残業代なし', parent: '2b2' },
  { id: '3e2', level: 3, label: 'フリーランス挑戦', description: '収入不安定。自由。孤独', parent: '2b2' },

  // Level 3 - from IT専門
  { id: '3f1', level: 3, label: 'Web制作会社', description: '20歳で就職。給料23万。スキル伸びる', parent: '2c1' },
  { id: '3f2', level: 3, label: 'SIer', description: '20歳で就職。給料26万。大企業の案件', parent: '2c1' },

  // Level 4 - 25-27歳 キャリア選択 (from 大手メーカー)
  { id: '4a1', level: 4, label: '25歳・昇進して主任に', description: '責任増。給料30万。転勤で大阪へ', parent: '3a1' },
  { id: '4a2', level: 4, label: '25歳・転職してベンチャーへ', description: 'リスク取る。給料28万。やりがい◎', parent: '3a1' },
  { id: '4a3', level: 4, label: '25歳・結婚して地元に戻る', description: '地方支社へ異動。給料27万。家族優先', parent: '3a1' },

  // Level 4 - from ベンチャー
  { id: '4b1', level: 4, label: '26歳・マネージャーに昇格', description: 'チーム持つ。給料35万。忙しい', parent: '3a2' },
  { id: '4b2', level: 4, label: '26歳・大手に転職', description: '安定求めて。給料33万。裁量減る', parent: '3a2' },

  // Level 4 - from 公務員
  { id: '4c1', level: 4, label: '27歳・係長に', description: '順調に昇進。給料26万。安定', parent: '3a3' },
  { id: '4c2', level: 4, label: '27歳・民間転職を決意', description: '給料アップ狙う。給料32万。不安もある', parent: '3a3' },

  // Level 4 - from ITエンジニア
  { id: '4d1', level: 4, label: '26歳・リードエンジニアに', description: '技術力が認められた。給料38万', parent: '3b1' },
  { id: '4d2', level: 4, label: '26歳・外資IT企業へ転職', description: '給料60万。英語必須。成果主義', parent: '3b1' },

  // Level 4 - from 大学院
  { id: '4e1', level: 4, label: '24歳・修士卒で研究職', description: '企業研究所。給料32万。専門性活かす', parent: '3b2' },
  { id: '4e2', level: 4, label: '24歳・博士課程へ', description: '研究者の道。給料ほぼなし。奨学金', parent: '3b2' },

  // Level 5 - 30-35歳 人生の転換期 (from 主任)
  { id: '5a1', level: 5, label: '32歳・課長昇進', description: '管理職。給料45万。部下10人。現場から離れる', parent: '4a1' },
  { id: '5a2', level: 5, label: '32歳・家族のため残業減らす', description: '昇進諦める。給料35万。子育て優先', parent: '4a1' },

  // Level 5 - from ベンチャーマネージャー
  { id: '5b1', level: 5, label: '32歳・起業を決意', description: '貯金500万で独立。不安と期待', parent: '4b1' },
  { id: '5b2', level: 5, label: '32歳・執行役員に', description: '会社の中核。給料55万。株式もらう', parent: '4b1' },

  // Level 5 - from 外資IT
  { id: '5c1', level: 5, label: '32歳・マネージャー昇格', description: '給料90万。激務。家族との時間なし', parent: '4d2' },
  { id: '5c2', level: 5, label: '32歳・日系大手に戻る', description: '給料45万。ワークライフバランス重視', parent: '4d2' },

  // Level 6 - 40歳 キャリアの成熟 (from 課長)
  { id: '6a1', level: 6, label: '40歳・部長昇進', description: '給料70万。役員候補。家庭は妻任せ', parent: '5a1' },
  { id: '6a2', level: 6, label: '40歳・子会社へ出向', description: '給料50万。出世コースから外れた？', parent: '5a1' },

  // Level 6 - from 起業
  { id: '6b1', level: 6, label: '40歳・事業成功で年収2000万', description: '従業員30人。責任重い。でも充実', parent: '5b1' },
  { id: '6b2', level: 6, label: '40歳・事業苦戦で会社員に戻る', description: '給料40万。挑戦したことに後悔なし', parent: '5b1' },

  // Level 6 - from 子育て優先
  { id: '6c1', level: 6, label: '40歳・子育て落ち着き昇進', description: '課長に。給料42万。仕事と家庭両立できた', parent: '5a2' },
  { id: '6c2', level: 6, label: '40歳・地域活動に力を入れる', description: '給料38万。人生の充実は給料だけじゃない', parent: '5a2' },
];

interface Props {
  onComplete: (path: Branch[]) => void;
}

export default function BranchMap({ onComplete }: Props) {
  const [selectedPath, setSelectedPath] = useState<Branch[]>([
    BRANCHES.find(b => b.id === 'start')!
  ]);
  const [canExplore, setCanExplore] = useState(false);
  const [showTreeView, setShowTreeView] = useState(false);

  const currentBranch = selectedPath[selectedPath.length - 1];
  const nextOptions = BRANCHES.filter(b => b.parent === currentBranch.id);

  // Helper function to render tree recursively
  const renderTreeNode = (branchId: string, depth: number = 0): JSX.Element[] => {
    const branch = BRANCHES.find(b => b.id === branchId);
    if (!branch) return [];

    const isSelected = selectedPath.some(p => p.id === branchId);
    const isCurrent = currentBranch.id === branchId;
    const children = BRANCHES.filter(b => b.parent === branchId);

    const result: JSX.Element[] = [
      <div key={branchId} className={`flex items-start ${depth > 0 ? 'ml-6' : ''}`}>
        <div className="flex-shrink-0 w-1 bg-gray-300 mr-2" style={{ height: '100%' }} />
        <div className={`flex-1 mb-2 p-3 rounded-lg border-2 transition-all ${
          isCurrent ? 'bg-blue-100 border-blue-500 shadow-md' :
          isSelected ? 'bg-green-50 border-green-400' :
          'bg-white border-gray-200'
        }`}>
          <div className="font-semibold text-sm text-gray-900">
            {branch.label}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {branch.description.substring(0, 50)}
            {branch.description.length > 50 ? '...' : ''}
          </div>
          {isCurrent && (
            <div className="mt-1 text-xs font-bold text-blue-600">
              ← 現在地
            </div>
          )}
        </div>
      </div>
    ];

    // Only show children if this branch is in the selected path or is current
    if ((isSelected || isCurrent) && children.length > 0) {
      children.forEach(child => {
        result.push(...renderTreeNode(child.id, depth + 1));
      });
    }

    return result;
  };

  const handleSelect = (branch: Branch) => {
    const newPath = [...selectedPath, branch];
    setSelectedPath(newPath);

    // Check if we've reached the end (level 6 or no more options)
    const hasNextOptions = BRANCHES.some(b => b.parent === branch.id);
    if (branch.level === 6 || !hasNextOptions) {
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
        <div className="mb-6">
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-300">
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
                        : 'bg-green-500'
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
                      className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      やり直す
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tree View Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowTreeView(!showTreeView)}
            className="w-full p-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-2 border-purple-300 rounded-xl transition-all shadow-sm hover:shadow-md touch-manipulation"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl mr-2">🌳</span>
                <span className="font-bold text-gray-900">分岐ツリーを見る</span>
              </div>
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${showTreeView ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Tree View */}
        {showTreeView && (
          <div className="mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-300 max-h-96 overflow-y-auto">
              <div className="mb-3 pb-3 border-b-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center">
                  <span className="text-lg mr-2">🌳</span>
                  全体の道筋
                </h3>
                <p className="text-xs text-gray-600">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>選択済み
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full ml-3 mr-1"></span>現在地
                  <span className="inline-block w-3 h-3 bg-gray-200 rounded-full ml-3 mr-1"></span>未選択
                </p>
              </div>
              <div className="space-y-1">
                {renderTreeNode('start')}
              </div>
            </div>
          </div>
        )}

        {/* Next options */}
        {nextOptions.length > 0 && !canExplore && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">
              ⤴️ 次の分岐点を選んで：
            </h3>
            <div className="space-y-3">
              {nextOptions.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => handleSelect(branch)}
                  className="w-full p-5 text-left bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 rounded-xl transition-all shadow-sm hover:shadow-md touch-manipulation"
                >
                  <div className="font-bold text-gray-900 mb-2 text-base">
                    {branch.label}
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
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
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                一つの可能性が見えた！
              </h3>
              <p className="text-gray-700 leading-relaxed">
                これが正解というわけではありません。
                <br />
                他の道も見てみますか？
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExploreOther}
                className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg touch-manipulation"
              >
                🔄 別の道を探索する
              </button>
              <button
                onClick={handleComplete}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg touch-manipulation"
              >
                💬 この道について話す
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
