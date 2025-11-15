'use client';

import { ModuleProgress } from '@/types';
import { CAREER_MODULES } from '@/lib/modules';

interface Props {
  chatProgress: Record<string, ModuleProgress>;
  onSessionClick?: (moduleId: string, sessionId: string) => void;
}

export default function DialogueHistoryHome({ chatProgress, onSessionClick }: Props) {

  // Only show chat modules (exclude interactive game modules)
  const chatDialogues = Object.entries(chatProgress).filter(([, progress]) => {
    return progress.messages && progress.messages.length > 0;
  });

  const modulesWithDialogue = chatDialogues;

  return (
    <div className="mb-8 animate-fade-in">
      <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="px-6 py-5 border-b border-gray-200/70 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Timeline</p>
              <h2 className="text-lg font-semibold text-gray-900">対話履歴</h2>
            </div>
            {modulesWithDialogue.length > 0 && (
              <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
                {modulesWithDialogue.length}件
              </span>
            )}
          </div>
        </div>

        {modulesWithDialogue.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🗂️</div>
            <p className="text-sm text-gray-600 mb-1">まだ対話履歴がありません</p>
            <p className="text-xs text-gray-500">最初のモジュールで、考えをアウトプットしてみましょう。</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100/80">
            {modulesWithDialogue.map(([moduleId, progress]) => {
              // Handle both regular chat modules and game dialogue sessions (e.g., "value-battle-dialogue")
              const isGameDialogue = moduleId.includes('-dialogue');
              const baseModuleId = isGameDialogue ? moduleId.replace('-dialogue', '') : moduleId;
              const moduleDefinition = CAREER_MODULES.find(m => m.id === baseModuleId);
              if (!moduleDefinition) return null;

              // Chat module only
              const chatProgress = progress as ModuleProgress;
              const messages = chatProgress.messages;

              const messageCount = messages?.length || 0;
              const lastMessage = messages?.[messages.length - 1];
              const lastMessagePreview = lastMessage?.content.substring(0, 60) || '';
              const lastUpdated = chatProgress.lastUpdated;

              // Generate title from first user message (summary)
              const firstUserMessage = messages?.find((msg) => msg.role === 'user');
              const summaryTitle = firstUserMessage?.content.substring(0, 40) || moduleDefinition.title;
              const displayTitle = summaryTitle.length > 40 ? `${summaryTitle}...` : summaryTitle;

              const previewText = `${lastMessage?.role === 'assistant' ? 'みかたくん: ' : 'あなた: '}${lastMessagePreview}${lastMessage?.content.length > 60 ? '...' : ''}`;

              const handleClick = () => {
                if (isGameDialogue && progress.sessionId) {
                  window.location.href = `/interactive/${baseModuleId}?dialogueSessionId=${progress.sessionId}`;
                  return;
                }

                if (onSessionClick && progress.sessionId) {
                  onSessionClick(moduleId, progress.sessionId);
                }
              };

              return (
                <button
                  key={moduleId}
                  onClick={handleClick}
                  className="w-full px-6 py-4 transition-colors text-left group hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                      {moduleDefinition.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-gray-900">
                          {displayTitle}
                        </h3>
                        {isGameDialogue && (
                          <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gray-500">
                            Interactive
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
                      <p className="text-xs text-gray-400 mt-0.5">{messageCount}件</p>
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
