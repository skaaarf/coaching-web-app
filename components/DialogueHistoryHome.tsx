'use client';

import { useRouter } from 'next/navigation';
import { InteractiveModuleProgress } from '@/types';
import { CAREER_MODULES } from '@/lib/modules';

interface Props {
  allProgress: Record<string, InteractiveModuleProgress>;
}

export default function DialogueHistoryHome({ allProgress }: Props) {
  const router = useRouter();

  // Filter modules that have dialogue history
  const modulesWithDialogue = Object.entries(allProgress).filter(([moduleId, progress]) => {
    const data = progress.data as any;
    return data.phase === 'dialogue' && data.messages && data.messages.length > 0;
  });

  if (modulesWithDialogue.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="text-3xl mr-3">💬</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">対話履歴</h2>
            <p className="text-sm text-gray-600">あなたとみかたくんの会話</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulesWithDialogue.map(([moduleId, progress]) => {
            const module = CAREER_MODULES.find(m => m.id === moduleId);
            if (!module) return null;

            const data = progress.data as any;
            const messageCount = data.messages?.length || 0;
            const lastMessage = data.messages?.[data.messages.length - 1];
            const lastMessagePreview = lastMessage?.content.substring(0, 100) || '';

            return (
              <button
                key={moduleId}
                onClick={() => router.push(`/interactive/${moduleId}`)}
                className="text-left p-5 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-start mb-3">
                  <div className="text-3xl mr-3">{module.icon}</div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <span>💬 {messageCount}件</span>
                      <span>•</span>
                      <span>
                        {new Date(progress.lastUpdated).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {lastMessage?.role === 'assistant' ? '🤖 ' : '👤 '}
                    {lastMessagePreview}
                    {lastMessage?.content.length > 100 ? '...' : ''}
                  </p>
                </div>

                {progress.completed && (
                  <div className="flex items-center justify-end">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      ✓ 完了
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {modulesWithDialogue.length > 3 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {modulesWithDialogue.length}個の対話が記録されています
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
