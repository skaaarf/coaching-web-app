import { mockProfileAnalysisData } from '@/data/mockProfileAnalysis';
import { IndustryMatchData, ProfileAnalysisData, StrengthsData, ValuesCompatibilityData } from '@/types/profile';

const toBoundedNumber = (value: any, fallback: number, min: number, max: number) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
};

/**
 * APIから返る簡易な分析結果を、UIで期待するリッチな構造に寄せる
 * - 足りない項目はモックデータをベースに補完する
 * - 数値などは安全な範囲に丸める
 * - 前回の分析結果を受け取り、更新履歴を積み上げる
 */
export function normalizeProfileAnalysis(raw: any, previous?: ProfileAnalysisData): ProfileAnalysisData {
  const base = JSON.parse(JSON.stringify(mockProfileAnalysisData)) as ProfileAnalysisData;
  const now = new Date().toISOString();

  const strengths: StrengthsData =
    Array.isArray(raw?.strengths) && raw.strengths.length > 0
      ? {
          totalCount: raw.strengths.length,
          strengths: raw.strengths.map((s: any, idx: number) => {
            const rating = toBoundedNumber(s.rating ?? 4, 4, 1, 5);
            const baseStrength = base.strengths.strengths[idx % base.strengths.strengths.length];
            return {
              id: s.id || `ai-strength-${idx + 1}`,
              name: s.name || s.title || `強み${idx + 1}`,
              rating,
              ratingText: `${rating}.0/5.0`,
              description: s.description || baseStrength.description,
              typicalBehaviors: Array.isArray(s.typicalBehaviors) ? s.typicalBehaviors : [],
              episodes: Array.isArray(s.episodes) ? s.episodes : [],
              lastUpdated: now,
              needsMoreEpisodes: s.needsMoreEpisodes ?? baseStrength.needsMoreEpisodes,
            };
          }),
        }
      : base.strengths;

  const valueMatches = raw?.valuesCompatibility?.matches;
  const valuesCompatibility: ValuesCompatibilityData =
    Array.isArray(valueMatches) && valueMatches.length > 0
      ? {
          ...base.valuesCompatibility,
          values: valueMatches.map((v: any, idx: number) => ({
            id: v.id || `ai-value-${idx + 1}`,
            title: v.value || v.title || `価値観${idx + 1}`,
            score: toBoundedNumber(v.score ?? 7, 7, 1, 10),
            leftLabel: v.leftLabel || '低い',
            rightLabel: v.rightLabel || '高い',
            description: v.reason || v.description || '理由を整理しています。',
            anchorRelation: Array.isArray(v.anchorRelation) ? v.anchorRelation : [],
          })),
        }
      : base.valuesCompatibility;

  const industries = raw?.industryMatch?.industries;
  const jobTypes = raw?.industryMatch?.jobTypes;
  const industryMatch: IndustryMatchData =
    Array.isArray(industries) && industries.length > 0
      ? {
          matches: industries.map((ind: any, idx: number) => {
            const baseMatch = base.industryMatch.matches[idx % base.industryMatch.matches.length];
            const matchScore = toBoundedNumber(ind.matchScore ?? 70, 70, 0, 100);
            const jobTypeName = jobTypes?.[idx]?.name;
            return {
              rank: idx + 1,
              industry: ind.name || `業界${idx + 1}`,
              positions: Array.isArray(ind.positions)
                ? ind.positions
                : jobTypeName
                  ? [jobTypeName]
                  : baseMatch.positions,
              matchScore,
              matchReasons: Array.isArray(ind.reason) ? ind.reason : [ind.reason || '理由を整理しています。'],
              warnings: Array.isArray(ind.warnings) ? ind.warnings : [],
              companies: Array.isArray(ind.companies) ? ind.companies : baseMatch.companies,
            };
          }),
        }
      : base.industryMatch;

  // 更新履歴はモックではなく、実際の履歴のみを積み上げる
  const previousHistory = previous?.updateHistory?.history || [];
  const hasMore = previous?.updateHistory?.hasMore ?? false;

  return {
    ...base,
    strengths,
    valuesCompatibility,
    industryMatch,
    careerType: { ...base.careerType, lastUpdated: now },
    updateHistory: {
      ...base.updateHistory,
      hasMore,
      history: [
        { date: now, changes: [{ category: 'AI分析', description: '最新の対話内容で分析を更新' }] },
        ...previousHistory,
      ],
    },
  };
}
