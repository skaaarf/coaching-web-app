import { UpdateHistoryData } from '@/types/profile';
import Button from '@/components/ui/Button';
import { ChevronRight, History, Calendar } from 'lucide-react';

interface UpdateHistoryProps {
  data: UpdateHistoryData;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
}

export default function UpdateHistory({ data }: UpdateHistoryProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
          <History className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">更新履歴</h2>
          <p className="text-xs text-gray-500">あなたの分析結果の変更記録</p>
        </div>
      </div>

      <div className="relative space-y-6">
        {/* タイムライン */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-gray-200" />

        {data.history.map((item, index) => (
          <div key={index} className="relative pl-14">
            {/* タイムラインドット */}
            <div className="absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-md border-4 border-white">
              <span className="text-white font-bold text-sm">{index + 1}</span>
            </div>

            {/* コンテンツ */}
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">{formatDate(item.date)}</h3>
              </div>
              <ul className="space-y-2">
                {item.changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-primary shrink-0 mt-0.5">●</span>
                    <span className="leading-relaxed">{change.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {data.hasMore && (
        <div className="mt-8 pt-6 border-t-2 border-gray-100">
          <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-primary/5 transition-colors py-3 rounded-xl">
            すべての履歴を見る
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
