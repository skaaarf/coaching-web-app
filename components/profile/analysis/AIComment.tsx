import { AICommentData } from '@/types/profile';
import Button from '@/components/ui/Button';
import { Download, Mail, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface AICommentProps {
  data: AICommentData;
}

export default function AIComment({ data }: AICommentProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">AIからの総合コメント</h2>
          <p className="text-xs text-gray-500">あなたの分析結果の総評</p>
        </div>
      </div>

      {/* 総評 */}
      <div className="mb-6 rounded-xl bg-gray-50 p-5 border border-gray-100">
        <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
      </div>

      {/* 就活での強み */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          就活での強み
        </h3>
        <ul className="space-y-2">
          {data.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-green-600 shrink-0 mt-0.5">•</span>
              <span className="text-gray-700 leading-relaxed">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 注意すべきポイント */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-bold text-gray-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          注意すべきポイント
        </h3>
        <ul className="space-y-2">
          {data.warnings.map((warning, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-orange-600 shrink-0 mt-0.5">•</span>
              <span className="text-gray-700 leading-relaxed">{warning}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* アクションボタン */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {data.downloadAvailable && (
            <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 h-10 text-sm">
              <Download className="h-4 w-4" />
              PDFでダウンロード
            </Button>
          )}
          {data.emailAvailable && (
            <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 h-10 text-sm">
              <Mail className="h-4 w-4" />
              メールで送る
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
