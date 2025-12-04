import { ValuesCompatibilityData } from '@/types/profile';
import SliderBar from '../shared/SliderBar';
import { Compass, CheckCircle2, AlertCircle } from 'lucide-react';

interface ValuesCompatibilityProps {
  data: ValuesCompatibilityData;
}

export default function ValuesCompatibility({ data }: ValuesCompatibilityProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Compass className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">価値観＋働き方の相性</h2>
          <p className="text-xs text-gray-500">あなたの価値観と働き方の傾向</p>
        </div>
      </div>

      {/* あなたが大切にしたいこと */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-bold text-gray-900 border-l-4 border-primary pl-3">あなたが大切にしたいこと</h3>
        <div className="space-y-4">
          {data.values.map((value, index) => (
            <div key={value.id} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                ①{index + 1} {value.title}
              </h4>
              <SliderBar
                score={value.score}
                leftLabel={value.leftLabel}
                rightLabel={value.rightLabel}
              />
              <div className="pl-4 space-y-1 text-xs text-gray-600">
                <p>└ {value.description}</p>
                {value.anchorRelation && value.anchorRelation.length > 0 && (
                  <p>└ キャリア・アンカー：{value.anchorRelation.join('、')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 border-t border-gray-200" />

      {/* 働き方の相性 */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-bold text-gray-900 border-l-4 border-primary pl-3">働き方の相性</h3>
        <div className="space-y-3">
          {data.workStyleAxes.map((axis) => (
            <SliderBar
              key={axis.name}
              score={axis.score}
              leftLabel={axis.leftLabel}
              rightLabel={axis.rightLabel}
            />
          ))}
        </div>
      </div>

      <div className="mb-6 border-t border-gray-200" />

      {/* 合う環境・合わない環境 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-900">【合う環境】</h3>
          <ul className="space-y-2">
            {data.suitableEnvironments.map((env, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <span className="text-gray-700">{env}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-900">【合わない環境】</h3>
          <ul className="space-y-2">
            {data.unsuitableEnvironments.map((env, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                <span className="text-gray-700">{env}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
