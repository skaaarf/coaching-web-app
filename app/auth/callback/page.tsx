'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // マジックリンクのトークンをセッションに交換
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('🔐 Auth callback triggered', { type, hasAccessToken: !!accessToken });

        if (type === 'magiclink' || type === 'recovery') {
          if (accessToken && refreshToken) {
            // トークンを使ってセッションを確立
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('❌ Session error:', error);
              setError(error.message);
              setTimeout(() => router.push('/login?error=認証に失敗しました'), 2000);
              return;
            }

            if (data.session) {
              console.log('✅ Session established:', data.session.user.email);
              // セッション確立成功、ホームへリダイレクト
              setTimeout(() => router.push('/'), 1000);
              return;
            }
          }
        }

        // トークンがない、または認証タイプが不明な場合
        console.log('⚠️ No valid auth params, checking existing session');
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {
          console.log('✅ Existing session found');
          router.push('/');
        } else {
          console.log('❌ No session found');
          router.push('/login');
        }
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
