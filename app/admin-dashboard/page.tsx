'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ModuleProgress, InteractiveModuleProgress, ValueSnapshot } from '@/types';
import { CAREER_MODULES } from '@/lib/modules';

interface SessionData {
  type: 'chat' | 'interactive';
  moduleId: string;
  moduleName: string;
  moduleIcon: string;
  sessionId: string;
  messageCount: number;
  userMessageCount: number;
  aiMessageCount: number;
  firstUserMessage: string;
  lastMessage: string;
  lastUpdated: Date;
  completed: boolean;
  userId: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [allSessions, setAllSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'chat' | 'interactive'>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    try {
      setLoading(true);

      const sessionsKey = 'mikata-sessions';
      const rawSessions = localStorage.getItem(sessionsKey);

      if (rawSessions) {
        const sessions = JSON.parse(rawSessions);
        const sessionList: SessionData[] = [];

        Object.entries(sessions).forEach(([key, sessionArray]: [string, any]) => {
          if (Array.isArray(sessionArray) && sessionArray.length > 0) {
            const [moduleId, userId] = key.split(':');
            const module = CAREER_MODULES.find(m => m.id === moduleId);

            if (!module) return;

            sessionArray.forEach((session: any) => {
              const isInteractive = session.data && typeof session.data === 'object';
              const messages = isInteractive
                ? ((session.data as any).messages || [])
                : (session.messages || []);

              if (messages.length === 0) return;

              const userMessages = messages.filter((m: any) => m.role === 'user');
              const aiMessages = messages.filter((m: any) => m.role === 'assistant');
              const firstUserMessage = userMessages[0]?.content || '';
              const lastMessage = messages[messages.length - 1]?.content || '';

              sessionList.push({
                type: isInteractive ? 'interactive' : 'chat',
                moduleId,
                moduleName: module.title,
                moduleIcon: module.icon,
                sessionId: session.sessionId,
                messageCount: messages.length,
                userMessageCount: userMessages.length,
                aiMessageCount: aiMessages.length,
                firstUserMessage: firstUserMessage.substring(0, 100),
                lastMessage: lastMessage.substring(0, 100),
                lastUpdated: new Date(session.lastUpdated),
                completed: session.completed || false,
                userId: userId || 'local-user'
              });
            });
          }
        });

        // Sort by last updated (most recent first)
        sessionList.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
        setAllSessions(sessionList);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueUsers = () => {
    const users = new Set(allSessions.map(s => s.userId));
    return Array.from(users);
  };

  const filteredSessions = allSessions.filter(session => {
    // Filter by module
    if (filterModule !== 'all' && session.moduleId !== filterModule) return false;

    // Filter by type
    if (filterType !== 'all' && session.type !== filterType) return false;

    // Filter by user
    if (filterUser !== 'all' && session.userId !== filterUser) return false;

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        session.firstUserMessage.toLowerCase().includes(lowerQuery) ||
        session.lastMessage.toLowerCase().includes(lowerQuery)
      );
    }

    return true;
  });

  const getTotalMessages = () => allSessions.reduce((sum, s) => sum + s.messageCount, 0);
  const getTotalUserMessages = () => allSessions.reduce((sum, s) => sum + s.userMessageCount, 0);
  const getTotalAIMessages = () => allSessions.reduce((sum, s) => sum + s.aiMessageCount, 0);

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
    <div className="min-h-screen bg-gray-50 overflow-x-auto">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 border-b border-purple-800 shadow-lg sticky top-0 z-10">
        <div className="mx-auto px-6 py-3 min-w-max">
          <div className="flex items-center justify-between min-w-[1400px]">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                🔐 管理者ダッシュボード
              </h1>
              <span className="px-2 py-1 bg-yellow-400 text-purple-900 text-xs font-bold rounded uppercase">
                Admin
              </span>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors backdrop-blur-sm border border-white/30 text-sm"
            >
              ← ホーム
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto px-6 py-4">
        <div className="min-w-[1400px]">
        {/* Statistics Bar */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">👥 ユーザー数</div>
            <div className="text-xl font-bold text-gray-900">{getUniqueUsers().length}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">📝 総セッション</div>
            <div className="text-xl font-bold text-gray-900">{allSessions.length}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">💬 総メッセージ</div>
            <div className="text-xl font-bold text-gray-900">{getTotalMessages()}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">👤 ユーザー発言</div>
            <div className="text-xl font-bold text-gray-900">{getTotalUserMessages()}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">🤖 AI発言</div>
            <div className="text-xl font-bold text-gray-900">{getTotalAIMessages()}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm mb-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">🔍 検索</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="メッセージ内容..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">👥 ユーザー</label>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全てのユーザー</option>
                {getUniqueUsers().map(userId => (
                  <option key={userId} value={userId}>{userId}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">📁 モジュール</label>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全て</option>
                {CAREER_MODULES.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.icon} {module.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">🎯 タイプ</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全て</option>
                <option value="chat">チャット</option>
                <option value="interactive">ゲーム</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                    タイプ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                    ユーザー
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
                    モジュール
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    最初の発言
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                    💬
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                    👤
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                    🤖
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                    最終更新
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                    状態
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                      {searchQuery || filterModule !== 'all' || filterType !== 'all' || filterUser !== 'all'
                        ? '条件に一致するセッションがありません'
                        : 'まだセッションがありません'}
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr
                      key={`${session.userId}-${session.moduleId}-${session.sessionId}`}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedSession(session)}
                    >
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded ${
                          session.type === 'chat'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {session.type === 'chat' ? 'チャット' : 'ゲーム'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {session.userId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{session.moduleIcon}</span>
                          <span className="text-gray-900 font-medium">{session.moduleName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <div className="truncate max-w-md">
                          {session.firstUserMessage || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-900 font-semibold">
                        {session.messageCount}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {session.userMessageCount}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {session.aiMessageCount}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {session.lastUpdated.toLocaleDateString('ja-JP', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {session.completed && (
                          <span className="inline-flex px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded">
                            ✓
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const path = session.type === 'chat'
                              ? `/module/${session.moduleId}?sessionId=${session.sessionId}`
                              : `/interactive/${session.moduleId}?sessionId=${session.sessionId}`;
                            router.push(path);
                          }}
                          className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded font-bold transition-colors"
                        >
                          開く
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          {filteredSessions.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
              全 {filteredSessions.length} セッション表示中
            </div>
          )}
        </div>

        {/* Session Detail Modal */}
        {selectedSession && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSession(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedSession.moduleIcon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedSession.moduleName}</h3>
                    <p className="text-sm text-gray-600">{selectedSession.userId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">最初のユーザー発言</div>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                    {selectedSession.firstUserMessage}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">最後のメッセージ</div>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                    {selectedSession.lastMessage}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">総メッセージ</div>
                    <div className="text-lg font-bold text-gray-900">{selectedSession.messageCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">ユーザー</div>
                    <div className="text-lg font-bold text-gray-900">{selectedSession.userMessageCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">AI</div>
                    <div className="text-lg font-bold text-gray-900">{selectedSession.aiMessageCount}</div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      const path = selectedSession.type === 'chat'
                        ? `/module/${selectedSession.moduleId}?sessionId=${selectedSession.sessionId}`
                        : `/interactive/${selectedSession.moduleId}?sessionId=${selectedSession.sessionId}`;
                      router.push(path);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors"
                  >
                    セッションを開く
                  </button>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-colors"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
