'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { firebaseAuth } from '@/lib/firebase-client';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (typeof window !== 'undefined' && isSignInWithEmailLink(firebaseAuth, window.location.href)) {
          let email = window.localStorage.getItem('emailForSignIn') || '';
          if (!email) {
            email = window.prompt('ログインに使用したメールアドレスを入力してください') || '';
          }

          if (!email) {
            setError('メールアドレスが必要です');
            setTimeout(() => router.push('/login'), 1500);
            return;
          }

          const result = await signInWithEmailLink(firebaseAuth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');

          if (result.user) {
            setTimeout(() => router.push('/'), 500);
            return;
          }
        }

        // トークンがない、または認証タイプが不明な場合
        console.log('⚠️ No valid auth params, checking existing session');
        const currentUser = firebaseAuth.currentUser;
        if (currentUser) {
          router.push('/');
          return;
        }

        router.push('/login');
      } catch (error) {
        console.error('❌ Callback error:', error);
        setError('認証処理中にエラーが発生しました');
        setTimeout(() => router.push('/login?error=認証エラー'), 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        {error ? (
          <>
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              エラーが発生しました
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {error}
            </p>
            <p className="text-gray-500 text-xs">
              ログインページにリダイレクトします...
            </p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              認証中...
            </h2>
            <p className="text-gray-600 text-sm">
              少々お待ちください
            </p>
          </>
        )}
      </div>
    </div>
  );
}
