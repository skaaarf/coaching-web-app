'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage('ログインリンクをメールで送信しました！メールを確認してください。');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'ログインリンクの送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            みかたくん
          </h1>
          <p className="text-gray-800 font-medium">
            ログイン
          </p>
          <p className="text-gray-600 text-sm mt-2">
            パスワード不要！メールアドレスだけでログインできます
          </p>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="example@email.com"
            />
            <p className="mt-2 text-xs text-gray-600">
              ログインリンクをメールで送信します
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm font-medium">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'メールを送信中...' : 'ログインリンクを送信'}
          </button>
        </form>

        <div className="mt-6">
          <Link
            href="/"
            className="w-full block text-center bg-gray-100 border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            ログインせずに使う
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-700">
          <p className="text-xs">
            利用することで、利用規約とプライバシーポリシーに同意したことになります。
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">マジックリンク認証とは？</h3>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>✓ パスワード不要で安全</li>
            <li>✓ メールに届くリンクをクリックするだけ</li>
            <li>✓ パスワードを忘れる心配なし</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
