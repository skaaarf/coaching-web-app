'use client';

import { LifeReflectionData } from '@/types';

interface Props {
  data: LifeReflectionData;
  onStartDialogue: () => void;
}

const LABELS: Record<string, string> = {
  highlight: 'いちばん嬉しかった瞬間',
  challenge: 'いちばん大変だったこと',
  lesson: 'そこから学んだこと',
  pride: '誇りに思えたこと',
  regret: '悔しかった・残念だったこと',
  support: '支えてくれた人とのエピソード',
  conflict: '摩擦や衝突があった出来事',
  decision: '大きな決断とその理由',
  future: 'この経験を未来でどう活かしたいか',
};

export default function LifeReflectionResult({ data, onStartDialogue }: Props) {
  const era =
    data.eras.elementary ||
    data.eras.middleschool ||
    data.eras.highschool ||
    data.eras.college ||
    data.eras.working;

  const rows = era?.questionResponses || [];

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-10 space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-sm text-gray-500">シンプルまとめ</p>
            <h2 className="text-xl font-bold text-gray-900">人生のメモ</h2>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          書いた3つのメモを整理しました。気になるところをAIと一緒に深掘りしましょう。
        </p>
      </div>

      <div className="space-y-3">
        {rows.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-4 text-sm text-gray-500">
            まだメモがありません。AIと話してみると、簡単に書き出せます。
          </div>
        )}
        {rows.map((row) => (
          <div key={row.questionId} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-blue-700 mb-1">
              {LABELS[row.questionId] || row.questionId}
            </p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{row.response}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">今の満足度</p>
          <p className="text-3xl font-bold text-blue-600">{era?.satisfaction ?? 5}/10</p>
        </div>
        <button
          onClick={onStartDialogue}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors"
        >
          💬 この内容で話す
        </button>
      </div>
    </div>
  );
}
