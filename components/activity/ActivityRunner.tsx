'use client';

import { useState, useEffect, useRef } from 'react';
import { ActivityDefinition, ActivityStep, Option } from '@/types/activity';
import ChatBubble from './ui/ChatBubble';
import InlineOptions from './ui/InlineOptions';
import TextInput from './ui/TextInput';
import MultiInput from './ui/MultiInput';
import SummaryCard from './ui/SummaryCard';
import RealTimeAnalysisPanel from './ui/RealTimeAnalysisPanel';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCareerData } from '@/hooks/useCareerData';
import { normalizeProfileAnalysis } from '@/lib/normalizeProfileAnalysis';

interface ActivityRunnerProps {
    activity: ActivityDefinition;
    onComplete: (results: any) => void;
}

interface HistoryItem {
    type: 'mikata' | 'user' | 'summary';
    content: string | any; // content can be string or object for summary
}

export default function ActivityRunner({ activity, onComplete }: ActivityRunnerProps) {
    const router = useRouter();
    const { state, saveActivityProgress, completeActivity, saveProfileAnalysis, clearActivityData } = useCareerData();
    const [currentStepId, setCurrentStepId] = useState(activity.initialStepId);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [dynamicOptions, setDynamicOptions] = useState<Option[] | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showAnalysisToast, setShowAnalysisToast] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);

    // Load initial state from persistence
    useEffect(() => {
        if (!initializedRef.current && state.chatHistory[activity.id]) {
            setHistory(state.chatHistory[activity.id]);
            setAnswers(state.answers[activity.id] || {});
            // Restore last step if possible, or default to initial
            // For MVP, we might just restart or stay at initial if logic is complex
            // But let's at least load the history.
            initializedRef.current = true;
        }
    }, [state.chatHistory, activity.id, state.answers]);

    // Save progress whenever history or answers change
    useEffect(() => {
        if (history.length > 0) {
            saveActivityProgress(activity.id, history, answers);
        }
    }, [history, answers, activity.id]);

    const currentStep = activity.steps[currentStepId];

    const lastProcessedStepId = useRef<string | null>(null);

    // Add initial message to history when step changes
    useEffect(() => {
        if (currentStep && lastProcessedStepId.current !== currentStepId) {
            lastProcessedStepId.current = currentStepId;
            setIsProcessing(false); // Re-enable input when new step loads
            setDynamicOptions(null); // Reset dynamic options on new step

            // Avoid adding duplicate initial message if history already has it (from persistence)
            // Simple check: if history is empty, add it.
            // Or if the last message is NOT the current step's message.
            // For MVP simplicity: if history is empty, add it.
            if (history.length === 0) {
                setHistory((prev) => [
                    ...prev,
                    { type: 'mikata', content: currentStep.message },
                ]);
            }

            // ... (rest of useEffect logic for summary/message_only)

            // If it's a summary step, add the summary card to history immediately
            if (currentStep.type === 'summary' && currentStep.summaryContent) {
                // Check if summary already exists to avoid duplication on reload?
                // For now, let's assume if we are on this step, we render it.
                // But if we reloaded, we might have it in history already.
                // Let's skip auto-adding if history already contains this summary.
                const alreadyHasSummary = history.some(h => h.type === 'summary' && h.content.title === currentStep.summaryContent!.title);

                if (!alreadyHasSummary) {
                    // Replace placeholders in summary values
                    const processedItems = currentStep.summaryContent.items.map(item => ({
                        ...item,
                        value: item.value.replace(/\{(\w+)\}/g, (_, key) => answers[key] || '(未入力)'),
                    }));

                    setHistory((prev) => [
                        ...prev,
                        {
                            type: 'summary',
                            content: {
                                title: currentStep.summaryContent!.title,
                                items: processedItems
                            }
                        },
                    ]);
                }

                if (currentStep.nextStepId) {
                    setTimeout(() => setCurrentStepId(currentStep.nextStepId!), 1500);
                }
            } else if (currentStep.type === 'message_only') {
                // Similar check for message_only to avoid duplicates if we want to be robust
                // But for MVP, let's just rely on the fact that if we are here, we proceed.
                // Actually, if we reloaded, we might be at initialStepId but history has everything.
                // We need a way to resume correct step.
                // For MVP, if history exists, we might just let the user continue from where they were?
                // Or just append.

                if (currentStep.nextStepId) {
                    setTimeout(() => setCurrentStepId(currentStep.nextStepId!), 1500);
                }
            }
        }
    }, [currentStepId, currentStep, answers]); // Removed history dependency to avoid loops, handled inside

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Handle final step
    useEffect(() => {
        if (currentStep?.isFinal) {
            const timer = setTimeout(async () => {
                onComplete(answers);
                completeActivity(activity.id); // Mark as complete in global state

                // Trigger analysis
                try {
                    const response = await fetch('/api/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chatHistory: history,
                            activityId: activity.id,
                        }),
                    });

                    if (response.ok) {
                        const analysisResult = await response.json();
                        const normalized = normalizeProfileAnalysis(analysisResult, state.profileAnalysis || undefined);
                        saveProfileAnalysis(normalized);
                    } else {
                        console.error('Analysis failed');
                    }
                } catch (error) {
                    console.error('Error triggering analysis:', error);
                }

            }, 3000); // Wait 3 seconds before completing
            return () => clearTimeout(timer);
        }
    }, [currentStep, answers, onComplete, activity.id, history]);

    // Helper for auto-analysis
    const triggerAutoAnalysis = (currentHistory: HistoryItem[]) => {
        // Prevent double firing if already analyzing or analyzed
        if (isProcessing || state.profileAnalysis) return;

        console.log('Triggering auto-analysis...');
        try {
            fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatHistory: currentHistory,
                    activityId: activity.id,
                }),
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) {
                        const normalized = normalizeProfileAnalysis(data, state.profileAnalysis || undefined);
                        saveProfileAnalysis(normalized);
                        console.log('Auto-analysis completed.');
                        setShowAnalysisToast(true);
                        setTimeout(() => setShowAnalysisToast(false), 3000);
                    }
                })
                .catch(err => console.error('Auto-analysis failed:', err));
        } catch (error) {
            console.error('Error triggering auto-analysis:', error);
        }
    };

    // Check on mount/update if we should have analyzed but haven't
    useEffect(() => {
        if (history.length >= 10 && !state.profileAnalysis && !isProcessing) {
            triggerAutoAnalysis(history);
        }
    }, [history, state.profileAnalysis, isProcessing]);

    const handleInputSubmit = async (value: any, label?: string) => {
        setIsProcessing(true); // Disable input immediately
        setDynamicOptions(null); // Clear options immediately

        // Add user's answer to history (if it's not a silent update)
        if (label) {
            setHistory((prev) => [...prev, { type: 'user', content: label }]);
        } else if (typeof value === 'string') {
            setHistory((prev) => [...prev, { type: 'user', content: value }]);
        } else if (Array.isArray(value)) {
            // For multi-input, show a summary or just "入力しました"
            setHistory((prev) => [...prev, { type: 'user', content: value.filter(v => v).join('\n') }]);
        }

        // Save answer
        setAnswers((prev) => ({ ...prev, [currentStepId]: value }));

        // Dynamic Chat Mode Logic
        if (activity.mode === 'dynamic_chat') {
            try {
                // Prepare messages for API
                const messages = history.map(h => ({
                    role: h.type === 'user' ? 'user' : 'assistant',
                    content: typeof h.content === 'string' ? h.content : JSON.stringify(h.content),
                }));
                // Add current user message
                messages.push({
                    role: 'user',
                    content: typeof value === 'string' ? value : JSON.stringify(value),
                });

                // Add placeholder for AI response
                setHistory((prev) => [...prev, { type: 'mikata', content: '' }]);

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages,
                        systemPrompt: activity.systemPrompt,
                    }),
                });

                if (!response.ok) throw new Error('API request failed');
                if (!response.body) throw new Error('No response body');

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let done = false;
                let accumulatedText = '';

                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    const chunkValue = decoder.decode(value, { stream: !done });
                    accumulatedText += chunkValue;

                    // Update the last message (AI's message) with accumulated text
                    const displayText = accumulatedText;

                    setHistory((prev) => {
                        const newHistory = [...prev];
                        const lastIndex = newHistory.length - 1;
                        if (newHistory[lastIndex].type === 'mikata') {
                            newHistory[lastIndex] = { ...newHistory[lastIndex], content: displayText };
                        }
                        return newHistory;
                    });
                }

                // 入力受付を早めに戻す
                setIsProcessing(false);

                // No suggestions parsing needed anymore

            } catch (error) {
                console.error('Chat API Error:', error);
                setHistory((prev) => {
                    // Remove the empty placeholder if error occurred immediately, or append error message
                    const newHistory = [...prev];
                    if (newHistory.length > 0 && newHistory[newHistory.length - 1].content === '') {
                        newHistory[newHistory.length - 1].content = 'すみません、少し調子が悪いようです。もう一度試してみてください。';
                    }
                    return newHistory;
                });
            } finally {
                setIsProcessing(false);
            }
            return; // Stop here for dynamic chat
        }

        // Static Mode: Move to next step
        const nextId = currentStep.nextStepId;
        if (nextId) {
            setTimeout(() => setCurrentStepId(nextId), 200);
        }
        // 入力受付を早めに戻す
        setIsProcessing(false);

        // Check for auto-analysis trigger
        const totalMessages = history.length + 1; // +1 for the current user message being added

        if (totalMessages >= 10 && !state.profileAnalysis) {
            triggerAutoAnalysis([...history, { type: 'user' as const, content: typeof value === 'string' ? value : JSON.stringify(value) }]);
        }
    };

    const handleOptionSelect = (value: string, label: string) => {
        handleInputSubmit(value, label);

        // Override next step logic for buttons (branching)
        if (currentStep.options) {
            const selectedOption = currentStep.options.find((opt) => opt.value === value);
            const nextId = selectedOption?.nextStepId || currentStep.nextStepId;
            if (nextId && nextId !== currentStep.nextStepId) {
                // If branching, update state immediately (timeout handled in handleInputSubmit was for default)
                // Actually handleInputSubmit sets default nextId. We need to override it.
                // Let's just set it here directly.
                setTimeout(() => setCurrentStepId(nextId), 500);
            }
        }
    };

    if (!currentStep) return <div>Loading...</div>;

    return (
        <div className="flex h-screen flex-col bg-gradient-to-b from-slate-50 to-slate-100/50">
            {/* Analysis Toast */}
            {showAnalysisToast && (
                <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 transform animate-fade-in px-4 w-full max-w-sm">
                    <div className="flex items-center gap-3 rounded-xl bg-white/90 backdrop-blur-md border border-blue-100 p-4 shadow-lg ring-1 ring-black/5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">分析が完了しました！</h4>
                            <p className="text-xs text-gray-500">マイページで最新の結果を確認できます</p>
                        </div>
                    </div>
                </div>
            )}
            {/* Header */}
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm transition-all">
                <button
                    onClick={() => router.back()}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:scale-95 transition-all"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center">
                    <h1 className="text-base font-bold text-gray-800">{activity.title}</h1>
                    <p className="text-[10px] font-medium text-gray-500">{activity.emoji} {activity.duration}</p>
                </div>

                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:scale-95 transition-all"
                    title="最初からやり直す"
                >
                    <RefreshCcw className="h-5 w-5" />
                </button>
            </div>

            {/* Main Content Area (Flex) */}
            <div className="flex flex-1 overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-3xl space-y-5 pb-48">
                        {history.map((item, index) => (
                            <div
                                key={index}
                                className={`flex w-full ${item.type === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {item.type === 'mikata' ? (
                                    <ChatBubble message={item.content} />
                                ) : item.type === 'summary' ? (
                                    <div className="w-full pl-16">
                                        <SummaryCard title={item.content.title} items={item.content.items} />
                                    </div>
                                ) : (
                                    <div className="max-w-[75%] rounded-[20px] rounded-tr-none bg-[#3B82F6] px-5 py-4 text-white shadow-sm whitespace-pre-wrap leading-relaxed text-[15px] tracking-wide animate-fade-in">
                                        {item.content}
                                    </div>
                                )}
                            </div>
                        ))}



                        {/* Current Step Options (Inline) */}
                        {/* Show static options only for 'button' type steps (mandatory choices) */}
                        {/* Suggestions for 'text' type are hidden as per user request */}
                        {currentStep.type === 'button' && currentStep.options && currentStep.options.length > 0 && (
                            <div className="flex w-full justify-start pl-16">
                                <InlineOptions
                                    options={currentStep.options}
                                    onSelect={(value) => {
                                        const label = currentStep.options?.find(o => o.value === value)?.label || value;
                                        handleOptionSelect(value, label);
                                    }}
                                    disabled={isProcessing}
                                />
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* Real-time Analysis Panel (Sidebar) */}
                <RealTimeAnalysisPanel activity={activity} stepCount={history.length} history={history} />
            </div>

            {/* Input Area (Fixed Bottom) */}
            {
                (currentStep.type === 'text' || currentStep.type === 'multi-input') && (
                    <div className="fixed bottom-0 left-0 z-50 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 pb-safe pt-5 shadow-xl">
                        <div className="mx-auto max-w-3xl px-6 pb-6 pointer-events-auto">
                            {isProcessing && (
                                <div className="mb-4 flex justify-center">
                                    <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur shadow-sm border border-gray-100 py-2 px-4 text-xs font-medium text-gray-500 animate-pulse">
                                        <div className="flex space-x-1">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span>考え中...</span>
                                    </div>
                                </div>
                            )}
                            {currentStep.type === 'text' && (
                                <TextInput
                                    placeholder={currentStep.placeholder}
                                    multiline={currentStep.multiline}
                                    onSubmit={(value) => handleInputSubmit(value)}
                                    disabled={isProcessing}
                                />
                            )}
                            {currentStep.type === 'multi-input' && currentStep.inputs && (
                                <MultiInput
                                    inputs={currentStep.inputs}
                                    onSubmit={(values) => handleInputSubmit(values)}
                                    disabled={isProcessing}
                                />
                            )}
                        </div>
                    </div>
                )
            }
            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="mb-2 text-lg font-bold text-gray-900">最初からやり直しますか？</h3>
                        <p className="mb-6 text-sm text-gray-600">
                            これまでの会話履歴はすべて削除されます。<br />
                            この操作は取り消せません。
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={() => {
                                    clearActivityData(activity.id);
                                    window.location.reload();
                                }}
                                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm"
                            >
                                リセット
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
