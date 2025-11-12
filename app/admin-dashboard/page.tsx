'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ModuleProgress, InteractiveModuleProgress, ValueSnapshot } from '@/types';
import { CAREER_MODULES } from '@/lib/modules';

interface AllData {
  chatSessions: Record<string, ModuleProgress[]>;
  interactiveSessions: Record<string, InteractiveModuleProgress[]>;
  valueSnapshots: ValueSnapshot[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [allData, setAllData] = useState<AllData>({
    chatSessions: {},
    interactiveSessions: {},
    valueSnapshots: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'chat' | 'interactive'>('all');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    try {
      setLoading(true);

      // Load all sessions from localStorage
      const sessionsKey = 'mikata-sessions';
      const rawSessions = localStorage.getItem(sessionsKey);

      if (rawSessions) {
        const sessions = JSON.parse(rawSessions);

        // Separate chat and interactive sessions
        const chatSessions: Record<string, ModuleProgress[]> = {};
        const interactiveSessions: Record<string, InteractiveModuleProgress[]> = {};

        Object.entries(sessions).forEach(([key, sessionArray]: [string, any]) => {
          if (Array.isArray(sessionArray) && sessionArray.length > 0) {
            const [moduleId, _] = key.split(':');

            // Check if it's interactive module by looking at the data structure
            const firstSession = sessionArray[0];
            if (firstSession.data && typeof firstSession.data === 'object') {
              // Interactive module
              interactiveSessions[moduleId] = sessionArray;
            } else {
              // Chat module
              chatSessions[moduleId] = sessionArray;
            }
          }
        });

        setAllData({
          chatSessions,
          interactiveSessions,
          valueSnapshots: []
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const getTotalSessions = () => {
    const chatCount = Object.values(allData.chatSessions).reduce((sum, sessions) => sum + sessions.length, 0);
    const interactiveCount = Object.values(allData.interactiveSessions).reduce((sum, sessions) => sum + sessions.length, 0);
    return chatCount + interactiveCount;
  };

  const getTotalMessages = () => {
    let total = 0;

    // Chat messages
    Object.values(allData.chatSessions).forEach(sessions => {
      sessions.forEach(session => {
        total += session.messages?.length || 0;
      });
    });

    // Interactive messages
    Object.values(allData.interactiveSessions).forEach(sessions => {
      sessions.forEach(session => {
        const data = session.data as any;
        if (data.phase === 'dialogue' && data.messages) {
          total += data.messages.length;
        }
      });
    });

    return total;
  };

  const getUniqueUsers = () => {
    // Since we're using localStorage, this is always 1 (current user)
    // In a real multi-user system, you'd count unique user IDs
    return 1;
  };

  // Filter and search
  const getAllSessions = () => {
    const sessions: Array<{
      type: 'chat' | 'interactive';
      moduleId: string;
      session: ModuleProgress | InteractiveModuleProgress;
    }> = [];

    // Add chat sessions
    if (filterType === 'all' || filterType === 'chat') {
      Object.entries(allData.chatSessions).forEach(([moduleId, sessionArray]) => {
        if (filterModule === 'all' || filterModule === moduleId) {
          sessionArray.forEach(session => {
            sessions.push({ type: 'chat', moduleId, session });
          });
        }
      });
    }

    // Add interactive sessions
    if (filterType === 'all' || filterType === 'interactive') {
      Object.entries(allData.interactiveSessions).forEach(([moduleId, sessionArray]) => {
        if (filterModule === 'all' || filterModule === moduleId) {
          sessionArray.forEach(session => {
            sessions.push({ type: 'interactive', moduleId, session });
          });
        }
      });
    }

    // Filter by search query
    if (searchQuery) {
      return sessions.filter(({ session, type }) => {
        const lowerQuery = searchQuery.toLowerCase();

        if (type === 'chat') {
          const chatSession = session as ModuleProgress;
          return chatSession.messages?.some(m =>
            m.content.toLowerCase().includes(lowerQuery)
          );
        } else {
          const interactiveSession = session as InteractiveModuleProgress;
          const data = interactiveSession.data as any;
          if (data.phase === 'dialogue' && data.messages) {
            return data.messages.some((m: any) =>
              m.content.toLowerCase().includes(lowerQuery)
            );
          }
        }
        return false;
      });
    }

    // Sort by last updated
    return sessions.sort((a, b) => {
      const dateA = new Date(a.session.lastUpdated).getTime();
      const dateB = new Date(b.session.lastUpdated).getTime();
      return dateB - dateA;
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-export-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSessions = getAllSessions();

  if (loading) {
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
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 border-b border-purple-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  🔐 管理者ダッシュボード
                </h1>
                <span className="px-2 py-1 bg-yellow-400 text-purple-900 text-xs font-bold rounded-full uppercase">
                  Admin
                </span>
              </div>
              <p className="text-purple-100 text-sm">全ユーザーの対話履歴と統計情報</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm"
              >
                📥 エクスポート
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors backdrop-blur-sm border border-white/30 text-sm"
              >
                ← ホーム
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-3xl">👥</div>
              <div>
                <p className="text-xs text-gray-600 font-medium">ユーザー数</p>
                <p className="text-2xl font-bold text-gray-900">{getUniqueUsers()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📝</div>
              <div>
                <p className="text-xs text-gray-600 font-medium">総セッション</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalSessions()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💬</div>
              <div>
                <p className="text-xs text-gray-600 font-medium">総メッセージ</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalMessages()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <p className="text-xs text-gray-600 font-medium">平均メッセージ/セッション</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getTotalSessions() > 0 ? Math.round(getTotalMessages() / getTotalSessions()) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 検索
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="メッセージ内容で検索..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📁 モジュール
              </label>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">全てのモジュール</option>
                {CAREER_MODULES.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.icon} {module.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 タイプ
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">全てのタイプ</option>
                <option value="chat">チャット</option>
                <option value="interactive">ゲーム</option>
              </select>
            </div>
          </div>
        </div>

        {/* Session List */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>💭</span>
              <span>セッション履歴</span>
              <span className="text-sm font-normal text-gray-500">
                ({filteredSessions.length}件)
              </span>
            </h2>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🤔</div>
              <p className="text-gray-600 mb-2">
                {searchQuery || filterModule !== 'all' || filterType !== 'all'
                  ? '条件に一致するセッションがありません'
                  : 'まだセッションがありません'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map(({ type, moduleId, session }, index) => {
                const module = CAREER_MODULES.find(m => m.id === moduleId);
                if (!module) return null;

                const messages = type === 'chat'
                  ? (session as ModuleProgress).messages
                  : ((session as InteractiveModuleProgress).data as any).messages || [];

                const messageCount = messages.length;
                const lastMessage = messages[messages.length - 1];
                const userMessages = messages.filter((m: any) => m.role === 'user').length;
                const assistantMessages = messages.filter((m: any) => m.role === 'assistant').length;

                const firstUserMessage = messages.find((m: any) => m.role === 'user');
                const sessionTitle = firstUserMessage
                  ? firstUserMessage.content.substring(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '')
                  : `セッション ${index + 1}`;

                return (
                  <div
                    key={`${type}-${moduleId}-${session.sessionId}`}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-4xl">{module.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-base">
                              {module.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              type === 'chat'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {type === 'chat' ? 'チャット' : 'ゲーム'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{sessionTitle}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span>💬</span>
                              <span className="font-medium">{messageCount}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span>👤</span>
                              <span className="font-medium">{userMessages}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span>🤖</span>
                              <span className="font-medium">{assistantMessages}</span>
                            </span>
                            <span>•</span>
                            <span className="font-medium">
                              {new Date(session.lastUpdated).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {session.completed && (
                        <span className="flex-shrink-0 inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                          ✓ 完了
                        </span>
                      )}
                    </div>

                    {/* Last message preview */}
                    {lastMessage && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1 font-medium">最後のメッセージ:</p>
                        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                          {lastMessage.role === 'assistant' ? '🤖 ' : '👤 '}
                          {lastMessage.content}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const path = type === 'chat'
                            ? `/module/${moduleId}?sessionId=${session.sessionId}`
                            : `/interactive/${moduleId}?sessionId=${session.sessionId}`;
                          router.push(path);
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-bold transition-all shadow-sm hover:shadow-md text-sm"
                      >
                        セッションを見る →
                      </button>
                      <button
                        onClick={() => {
                          const dataStr = JSON.stringify(session, null, 2);
                          const dataBlob = new Blob([dataStr], { type: 'application/json' });
                          const url = URL.createObjectURL(dataBlob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `session-${moduleId}-${session.sessionId}.json`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-all text-sm"
                      >
                        📥
                      </button>
                    </div>
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
