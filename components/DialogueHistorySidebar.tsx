'use client';

import { useRouter } from 'next/navigation';
import { InteractiveModuleProgress, InteractiveState } from '@/types';
import { CAREER_MODULES } from '@/lib/modules';

interface Props {
  allProgress: Record<string, InteractiveModuleProgress>;
  currentModuleId?: string;
  onClose: () => void;
}

export default function DialogueHistorySidebar({ allProgress, currentModuleId, onClose }: Props) {
  const router = useRouter();

  // Filter modules that have dialogue history
  const modulesWithDialogue = Object.entries(allProgress).filter(([, progress]) => {
    const data = progress.data;
    return data?.phase === 'dialogue' && data.messages && data.messages.length > 0;
  });

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">対話履歴</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden"
          aria-label="閉じる"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {modulesWithDialogue.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <div className="text-3xl mb-2">💬</div>
            <p>まだ対話履歴がありません</p>
          </div>
        ) : (
          <div className="space-y-2">
            {modulesWithDialogue.map(([moduleId, progress]) => {
              const moduleDefinition = CAREER_MODULES.find(m => m.id === moduleId);
              if (!moduleDefinition) return null;

              const data = progress.data as InteractiveState | null;
              const messageCount = data?.phase === 'dialogue' && data.messages ? data.messages.length : 0;
              const lastMessage = data?.phase === 'dialogue' && data.messages
                ? data.messages[data.messages.length - 1]
                : undefined;
              const isCurrentModule = moduleId === currentModuleId;

              return (
                <button
                  key={moduleId}
                  onClick={() => {
                    if (!isCurrentModule) {
                      router.push(`/interactive/${moduleId}`);
                    }
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    isCurrentModule
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="text-2xl flex-shrink-0">{moduleDefinition.icon}</div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {moduleDefinition.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">
                        {messageCount}件のメッセージ
                      </p>
                      {lastMessage && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {lastMessage.content.substring(0, 60)}
                          {lastMessage.content.length > 60 ? '...' : ''}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(progress.lastUpdated).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  {progress.completed && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        完了
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
