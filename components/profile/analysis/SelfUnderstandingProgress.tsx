import { SelfUnderstandingData } from '@/types/profile';
import Button from '@/components/ui/Button';
import { PieChart, Lightbulb, ArrowRight } from 'lucide-react';

interface SelfUnderstandingProgressProps {
  data: SelfUnderstandingData;
}

function renderStars(confidence: number): string {
  return '⭐'.repeat(confidence) + '☆'.repeat(5 - confidence);
}

export default function SelfUnderstandingProgress({ data }: SelfUnderstandingProgressProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <PieChart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">自己理解の完成度</h2>
            <p className="text-xs text-gray-500">あなたの分析進捗状況</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">
            {data.overallProgress}<span className="text-lg text-gray-500 font-normal ml-1">%</span>
          </div>
        </div>
      </div>

      {/* カテゴリ別進捗 */}
      <div className="mb-8 grid gap-3 md:grid-cols-2">
        {data.categories.map((category, index) => (
          <div key={index} className="rounded-xl bg-gray-50 p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900 text-sm">{category.name}</span>
              <span className="text-sm font-bold text-primary">{category.progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 mb-2">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${category.progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {category.count !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <span>•</span>
                  {category.count}件
                </span>
              )}
              {category.confidence !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <span>{renderStars(category.confidence)}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 次のおすすめ */}
      <div className="rounded-xl bg-yellow-50 p-5 border border-yellow-100">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-bold text-gray-900">次のおすすめアクション</span>
        </div>
        <div className="space-y-3">
          <p className="text-base font-bold text-gray-900">「{data.nextRecommendation.title}」</p>
          <p className="text-xs text-gray-700 leading-relaxed">{data.nextRecommendation.description}</p>
          <Button variant="primary" size="sm" className="mt-2 w-full sm:w-auto flex items-center justify-center gap-2">
            今すぐ始める
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
