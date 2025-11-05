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
      const sortedResults = Object.entries(results)
        .sort(([, a], [, b]) => b - a);

      insights.push({
        moduleId: 'value-battle',
        moduleName: '価値観バトル',
        icon: '⚔️',
        color: 'from-blue-500 to-purple-600',
        findings: [
          `最重視: ${sortedResults[0][0]}`,
          `タイプ: ${sortedResults[0][1] >= 15 ? '明確な価値観' : sortedResults[0][1] >= 10 ? 'バランス型' : '多様な価値観'}`
        ]
      });
    }
  }

  // Life Simulator - show if result or dialogue phase
  if (interactiveProgress['life-simulator']) {
    const data = interactiveProgress['life-simulator'].data as any;
    if (data.phase === 'dialogue' || data.phase === 'result') {
      const selections = data.data as Record<string, string[]>;
      const aspectCounts: Record<string, number> = {};
      Object.values(selections).forEach(aspects => {
        aspects.forEach(aspect => {
          aspectCounts[aspect] = (aspectCounts[aspect] || 0) + 1;
        });
      });
      const sortedAspects = Object.entries(aspectCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2);

      const pathCounts = {
        A: selections.A?.length || 0,
        B: selections.B?.length || 0,
        C: selections.C?.length || 0
      };
      const preferredPath =
        pathCounts.A > pathCounts.B && pathCounts.A > pathCounts.C ? '安定志向' :
        pathCounts.B > pathCounts.C ? 'クリエイティブ志向' : '職人志向';

      insights.push({
        moduleId: 'life-simulator',
        moduleName: '人生シミュレーター',
        icon: '🎬',
        color: 'from-cyan-500 to-blue-600',
        findings: [
          `傾向: ${preferredPath}`,
          `重視: ${sortedAspects.map(([a]) => a).join('、')}`
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
