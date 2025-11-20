import { ModuleProgress, InteractiveModuleProgress } from '@/types';
import { CAREER_MODULES } from '@/lib/modules';

interface ModuleSelectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedModuleId: string | null;
    moduleSessions: ModuleProgress[];
    interactiveModuleSessions: InteractiveModuleProgress[];
    onStartNew: () => void;
    onContinue: (sessionId: string) => void;
}

export default function ModuleSelectionDialog({
    isOpen,
    onClose,
    selectedModuleId,
    moduleSessions,
    interactiveModuleSessions,
    onStartNew,
    onContinue,
}: ModuleSelectionDialogProps) {
    if (!isOpen || !selectedModuleId) return null;

    const moduleDefinition = CAREER_MODULES.find(m => m.id === selectedModuleId);
    const isInteractive = moduleDefinition?.moduleType === 'interactive';
    const sessions = isInteractive ? interactiveModuleSessions : moduleSessions;
    const hasSessions = sessions.length > 0;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white/95 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col animate-fade-in border border-gray-200 backdrop-blur"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Session</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {moduleDefinition?.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {hasSessions ? '新しく始めるか、過去のプレイから選んでください' : 'このモジュールを始めますか？'}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    <button
                        onClick={onStartNew}
                        className="w-full bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-semibold transition shadow-lg shadow-gray-900/30"
                    >
                        ✨ 新しく始める
                    </button>

                    {hasSessions && (
                        <div className="space-y-3 pt-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">過去のプレイ履歴</p>
                            {!isInteractive && moduleSessions.map((session, index) => {
                                const firstUserMessage = session.messages?.find(m => m.role === 'user');
                                const sessionTitle = firstUserMessage?.content.substring(0, 30) || `セッション ${index + 1}`;
                                const displayTitle = firstUserMessage && firstUserMessage.content.length > 30
                                    ? `${sessionTitle}...`
                                    : sessionTitle;

                                return (
                                    <button
                                        key={`${session.sessionId}-${index}`}
                                        onClick={() => onContinue(session.sessionId)}
                                        className="w-full bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl transition group"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate group-hover:text-gray-900">
                                                    {displayTitle}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {session.messages?.length || 0}件のメッセージ
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs text-gray-400">
                                                    {new Date(session.lastUpdated).toLocaleDateString('ja-JP', {
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                            {isInteractive && interactiveModuleSessions.map((session, index) => {
                                const sessionTitle = `プレイ ${index + 1}`;

                                return (
                                    <button
                                        key={`${session.sessionId}-${index}`}
                                        onClick={() => onContinue(session.sessionId)}
                                        className="w-full bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl transition group"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate group-hover:text-gray-900">
                                                    {sessionTitle}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs text-gray-400">
                                                    {new Date(session.lastUpdated).toLocaleDateString('ja-JP', {
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full text-gray-500 hover:text-gray-700 px-6 py-2 text-sm font-medium transition-colors"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
}
