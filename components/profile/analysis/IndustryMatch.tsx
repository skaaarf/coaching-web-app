import { IndustryMatchData } from '@/types/profile';
import { Target, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

interface IndustryMatchProps {
  data: IndustryMatchData;
}

function renderStars(score: number): string {
  const stars = Math.round(score / 20); // 100点満点を5段階に変換
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

function getRankEmoji(rank: number): string {
  return `${rank}`;
}

export default function IndustryMatch({ data }: IndustryMatchProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-green-50 p-6 shadow-lg shadow-emerald-100 border border-white/70">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700 shadow-inner">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">向いている業界・職種</h2>
            <p className="text-xs text-gray-500">あなたにマッチするTop{data.matches.length}の業界</p>
          </div>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100 shadow-sm">
          マッチ度ハイライト
        </span>
      </div>

      <div className="space-y-5">
        {data.matches.map((match, index) => (
          <div
            key={index}
            className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold text-lg">
                  {match.rank}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{match.industry}</h3>
                  <p className="text-xs text-gray-500">想定職種: {match.positions.join(' / ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-sm">{renderStars(match.matchScore)}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 border border-emerald-100">
                  {match.matchScore}%
                </span>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="mb-2 text-sm font-bold text-gray-900">【マッチ理由】</h4>
              <ul className="grid gap-2 sm:grid-cols-2">
                {match.matchReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm rounded-xl bg-emerald-50/70 border border-emerald-100 px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {match.warnings && match.warnings.length > 0 && (
              <div className="mb-3 space-y-1.5">
                {match.warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm rounded-xl bg-orange-50/80 border border-orange-100 px-3 py-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{warning}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-2">
              <h4 className="mb-2 text-sm font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                代表企業
              </h4>
              <p className="text-sm text-gray-700 pl-6">{match.companies.join('、')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
