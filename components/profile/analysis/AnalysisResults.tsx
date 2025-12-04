import { ProfileAnalysisData } from '@/types/profile';
import { BarChart3, Clock3, Target, Sparkles, ShieldCheck } from 'lucide-react';
import StrengthsList from './StrengthsList';
import ValuesCompatibility from './ValuesCompatibility';
import IndustryMatch from './IndustryMatch';
import AIComment from './AIComment';
import UpdateHistory from './UpdateHistory';

interface AnalysisResultsProps {
  data: ProfileAnalysisData;
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  const topIndustry = data.industryMatch.matches[0];
  const topStrength = data.strengths.strengths[0];
  const lastUpdated =
    data.updateHistory.history[0]?.date || data.careerType.lastUpdated;

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="space-y-10">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-8 shadow-lg shadow-indigo-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-blue-200/20 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <BarChart3 className="h-4 w-4" />
              マイページ分析結果
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              あなたの現在地を、一目で。
            </h1>
            <p className="max-w-2xl text-sm text-gray-600 leading-relaxed">
              対話データから抽出した強み・価値観・マッチ業界をまとめました。アップデートされた結果をもとに、次の一歩を検討してみましょう。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur">
            <div className="space-y-1 rounded-xl border border-gray-100 bg-gray-50/70 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Sparkles className="h-4 w-4 text-primary" />
                自己理解の完成度
              </div>
              <div className="text-2xl font-bold text-primary">{data.selfUnderstanding.overallProgress}%</div>
            </div>
            <div className="space-y-1 rounded-xl border border-gray-100 bg-gray-50/70 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                強み
              </div>
              <div className="text-2xl font-bold text-gray-900">{data.strengths.totalCount}件</div>
            </div>
            <div className="space-y-1 rounded-xl border border-gray-100 bg-gray-50/70 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Target className="h-4 w-4 text-blue-600" />
                注目の業界
              </div>
              <div className="text-sm font-bold text-gray-900">
                {topIndustry?.industry || '分析中'}
              </div>
              <p className="text-[11px] text-gray-500">
                マッチ度 {topIndustry?.matchScore ?? '--'}%
              </p>
            </div>
            <div className="space-y-1 rounded-xl border border-gray-100 bg-gray-50/70 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Clock3 className="h-4 w-4 text-gray-500" />
                最終更新
              </div>
              <div className="text-sm font-bold text-gray-900">
                {lastUpdated ? formatDate(lastUpdated) : '—'}
              </div>
              <p className="text-[11px] text-gray-500">トップ強み: {topStrength?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="space-y-8">
        {/* 総合コメントを最上部に */}
        <AIComment data={data.aiComment} />

        {/* 強み・価値観 */}
        <div className="grid gap-6 xl:grid-cols-2">
          <StrengthsList data={data.strengths} />
          <ValuesCompatibility data={data.valuesCompatibility} />
        </div>

        {/* 業界・職種マッチ */}
        <IndustryMatch data={data.industryMatch} />

        {/* 更新履歴 */}
        <UpdateHistory data={data.updateHistory} />
      </div>
    </div>
  );
}
