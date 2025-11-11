'use client';

import { useRouter } from 'next/navigation';
import { InteractiveModuleProgress, ModuleProgress } from '@/types';
import { CAREER_MODULES } from '@/lib/modules';

interface Props {
  allProgress: Record<string, InteractiveModuleProgress>;
  chatProgress?: Record<string, ModuleProgress>;
}

export default function DialogueHistoryHome({ allProgress, chatProgress = {} }: Props) {
  const router = useRouter();

  // Filter interactive modules that have any progress (started or completed)
  const interactiveDialogues = Object.entries(allProgress).filter(([moduleId, progress]) => {
    // Show all interactive modules that have been started (regardless of phase)
    return progress && progress.data;
  });

  // Filter chat modules that have messages
  const chatDialogues = Object.entries(chatProgress).filter(([moduleId, progress]) => {
    return progress.messages && progress.messages.length > 0;
  });

  // Combine both types of dialogues
  const allDialogues = [...interactiveDialogues, ...chatDialogues];
  const modulesWithDialogue = allDialogues;

  return (
    <div className="mb-8 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">対話履歴</h2>
            {modulesWithDialogue.length > 0 && (
              <span className="text-xs text-gray-500 font-medium">
                {modulesWithDialogue.length}件
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {modulesWithDialogue.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500 mb-4">まだ対話履歴がありません</p>
            <button
              onClick={() => router.push('/module/university-decision')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              対話を始める →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {modulesWithDialogue.map(([moduleId, progress]) => {
              const module = CAREER_MODULES.find(m => m.id === moduleId);
              if (!module) return null;

              // Handle both ModuleProgress and InteractiveModuleProgress
              const isInteractive = 'data' in progress;
              const data = isInteractive ? (progress as InteractiveModuleProgress).data as any : null;
              const messages = isInteractive ? data?.messages : (progress as ModuleProgress).messages;

              const messageCount = messages?.length || 0;
              const lastMessage = messages?.[messages.length - 1];
              const lastMessagePreview = lastMessage?.content.substring(0, 60) || '';
              const lastUpdated = (progress as any).lastUpdated;

              // For interactive modules without messages, show status
              const hasMessages = messages && messages.length > 0;
              const previewText = hasMessages
                ? `${lastMessage?.role === 'assistant' ? 'みかたくん: ' : 'あなた: '}${lastMessagePreview}${lastMessage?.content.length > 60 ? '...' : ''}`
                : isInteractive
                ? (progress as any).completed ? 'ゲーム完了' : 'ゲーム進行中'
                : '';

              // Determine the correct path based on module type
              const modulePath = module.moduleType === 'chat'
                ? `/module/${moduleId}`
                : `/interactive/${moduleId}`;

              return (
                <button
                  key={moduleId}
                  onClick={() => router.push(modulePath)}
                  className="w-full px-6 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl flex-shrink-0">{module.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {module.title}
                        </h3>
                        {(progress as any).completed && (
                          <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                            完了
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {previewText}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {lastUpdated && (
                        <p className="text-xs text-gray-400">
                          {new Date(lastUpdated).toLocaleDateString('ja-JP', {
                            month: 'numeric',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                      {hasMessages && <p className="text-xs text-gray-400 mt-0.5">{messageCount}件</p>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
