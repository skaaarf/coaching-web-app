'use client';

import { useState, useEffect, useRef } from 'react';
import { ActivityDefinition, ActivityStep, Option } from '@/types/activity';
import ChatBubble from './ui/ChatBubble';
import InlineOptions from './ui/InlineOptions';
import TextInput from './ui/TextInput';
import MultiInput from './ui/MultiInput';
import SummaryCard from './ui/SummaryCard';
import RealTimeAnalysisPanel from './ui/RealTimeAnalysisPanel';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    const [currentStepId, setCurrentStepId] = useState(activity.initialStepId);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [dynamicOptions, setDynamicOptions] = useState<Option[] | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const currentStep = activity.steps[currentStepId];

    const lastProcessedStepId = useRef<string | null>(null);

    // Add initial message to history when step changes
    useEffect(() => {
        if (currentStep && lastProcessedStepId.current !== currentStepId) {
            lastProcessedStepId.current = currentStepId;
            setIsProcessing(false); // Re-enable input when new step loads
            setDynamicOptions(null); // Reset dynamic options on new step

            setHistory((prev) => [
                ...prev,
                { type: 'mikata', content: currentStep.message },
            ]);
            // ... (rest of useEffect)

            // If it's a summary step, add the summary card to history immediately
            if (currentStep.type === 'summary' && currentStep.summaryContent) {
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

                if (currentStep.nextStepId) {
                    setTimeout(() => setCurrentStepId(currentStep.nextStepId!), 1500);
                }
            } else if (currentStep.type === 'message_only') {
                if (currentStep.nextStepId) {
                    setTimeout(() => setCurrentStepId(currentStep.nextStepId!), 1500);
                }
            }
        }
    }, [currentStepId, currentStep, answers]);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Handle final step
    useEffect(() => {
        if (currentStep?.isFinal) {
            const timer = setTimeout(() => {
                onComplete(answers);
            }, 3000); // Wait 3 seconds before completing
            return () => clearTimeout(timer);
        }
    }, [currentStep, answers, onComplete]);

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
                    // We need to filter out the suggestions block for display
                    const displayText = accumulatedText.replace(/\[\[SUGGESTIONS:.*?\]\]/s, '').trim();

                    setHistory((prev) => {
                        const newHistory = [...prev];
                        const lastIndex = newHistory.length - 1;
                        if (newHistory[lastIndex].type === 'mikata') {
                            newHistory[lastIndex] = { ...newHistory[lastIndex], content: displayText };
                        }
                        return newHistory;
                    });
                }

                // Parse suggestions from the full text
                const suggestionsMatch = accumulatedText.match(/\[\[SUGGESTIONS:\s*(.*?)\]\]/s);
                if (suggestionsMatch && suggestionsMatch[1]) {
                    try {
                        const suggestionsArray = JSON.parse(suggestionsMatch[1]);
                        if (Array.isArray(suggestionsArray)) {
                            setDynamicOptions(suggestionsArray.map(s => ({ label: s, value: s })));
                        }
                    } catch (e) {
                        console.error('Failed to parse suggestions:', e);
                        setDynamicOptions([]);
                    }
                } else {
                    setDynamicOptions([]);
                }

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
            setTimeout(() => setCurrentStepId(nextId), 500);
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
        <div className="flex h-screen flex-col bg-gradient-to-b from-gray-50 to-blue-50/30">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="rounded-xl p-2 hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">{activity.title}</h1>
                    <p className="text-sm text-gray-600">{activity.emoji} {activity.duration}</p>
                </div>

            </div>

            {/* Main Content Area (Flex) */}
            <div className="flex flex-1 overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-3xl space-y-6 pb-48">
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
                                    <div className="max-w-[75%] rounded-2xl rounded-tr-md bg-gray-100 border border-gray-200 px-5 py-4 text-gray-900 shadow-sm whitespace-pre-wrap leading-relaxed text-base animate-fade-in">
                                        {item.content}
                                    </div>
                                )}
                            </div>
                        ))}



                        {/* Current Step Options (Inline) */}
                        {/* Show dynamic options if available, otherwise show static options (only if no dynamic options have been set yet) */}
                        {(dynamicOptions || currentStep.options) && (dynamicOptions || currentStep.options)!.length > 0 && (
                            <div className="flex w-full justify-start pl-16">
                                <InlineOptions
                                    options={dynamicOptions || currentStep.options!}
                                    onSelect={(value) => {
                                        const label = (dynamicOptions || currentStep.options)?.find(o => o.value === value)?.label || value;
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
                <RealTimeAnalysisPanel activity={activity} stepCount={history.length} />
            </div>

            {/* Input Area (Fixed Bottom) */}
            {(currentStep.type === 'text' || currentStep.type === 'multi-input') && (
                <div className="fixed bottom-0 left-0 z-50 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 pb-safe pt-5 shadow-xl">
                    <div className="mx-auto max-w-3xl px-6 pb-6 pointer-events-auto">
                        {isProcessing && (
                            <div className="mb-4 text-center text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-xl py-3 px-4">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="font-medium">AI進路くんが考えています...</span>
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
            )}
        </div>
    );
}
