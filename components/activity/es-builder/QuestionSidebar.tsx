import React from 'react';
import { EsQuestionTemplate, EsAnswer } from './types';
import { CheckCircle2, Circle, Clock, AlertCircle, Plus } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface QuestionSidebarProps {
    questions: EsQuestionTemplate[];
    answers: Record<string, EsAnswer>;
    activeQuestionId: string;
    onSelectQuestion: (questionId: string) => void;
    onAddQuestion: (title: string) => void;
}

export default function QuestionSidebar({
    questions,
    answers,
    activeQuestionId,
    onSelectQuestion,
    onAddQuestion,
}: QuestionSidebarProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'done':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'needs_review':
                return <AlertCircle className="h-4 w-4 text-orange-500" />;
            case 'drafting':
                return <Clock className="h-4 w-4 text-blue-500" />;
            default:
                return <Circle className="h-4 w-4 text-gray-300" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'done': return '完成';
            case 'needs_review': return '要見直し';
            case 'drafting': return '作成中';
            default: return '未着手';
        }
    };

    const [isAdding, setIsAdding] = React.useState(false);
    const [newQuestionTitle, setNewQuestionTitle] = React.useState('');

    const handleAddClick = () => {
        setIsAdding(true);
        setNewQuestionTitle('');
    };

    const handleSubmitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuestionTitle.trim()) {
            onAddQuestion(newQuestionTitle.trim());
            setIsAdding(false);
        }
    };

    return (
        <>
            <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
                <div className="border-b border-gray-200 p-4">
                    <h2 className="font-bold text-gray-900">ES質問リスト</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-1">
                        {questions.map((q) => {
                            const answer = answers[q.id];
                            const isActive = activeQuestionId === q.id;
                            const charCount = answer?.text.length || 0;

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => onSelectQuestion(q.id)}
                                    className={`flex w-full flex-col gap-2 rounded-lg p-3 text-left transition-colors ${isActive
                                        ? 'bg-primary/10 ring-1 ring-primary'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                                            {q.title}
                                        </span>
                                        {getStatusIcon(answer?.status || 'not_started')}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{getStatusLabel(answer?.status || 'not_started')}</span>
                                        <span>{charCount}文字</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="border-t border-gray-200 p-4">
                    <button
                        onClick={handleAddClick}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900"
                    >
                        <Plus className="h-4 w-4" />
                        質問を追加する
                    </button>
                </div>
            </div>

            {/* Custom Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-gray-900 shadow-2xl ring-1 ring-white/10">
                        <div className="p-6">
                            <h3 className="mb-2 text-lg font-bold text-white">新しい質問を追加</h3>
                            <p className="mb-6 text-sm text-gray-400">
                                追加したい質問のテーマを入力してください。<br />
                                例：学生時代に力を入れたこと、自己PR、志望動機など
                            </p>
                            <form onSubmit={handleSubmitAdd}>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newQuestionTitle}
                                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                                    placeholder="質問のタイトル..."
                                    className="mb-6 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newQuestionTitle.trim()}
                                        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        追加する
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
