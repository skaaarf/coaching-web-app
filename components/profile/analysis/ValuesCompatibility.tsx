import { ValuesCompatibilityData } from '@/types/profile';
import SliderBar from '../shared/SliderBar';
import { Compass, CheckCircle2, AlertCircle } from 'lucide-react';

interface ValuesCompatibilityProps {
  data: ValuesCompatibilityData;
}

export default function ValuesCompatibility({ data }: ValuesCompatibilityProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 shadow-lg shadow-indigo-100 border border-white/70">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 shadow-inner">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">価値観＋働き方の相性</h2>
            <p className="text-xs text-gray-500">意思決定の軸と環境のフィット感</p>
          </div>
        </div>
        <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100 shadow-sm">
          Top {data.values.length}
        </div>
      </div>

      {/* あなたが大切にしたいこと */}
      <div className="mb-8 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-l-4 border-primary pl-3">あなたが大切にしたいこと</h3>
        <div className="grid gap-3">
          {data.values.map((value, index) => (
            <div key={value.id} className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 border border-indigo-100">
                    0{index + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900">{value.title}</h4>
                </div>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                  スコア {value.score}/10
                </span>
              </div>
              <SliderBar
                score={value.score}
                leftLabel={value.leftLabel}
                rightLabel={value.rightLabel}
              />
              <div className="mt-3 space-y-1 text-xs text-gray-600 leading-relaxed">
                <p>└ {value.description}</p>
                {value.anchorRelation && value.anchorRelation.length > 0 && (
                  <p className="text-indigo-700 font-semibold">
                    キャリア・アンカー：{value.anchorRelation.join('、')}
                  </p>
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
              <li key={index} className="flex items-start gap-2 text-sm rounded-xl bg-white/80 border border-green-100 px-3 py-2">
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
              <li key={index} className="flex items-start gap-2 text-sm rounded-xl bg-white/80 border border-orange-100 px-3 py-2">
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
