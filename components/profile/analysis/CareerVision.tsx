import { CareerVisionData } from '@/types/profile';
import ProgressBar from '../shared/ProgressBar';
import { Rocket, Target, Flag, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface CareerVisionProps {
  data: CareerVisionData;
}

export default function CareerVision({ data }: CareerVisionProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
          <Rocket className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">キャリアビジョン</h2>
          <p className="text-xs text-gray-500">あなたのキャリア・アンカーと将来像</p>
        </div>
      </div>

      {/* 核となるキャリア・アンカー */}
      <div className="mb-8 rounded-xl bg-cyan-50 p-5 border border-cyan-100">
        <h3 className="mb-2 text-xs font-bold text-cyan-700">核となるキャリア・アンカー</h3>
        <p className="text-lg font-bold text-gray-900">
          「{data.coreAnchors.join('」×「')}」タイプ
        </p>
      </div>

      <div className="mb-6 border-t border-gray-200" />

      {/* アンカー診断Top3 */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-bold text-gray-900 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          アンカー診断（Top3）
        </h3>
        <div className="space-y-4">
          {data.anchorRanking.map((anchor, index) => (
            <div key={index}>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{index + 1}位：{anchor.name}</span>
              </div>
              <ProgressBar
                value={(anchor.score / 10) * 100}
                color="bg-primary"
                showLabel={false}
              />
              <p className="mt-1 pl-4 text-xs text-gray-600">
                └ {anchor.description} ({anchor.score}/10)
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 border-t border-gray-200" />

      {/* 手放したくない機会 */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-bold text-gray-900">【あなたが手放したくない機会】</h3>
        <ul className="space-y-2">
          {data.opportunities.map((opportunity, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">{opportunity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 苦手なこと */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-bold text-orange-600">逆に苦手なこと</h3>
        <ul className="space-y-1 pl-4">
          {data.challenges.map((challenge, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">{challenge}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 border-t border-gray-200" />

      {/* 3年後・10年後の姿 */}
      <div className="mb-4 space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-bold text-gray-900">【3年後の姿】</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{data.vision3Years}</p>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold text-gray-900">【10年後の姿】</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{data.vision10Years}</p>
        </div>
      </div>

      <div className="mb-6 border-t border-gray-200" />

      {/* 伸ばしたいスキル */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-bold text-gray-900">【今後伸ばしたいスキル】</h3>
        <ul className="grid grid-cols-2 gap-2">
          {data.skillsToGrow.map((skill, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">{skill}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 border-t border-gray-200" />

      {/* 注意書き */}
      <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
        キャリア・アンカーは経験を通じて変化することもあります。定期的に見直すことが大切です。
      </div>
    </div>
  );
}
