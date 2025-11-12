'use client';

import { use } from 'react';
import Link from 'next/link';
import { getRoleModelById } from '@/lib/role-models';
import { useRouter } from 'next/navigation';

export default function RoleModelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const model = getRoleModelById(id);

  if (!model) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-gray-600 mb-4">ロールモデルが見つかりませんでした</p>
          <Link
            href="/role-models"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
          >
            一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
            >
              ← 戻る
            </button>
            <Link
              href="/role-models"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              一覧へ
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{model.name}</h1>
            <p className="text-sm text-gray-500">{model.furigana}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {model.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-lg font-medium text-gray-900 leading-relaxed">{model.catchphrase}</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">紹介文</h2>
          <p className="text-gray-700 leading-relaxed">{model.introduction}</p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">人生年表</h2>
          <div className="space-y-4">
            {model.timeline.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700 font-bold text-lg">{item.age}歳</span>
                  </div>
                </div>
                <div className="flex-1 pt-3">
                  <p className="text-gray-700">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">インタビュー</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-2">
                Q1：どんな進路を選択して今なにしてる？
              </h3>
              <p className="text-gray-700 leading-relaxed">{model.interview.q1}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-2">
                Q2：その進路を選んだ理由・背景は？
              </h3>
              <p className="text-gray-700 leading-relaxed">{model.interview.q2}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-2">
                Q3：その進路選択ズバリ何点？それってなぜ？
              </h3>
              <p className="text-gray-700 leading-relaxed">{model.interview.q3}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-2">
                Q4：その進路を選んだことで得たものと失ったものは？
              </h3>
              <p className="text-gray-700 leading-relaxed">{model.interview.q4}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-2">
                Q5：あなたの生き方や進路に対する考え方が変わった経験は？
              </h3>
              <p className="text-gray-700 leading-relaxed">{model.interview.q5}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-2">
                Q6：自分らしい生き方の見つけ方のアドバイスは？
              </h3>
              <p className="text-gray-700 leading-relaxed">{model.interview.q6}</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors"
          >
            ← 一覧に戻る
          </button>
        </div>
      </main>
    </div>
  );
}
