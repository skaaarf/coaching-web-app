import { CareerTypeData } from '@/types/profile';
import { Tag, Calendar, CheckCircle2, Star } from 'lucide-react';

interface CareerTypeCardProps {
  data: CareerTypeData;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
}

export default function CareerTypeCard({ data }: CareerTypeCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Tag className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">あなたのキャリアタイプ</h2>
      </div>

      <div className="mb-6 rounded-xl bg-gray-50 p-5 border border-gray-100">
        <h3 className="mb-2 text-xl font-bold text-primary">
          {data.type}
        </h3>
        <p className="text-sm leading-relaxed text-gray-700">{data.description}</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 p-4">
          <span className="block text-xs font-bold text-gray-500 mb-2">キャリア・アンカー</span>
          <div className="flex flex-wrap gap-2">
            {data.anchors.map((anchor, index) => (
              <span key={index} className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                {anchor}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 p-4">
          <span className="block text-xs font-bold text-gray-500 mb-2">強み</span>
          <div className="flex flex-wrap gap-2">
            {data.strengths.map((strength, index) => (
              <span key={index} className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 border border-orange-100">
                {strength}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 justify-end">
          <Calendar className="h-3 w-3" />
          <span>最終更新：{formatDate(data.lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
}
