import { IndustryMatchData } from '@/types/profile';
import Button from '@/components/ui/Button';
import { FileText, Target, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

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
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
          <Target className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">向いている業界・職種</h2>
          <p className="text-xs text-gray-500">あなたにマッチするTop{data.matches.length}の業界</p>
        </div>
      </div>

      <div className="space-y-6">
        {data.matches.map((match, index) => (
          <div key={index}>
            {index > 0 && <div className="mb-6 border-t-2 border-gray-100" />}

            <div className="rounded-xl bg-white border border-gray-200 p-5 hover:border-green-200 transition-colors">
              {/* ヘッダー */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-700 font-bold text-lg">
                    {match.rank}
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{match.industry}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400 text-sm">
                    {renderStars(match.matchScore)}
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {match.matchScore}%
                  </span>
                </div>
              </div>

              {/* 想定職種 */}
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-medium">想定職種：</span>
                {match.positions.join(' / ')}
              </p>

              {/* マッチ度 */}
              <div className="mb-4 flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-500">マッチ度：</span>
                <span className="text-yellow-400">{renderStars(match.matchScore)}</span>
                <span className="font-bold text-green-600">{match.matchScore}%</span>
              </div>

              {/* マッチ理由 */}
              <div className="mb-3">
                <h4 className="mb-2 text-sm font-bold text-gray-900">【マッチ理由】</h4>
                <ul className="space-y-1.5">
                  {match.matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 注意点 */}
              {match.warnings && match.warnings.length > 0 && (
                <div className="mb-3">
                  <ul className="space-y-1.5">
                    {match.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 代表企業 */}
              <div className="mb-3">
                <h4 className="mb-2 text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  代表企業
                </h4>
                <p className="text-sm text-gray-700 pl-6">{match.companies.join('、')}</p>
              </div>

              {/* ES例を見るボタン */}
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                この職種向けのES例を見る
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* フッターリンク */}
      <div className="mt-6 border-t border-gray-200 pt-6 flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1 text-sm">
          すべての業界を見る
        </Button>
        <Button variant="primary" className="flex-1 text-sm">
          この結果をもとにESを作成する
        </Button>
      </div>
    </div>
  );
}
