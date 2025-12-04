import { ProfileAnalysisData } from '@/types/profile';
import { BarChart3 } from 'lucide-react';
import StrengthsList from './StrengthsList';
import ValuesCompatibility from './ValuesCompatibility';
import IndustryMatch from './IndustryMatch';

interface AnalysisResultsProps {
  data: ProfileAnalysisData;
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <div className="space-y-8">
      {/* ヘッダーセクション */}
      {/* ヘッダーセクション */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">マイページ分析結果</h1>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          あなたの自己分析・キャリア診断結果を包括的に可視化。就職活動の意思決定をサポートします
        </p>
      </div>

      {/* 1. 強み（詳細版） */}
      <StrengthsList data={data.strengths} />

      {/* 2. 価値観 */}
      <ValuesCompatibility data={data.valuesCompatibility} />

      {/* 3. 向いている業界・職種 */}
      <IndustryMatch data={data.industryMatch} />
    </div>
  );
}
