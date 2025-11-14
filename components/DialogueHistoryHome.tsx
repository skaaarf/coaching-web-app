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
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
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

              return (
                <button
                  key={moduleId}
                  onClick={() => {
                    if (onSessionClick && progress.sessionId) {
                      // For game dialogues, navigate to the interactive module with sessionId
                      const targetModuleId = isGameDialogue ? baseModuleId : moduleId;
                      const path = isGameDialogue
                        ? `/interactive/${targetModuleId}?dialogueSessionId=${progress.sessionId}`
                        : `/module/${targetModuleId}?sessionId=${progress.sessionId}`;
                      window.location.href = path;
                    }
                  }}
                  className="w-full px-6 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl flex-shrink-0">{moduleDefinition.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {displayTitle}
                        </h3>
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
