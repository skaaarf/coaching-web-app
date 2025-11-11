'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStorage } from '@/hooks/useStorage';
import { InteractiveModuleProgress } from '@/types';
import { CAREER_MODULES } from '@/lib/modules';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function DashboardPage() {
  const router = useRouter();
  const storage = useStorage();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allProgress, setAllProgress] = useState<Record<string, InteractiveModuleProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status and admin privileges
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        const userEmail = session.user.email;
        const isUserAdmin = userEmail === ADMIN_EMAIL;

        setUser(session.user);
        setIsAdmin(isUserAdmin);

        // Redirect non-admin users
        if (!isUserAdmin) {
          router.push('/');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        const userEmail = session.user.email;
        const isUserAdmin = userEmail === ADMIN_EMAIL;

        setUser(session.user);
        setIsAdmin(isUserAdmin);

        // Redirect non-admin users
        if (!isUserAdmin) {
          router.push('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const progress = await storage.getAllInteractiveModuleProgress();
        setAllProgress(progress);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) {
      loadData();
    }
  }, [storage, user, isAdmin]);

  // Filter modules that have dialogue history
  const modulesWithDialogue = Object.entries(allProgress)
    .filter(([moduleId, progress]) => {
      const data = progress.data as any;
      return data.phase === 'dialogue' && data.messages && data.messages.length > 0;
    })
    .sort((a, b) => {
      // Sort by last updated (most recent first)
      return new Date(b[1].lastUpdated).getTime() - new Date(a[1].lastUpdated).getTime();
    });

  // Calculate statistics
  const totalMessages = modulesWithDialogue.reduce((sum, [, progress]) => {
    const data = progress.data as any;
    return sum + (data.messages?.length || 0);
  }, 0);

  const completedModules = modulesWithDialogue.filter(([, progress]) => progress.completed).length;

  // Show loading or unauthorized state
  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 border-b border-purple-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  🔐 管理者ダッシュボード
                </h1>
                <span className="px-3 py-1 bg-yellow-400 text-purple-900 text-xs font-bold rounded-full uppercase">
                  Admin Only
                </span>
              </div>
              <p className="text-purple-100">ユーザーの対話履歴と統計情報</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors backdrop-blur-sm border border-white/30"
            >
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Info Card */}
        {user && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                {user.email?.[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{user.email?.split('@')[0]}</h2>
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                    ログイン済み
                  </span>
                </div>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">💬</div>
              <div>
                <p className="text-sm text-gray-600 font-medium">総メッセージ数</p>
                <p className="text-3xl font-bold text-gray-900">{totalMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">📝</div>
              <div>
                <p className="text-sm text-gray-600 font-medium">対話セッション</p>
                <p className="text-3xl font-bold text-gray-900">{modulesWithDialogue.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">✅</div>
              <div>
                <p className="text-sm text-gray-600 font-medium">完了済み</p>
                <p className="text-3xl font-bold text-gray-900">{completedModules}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>💭</span>
            <span>対話履歴</span>
          </h2>

          {modulesWithDialogue.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-gray-600 mb-6">まだ対話履歴がありません</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                <span>対話を始める</span>
                <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {modulesWithDialogue.map(([moduleId, progress]) => {
                const module = CAREER_MODULES.find(m => m.id === moduleId);
                if (!module) return null;

                const data = progress.data as any;
                const messageCount = data.messages?.length || 0;
                const lastMessage = data.messages?.[data.messages.length - 1];
                const lastMessagePreview = lastMessage?.content.substring(0, 200) || '';

                // Calculate user vs assistant message counts
                const userMessages = data.messages?.filter((m: any) => m.role === 'user').length || 0;
                const assistantMessages = data.messages?.filter((m: any) => m.role === 'assistant').length || 0;

                return (
                  <div
                    key={moduleId}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-5xl">{module.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-2 text-lg">
                            {module.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span>💬</span>
                              <span className="font-medium">{messageCount}件</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span>👤</span>
                              <span className="font-medium">{userMessages}件</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span>🤖</span>
                              <span className="font-medium">{assistantMessages}件</span>
                            </span>
                            <span>•</span>
                            <span className="font-medium">
                              {new Date(progress.lastUpdated).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {progress.completed && (
                        <span className="flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-green-100 text-green-800 border border-green-300">
                          ✓ 完了
                        </span>
                      )}
                    </div>

                    {/* Last message preview */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1 font-medium">最後のメッセージ:</p>
                      <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                        {lastMessage?.role === 'assistant' ? '🤖 ' : '👤 '}
                        {lastMessagePreview}
                        {lastMessage?.content.length > 200 ? '...' : ''}
                      </p>
                    </div>

                    <button
                      onClick={() => router.push(`/interactive/${moduleId}`)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-bold transition-all shadow-sm hover:shadow-md"
                    >
                      対話を続ける →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
