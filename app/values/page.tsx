'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ValuesDisplay from '@/components/ValuesDisplay';
import { ValueSnapshot } from '@/types';

export default function ValuesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<ValueSnapshot | null>(null);
  const [previous, setPrevious] = useState<ValueSnapshot | null>(null);

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/values');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('価値観の取得に失敗しました');
      }

      const data = await response.json();

      if (!data.current) {
        setError('まだ価値観が抽出されていません。対話を開始してください。');
        return;
      }

      setCurrent(data.current);
      setPrevious(data.previous);
    } catch (err) {
      console.error('Error fetching values:', err);
      setError(err instanceof Error ? err.message : '価値観の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">価値観を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            価値観がまだ抽出されていません
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'みかたくんと対話して、あなたの価値観を見つけましょう!'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
          >
            ← ホームに戻る
          </button>
          <h1 className="text-xl font-bold text-gray-800">価値観マップ</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ValuesDisplay current={current} previous={previous} />

        {/* Action buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
          >
            もっと対話する
          </button>
          <button
            onClick={fetchValues}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
          >
            更新
          </button>
        </div>
      </main>
    </div>
  );
}
