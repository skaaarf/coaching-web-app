'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROLE_MODELS, searchRoleModels, getAllTags } from '@/lib/role-models';

export default function RoleModelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const allTags = getAllTags();

  const filteredModels = ROLE_MODELS.filter(model => {
    // タグフィルタ
    if (selectedTag !== 'all' && !model.tags.includes(selectedTag)) {
      return false;
    }

    // 検索フィルタ
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        model.name.toLowerCase().includes(lowerQuery) ||
        model.furigana.toLowerCase().includes(lowerQuery) ||
        model.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        model.catchphrase.toLowerCase().includes(lowerQuery)
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <h1 className="text-lg font-bold text-gray-900">キャリアを学ぶ</h1>
            </div>
            <Link
              href="/"
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
            >
              ← ホーム
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="名前・キーワードで検索"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTag === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 mb-4">
          全{ROLE_MODELS.length}件中、{filteredModels.length}件を表示
        </div>

        {/* Role Models Grid */}
        {filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600">該当するロールモデルが見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModels.map(model => (
              <Link
                key={model.id}
                href={`/role-models/${model.id}`}
                className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{model.name}</h3>
                  <p className="text-xs text-gray-500">{model.furigana}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {model.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">{model.catchphrase}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
