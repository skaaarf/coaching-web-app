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
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="text-4xl mr-3">💬</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">対話履歴</h2>
            <p className="text-sm text-gray-600 font-medium">あなたとみかたくんの会話</p>
          </div>
        </div>

        <div className="space-y-4">
          {modulesWithDialogue.map(([moduleId, progress]) => {
            const module = CAREER_MODULES.find(m => m.id === moduleId);
            if (!module) return null;

            const data = progress.data as any;
            const messageCount = data.messages?.length || 0;
            const lastMessage = data.messages?.[data.messages.length - 1];
            const lastMessagePreview = lastMessage?.content.substring(0, 150) || '';

            return (
              <button
                key={moduleId}
                onClick={() => router.push(`/interactive/${moduleId}`)}
                className="text-left w-full p-6 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border-2 border-gray-300 hover:border-blue-400 rounded-xl transition-all shadow-sm hover:shadow-md touch-manipulation"
              >
                <div className="flex items-start mb-4">
                  <div className="text-5xl mr-4">{module.icon}</div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      {module.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 font-medium space-x-3">
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

                <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {lastMessage?.role === 'assistant' ? '🤖 ' : '👤 '}
                    {lastMessagePreview}
                    {lastMessage?.content.length > 150 ? '...' : ''}
                  </p>
                </div>

                {progress.completed && (
                  <div className="flex items-center justify-end">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-green-100 text-green-800 border border-green-300">
                      ✓ 完了
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {modulesWithDialogue.length > 2 && (
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 font-medium">
              {modulesWithDialogue.length}個の対話が記録されています
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
