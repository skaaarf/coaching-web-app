import { AICommentData } from '@/types/profile';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface AICommentProps {
  data: AICommentData;
}

export default function AIComment({ data }: AICommentProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 p-6 shadow-lg shadow-purple-100 border border-white/70">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700 shadow-inner">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AIからの総合コメント</h2>
            <p className="text-xs text-gray-500">最新分析に基づく総評と提案</p>
          </div>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100 shadow-sm">
          Auto Generated
        </span>
      </div>

      <div className="mb-6 rounded-2xl bg-white/90 p-5 border border-purple-100 shadow-sm">
        <p className="text-sm leading-relaxed text-gray-800">{data.summary}</p>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          就活での強み
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {data.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2 text-sm rounded-xl bg-green-50/80 border border-green-100 px-3 py-2">
              <span className="text-green-600 shrink-0 mt-0.5">•</span>
              <span className="text-gray-800 leading-relaxed">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-sm font-bold text-gray-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          注意すべきポイント
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {data.warnings.map((warning, index) => (
            <li key={index} className="flex items-start gap-2 text-sm rounded-xl bg-orange-50/80 border border-orange-100 px-3 py-2">
              <span className="text-orange-600 shrink-0 mt-0.5">•</span>
              <span className="text-gray-800 leading-relaxed">{warning}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
