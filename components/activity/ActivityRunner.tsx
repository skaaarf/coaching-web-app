'use client';

import { useState, useEffect, useRef } from 'react';
import { ActivityDefinition, ActivityStep } from '@/types/activity';
import ChatBubble from './ui/ChatBubble';
import ButtonOptions from './ui/ButtonOptions';
import TextInput from './ui/TextInput';
import MultiInput from './ui/MultiInput';
import SummaryCard from './ui/SummaryCard';
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
    const bottomRef = useRef<HTMLDivElement>(null);

    const currentStep = activity.steps[currentStepId];

    // Add initial message to history when step changes
    useEffect(() => {
        if (currentStep) {
            setHistory((prev) => [
                ...prev,
                { type: 'mikata', content: currentStep.message },
            ]);

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

                // Auto-advance after showing summary? Or wait for user?
                // Usually summary is followed by a question like "Is this correct?"
                // So we just show it and let the next step (which might be the same step's nextStepId) handle flow.
                // But wait, if type is 'summary', does it have input?
                // In our definition, 'summary' type has a nextStepId. 
                // We should probably auto-advance to the next step if there's no input required.
                // But if the next step is a separate question, we need to trigger it.

                if (currentStep.nextStepId) {
                    setTimeout(() => setCurrentStepId(currentStep.nextStepId!), 1500);
                }
            } else if (currentStep.type === 'message_only') {
                if (currentStep.nextStepId) {
                    setTimeout(() => setCurrentStepId(currentStep.nextStepId!), 1500);
                }
            }
        }
    }, [currentStepId, currentStep, answers]); // Added answers to dependency for summary processing

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

    const handleInputSubmit = (value: any, label?: string) => {
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

        // Move to next step
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
        <div className="flex h-screen flex-col bg-gray-50">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="rounded-lg p-2 hover:bg-gray-100"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">{activity.title}</h1>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6 pb-48">
                    {history.map((item, index) => (
                        <div
                            key={index}
                            className={`flex w-full ${item.type === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {item.type === 'mikata' ? (
                                <ChatBubble message={item.content} />
                            ) : item.type === 'summary' ? (
                                <div className="w-full max-w-md pl-14">
                                    <SummaryCard title={item.content.title} items={item.content.items} />
                                </div>
                            ) : (
                                <div className="flex flex-row-reverse items-start gap-3 max-w-[90%]">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                                        凌
                                    </div>
                                    <div className="rounded-2xl bg-gray-100 px-5 py-3 text-gray-900 whitespace-pre-wrap leading-relaxed">
                                        {item.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input Area (Fixed Bottom) */}
            <div className="fixed bottom-0 left-0 z-50 w-full bg-white/90 backdrop-blur-md pb-safe pt-4 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
                <div className="mx-auto max-w-3xl px-4 pb-6 pointer-events-auto">
                    {currentStep.type === 'button' && currentStep.options && (
                        <ButtonOptions
                            options={currentStep.options}
                            onSelect={(value) => {
                                const label = currentStep.options?.find(o => o.value === value)?.label || value;
                                handleOptionSelect(value, label);
                            }}
                        />
                    )}
                    {currentStep.type === 'text' && (
                        <TextInput
                            placeholder={currentStep.placeholder}
                            multiline={currentStep.multiline}
                            onSubmit={(value) => handleInputSubmit(value)}
                        />
                    )}
                    {currentStep.type === 'multi-input' && currentStep.inputs && (
                        <MultiInput
                            inputs={currentStep.inputs}
                            onSubmit={(values) => handleInputSubmit(values)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
