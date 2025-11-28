'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const auth = firebaseAuth;
    if (!auth) {
      setError('Firebase auth が初期化されていません');
      setLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('ログインしました');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('アカウントを作成しました');
      }
      router.push('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : null;
      setError(errorMessage || '認証に失敗しました');
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
            メールアドレスとパスワードでログインします
          </p>
        </div>

        <form onSubmit={handleEmailPassword} className="space-y-4">
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
              {isLoginMode ? '登録済みのメールアドレスを入力してください' : '新しいアカウントを作成します'}
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="6文字以上のパスワード"
            />
            <p className="mt-2 text-xs text-gray-600">
              {isLoginMode ? 'パスワードを入力してください' : '新しいパスワードを設定します'}
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
            {loading ? '処理中...' : isLoginMode ? 'ログイン' : 'アカウントを作成'}
          </button>

          <button
            type="button"
            onClick={() => setIsLoginMode((prev) => !prev)}
            className="w-full text-sm text-blue-700 hover:text-blue-900 font-medium underline"
          >
            {isLoginMode ? '初めての方はこちら（新規登録）' : '既にアカウントをお持ちの方はこちら'}
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
          <h3 className="text-sm font-semibold text-gray-900 mb-2">ログインに関するヒント</h3>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>✓ パスワードは6文字以上で設定してください</li>
            <li>✓ パスワードを忘れた場合は新規登録し直すか、管理者に連絡してください</li>
            <li>✓ 管理者用メールでログインするとダッシュボードにアクセスできます</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
