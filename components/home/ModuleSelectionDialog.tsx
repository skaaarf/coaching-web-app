import { useEffect, useRef } from 'react';
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

type SessionType = ModuleProgress | InteractiveModuleProgress;

export default function ModuleSelectionDialog({
    isOpen,
    onClose,
    selectedModuleId,
    moduleSessions,
    interactiveModuleSessions,
    onStartNew,
    onContinue,
}: ModuleSelectionDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Escキーでダイアログを閉じる
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // 自動起動: セッションがない場合は自動的に新規作成
    useEffect(() => {
        if (!isOpen || !selectedModuleId) return;

        const moduleDefinition = CAREER_MODULES.find(m => m.id === selectedModuleId);
        const isInteractive = moduleDefinition?.moduleType === 'interactive';
        const sessions = isInteractive ? interactiveModuleSessions : moduleSessions;

        if (sessions.length === 0) {
            // セッションがない場合は自動的に開始
            onStartNew();
        }
    }, [isOpen, selectedModuleId, moduleSessions, interactiveModuleSessions, onStartNew]);

    // フォーカストラップ
    useEffect(() => {
        if (!isOpen || !dialogRef.current) return;

        const dialog = dialogRef.current;
        const focusableElements = dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        dialog.addEventListener('keydown', handleTab as EventListener);
        return () => {
            dialog.removeEventListener('keydown', handleTab as EventListener);
        };
    }, [isOpen, moduleSessions, interactiveModuleSessions]);

    if (!isOpen || !selectedModuleId) return null;

    const moduleDefinition = CAREER_MODULES.find(m => m.id === selectedModuleId);
    const isInteractive = moduleDefinition?.moduleType === 'interactive';
    const sessions = isInteractive ? interactiveModuleSessions : moduleSessions;
    const hasSessions = sessions.length > 0;

    // セッションがない場合はダイアログを表示しない（自動起動される）
    if (!hasSessions) {
        return null;
    }

    // セッションボタンをレンダリングするヘルパー関数
    const renderSessionButton = (session: SessionType, index: number) => {
        const isModuleProgress = 'messages' in session;

        let sessionTitle: string;
        let subtitle: string | null = null;

        if (isModuleProgress) {
            const firstUserMessage = session.messages?.find(m => m.role === 'user');
            const titleText = firstUserMessage?.content.substring(0, 30) || `セッション ${index + 1}`;
            sessionTitle = firstUserMessage && firstUserMessage.content.length > 30
                ? `${titleText}...`
                : titleText;
            subtitle = `${session.messages?.length || 0}件のメッセージ`;
        } else {
            sessionTitle = `プレイ ${index + 1}`;
        }

        const formattedDate = new Date(session.lastUpdated).toLocaleDateString('ja-JP', {
            month: 'numeric',
            day: 'numeric',
        });

        return (
            <button
                key={session.sessionId}
                onClick={() => onContinue(session.sessionId)}
                className="w-full bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-left px-4 py-3 rounded-2xl transition group"
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-gray-900">
                            {sessionTitle}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">
                            {formattedDate}
                        </p>
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div
                ref={dialogRef}
                className="bg-white/95 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col animate-fade-in border border-gray-200 backdrop-blur"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Session</p>
                    <h3 id="dialog-title" className="text-xl font-bold text-gray-900 mb-2">
                        {moduleDefinition?.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                        過去のプレイ履歴から選択してください
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    <div className="space-y-3">
                        <button
                            onClick={onStartNew}
                            className="w-full bg-blue-50 border border-blue-200 hover:border-blue-300 hover:bg-blue-100 text-left px-4 py-4 rounded-2xl transition group flex items-center gap-3 shadow-sm"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-blue-900 text-base">新しいセッションを開始</p>
                                <p className="text-xs text-blue-700 mt-0.5">最初から対話を始める</p>
                            </div>
                        </button>

                        <div className="flex items-center justify-between mt-6 mb-2 px-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                履歴 ({sessions.length})
                            </p>
                        </div>
                        {sessions.map((session, index) => renderSessionButton(session, index))}
                    </div>
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
