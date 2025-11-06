'use client';

import { InteractiveModuleProgress } from '@/types';

interface Props {
  interactiveProgress: Record<string, InteractiveModuleProgress>;
}

export default function DiagnosticAggregation({ interactiveProgress }: Props) {
  // Extract insights from modules with progress (not just completed)
  const insights: Array<{
    moduleId: string;
    moduleName: string;
    icon: string;
    findings: string[];
    color: string;
  }> = [];

  // Value Battle - show if result or dialogue phase
  if (interactiveProgress['value-battle']) {
    const data = interactiveProgress['value-battle'].data as any;
    if (data.phase === 'dialogue' || data.phase === 'result') {
      const results = data.data as Record<string, number>;

      // Analyze patterns
      const moneyRelated = ['年収800万・興味ない業界の大手企業', '年収1200万・週6勤務、休暇なし', '東京本社勤務・給与1.5倍', '年収1500万・社会貢献度低い', '営業成績で年収2000万可能・ノルマきつい'];
      const nonMoneyRelated = ['年収400万・憧れていた業界のベンチャー', '年収600万・週4勤務、長期休暇OK', '地元支社勤務・給与普通', '年収500万・社会問題の解決', '固定給700万・ノルマなし'];

      const moneyCount = Object.keys(results).filter(k => moneyRelated.includes(k)).length;
      const nonMoneyCount = Object.keys(results).filter(k => nonMoneyRelated.includes(k)).length;

      const othersApproval = ['親が喜ぶ公務員・毎日同じルーティン', '誰もが知る大企業の歯車として働く', '同窓会で自慢できる・実はつらい'];
      const selfSatisfaction = ['親は反対・夢だったクリエイティブ職', '無名だが自分のアイデアが活きる会社', '同窓会で説明しにくい・実は楽しい'];

      const othersCount = Object.keys(results).filter(k => othersApproval.includes(k)).length;
      const selfCount = Object.keys(results).filter(k => selfSatisfaction.includes(k)).length;

      const tendency1 = moneyCount > nonMoneyCount + 1 ? '経済的安定重視' : nonMoneyCount > moneyCount + 1 ? 'やりがい重視' : 'バランス型';
      const tendency2 = othersCount > selfCount ? '他者評価を気にする' : selfCount > othersCount ? '自分軸で生きる' : '';

      const findings = [`💰 ${tendency1}`];
      if (tendency2) findings.push(`👥 ${tendency2}`);

      insights.push({
        moduleId: 'value-battle',
        moduleName: '価値観バトル',
        icon: '⚔️',
        color: 'from-blue-500 to-purple-600',
        findings
      });
    }
  }

  // Life Simulator - show if result or dialogue phase
  if (interactiveProgress['life-simulator']) {
    const data = interactiveProgress['life-simulator'].data as any;
    if (data.phase === 'dialogue' || data.phase === 'result') {
      const selections = data.data as Record<string, string[]>;

      const pathCounts = {
        A: selections.A?.length || 0,
        B: selections.B?.length || 0,
        C: selections.C?.length || 0,
        D: selections.D?.length || 0,
        E: selections.E?.length || 0
      };
      const preferredPath =
        pathCounts.A > Math.max(pathCounts.B, pathCounts.C, pathCounts.D, pathCounts.E) ? '🏢 大企業・安定志向' :
        pathCounts.B > Math.max(pathCounts.C, pathCounts.D, pathCounts.E) ? '🚀 ベンチャー志向' :
        pathCounts.C > Math.max(pathCounts.D, pathCounts.E) ? '🎨 クリエイティブ志向' :
        pathCounts.D > pathCounts.E ? '🏡 地元密着志向' : '📚 専門職志向';

      insights.push({
        moduleId: 'life-simulator',
        moduleName: '人生シミュレーター',
        icon: '🎬',
        color: 'from-cyan-500 to-blue-600',
        findings: [
          preferredPath
        ]
      });
    }
  }

  // Parent Self Scale - show if result or dialogue phase
  if (interactiveProgress['parent-self-scale']) {
    const data = interactiveProgress['parent-self-scale'].data as any;
    if (data.phase === 'dialogue' || data.phase === 'result') {
      const responses = data.data as Record<number, number>;
      const values = Object.values(responses);
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;

      const tendency =
        average < 40 ? '親の期待を重視' :
        average < 60 ? 'バランス型' : '自分の気持ちを優先';

      insights.push({
        moduleId: 'parent-self-scale',
        moduleName: '親の期待 vs 自分',
        icon: '⚖️',
        color: 'from-orange-500 to-purple-600',
        findings: [
          `傾向: ${tendency}`
        ]
      });
    }
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          あなたについて分かったこと
        </h2>
        <span className="text-sm text-gray-500">
          {insights.length}個のモジュール
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div
            key={insight.moduleId}
            className="animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`bg-gradient-to-r ${insight.color} rounded-xl p-[2px] h-full`}>
              <div className="bg-white rounded-xl p-5 h-full">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {insight.moduleName}
                  </h3>
                </div>
                <div className="space-y-1">
                  {insight.findings.map((finding, i) => (
                    <div key={i} className="flex items-start text-xs">
                      <span className="text-blue-600 mr-1.5 flex-shrink-0">•</span>
                      <span className="text-gray-700">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
}
