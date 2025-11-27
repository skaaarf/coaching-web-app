import Link from 'next/link';
import { InteractiveModuleProgress, ModuleProgress } from '@/types';
import { useSelfAnalysis } from '@/hooks/useSelfAnalysis';

interface SelfAnalysisSectionProps {
  allProgress: Record<string, ModuleProgress>;
  allInteractiveProgress: Record<string, InteractiveModuleProgress>;
}

export default function SelfAnalysisSection({ allProgress, allInteractiveProgress }: SelfAnalysisSectionProps) {
  const {
    result,
    isGenerating,
    error,
    generate,
    totalDialogues,
  } = useSelfAnalysis({ allProgress, allInteractiveProgress });

  const hasData = !!result;
  const values = result?.values || [];
  const strengths = result?.strengths || [];
  const canGenerate = totalDialogues > 0 && !isGenerating;

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-[28px] border border-white/70 bg-gradient-to-br from-white via-white to-slate-50 px-6 py-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-gray-400">Self portrait</p>
              <h2 className="text-2xl font-semibold text-gray-900">あなたの自己分析結果</h2>
              <p className="text-sm text-gray-600 mt-2">
                対話とエピソードから、価値観と強みを抽出しました。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gray-900 text-white px-3 py-1 text-xs font-semibold shadow-sm">
                対話 {totalDialogues} 件
              </span>
            </div>
          </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={generate}
            disabled={!canGenerate}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow transition ${
              canGenerate
                ? 'bg-gray-900 text-white hover:bg-black'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                分析を実行中...
              </>
            ) : (
              <>結果を更新する</>
            )}
          </button>
          <Link
            href="/interactive/life-reflection"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
          >
            エピソード一覧に戻る
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!hasData && !error && totalDialogues === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-6 text-sm text-gray-700">
            まだ対話がありません。モジュールを1回進めると分析を実行できます。
          </div>
        )}
      </div>

      {hasData && result && (
        <div className="space-y-5">
          <SummaryCard summary={result.summary} />
          <ValuesCard items={values} />
          <StrengthsCard items={strengths} />
        </div>
      )}
    </section>
  );
}

function SummaryCard({ summary }: { summary: string }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <p className="text-xs uppercase tracking-[0.35em] text-gray-400 mb-2">Overview</p>
      <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">{summary || '分析結果を更新するとここに概要が表示されます。'}</h3>
    </div>
  );
}

function ValuesCard({ items }: { items: Array<{ title: string; description: string; evidences: string[] }> }) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-gradient-to-br from-indigo-50 via-white to-white px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-indigo-600">Values</p>
          <h3 className="text-xl font-semibold text-gray-900">あなたが大切にしていること</h3>
        </div>
        <span className="text-lg">💎</span>
      </div>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-indigo-100 bg-white px-4 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-indigo-600 text-lg">◆</div>
              <div className="flex-1 space-y-2">
                <div className="text-base font-semibold text-gray-900">{item.title}</div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                {item.evidences?.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1">このように表れています</p>
                    <ul className="space-y-1 text-sm text-gray-800">
                      {item.evidences.map((ev, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-[2px]">•</span>
                          <span>{ev.replace(/^•\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StrengthsCard({ items }: { items: Array<{ title: string; description: string; evidences: string[] }> }) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-gradient-to-br from-amber-50 via-white to-white px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-amber-600">Strengths</p>
          <h3 className="text-xl font-semibold text-gray-900">あなたの強み</h3>
        </div>
        <span className="text-lg">✨</span>
      </div>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-amber-100 bg-white px-4 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 text-lg">★</div>
              <div className="flex-1 space-y-2">
                <div className="text-base font-semibold text-gray-900">{item.title}</div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                {item.evidences?.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1">発揮されたエピソード</p>
                    <ul className="space-y-1 text-sm text-gray-800">
                      {item.evidences.map((ev, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 mt-[2px]">•</span>
                          <span>{ev.replace(/^•\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
