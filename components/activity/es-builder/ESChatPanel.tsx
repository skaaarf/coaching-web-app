import React, { useState, useRef, useEffect } from 'react';
import { EsQuestionTemplate, ChatMessage } from './types';
import { Send, Bot, User } from 'lucide-react';

interface ESChatPanelProps {
    question: EsQuestionTemplate;
    messages: ChatMessage[];
    onSendMessage: (content: string) => void;
    onReflectDraft: (draft: string) => void;
    isTyping?: boolean;
}

export default function ESChatPanel({
    question,
    messages,
    onSendMessage,
    onReflectDraft,
    isTyping = false,
}: ESChatPanelProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex h-full flex-col bg-gray-50">
            {/* Header */}
            <div className="flex min-h-[60px] items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
                <div>
                    <h2 className="text-sm font-bold text-gray-900">AIコーチ</h2>
                    <p className="text-xs text-gray-500">対話を通じてエピソードを引き出します</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {msg.content}
                                </div>
                                {msg.draftContent && (
                                    <div className="mt-3 rounded bg-gray-50 p-3 text-xs text-gray-600">
                                        <div className="mb-1 font-bold text-gray-900">反映されたドラフト</div>
                                        {msg.draftContent}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {/* Shortcuts (only show if last message is from assistant and not typing) */}
                    {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !isTyping && messages[messages.length - 1].suggestedShortcuts && (
                        <div className="flex flex-wrap justify-start gap-2 pl-2">
                            {messages[messages.length - 1].suggestedShortcuts!.map((text) => (
                                <button
                                    key={text}
                                    type="button"
                                    onClick={() => onSendMessage(text)}
                                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 hover:shadow"
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    )}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200">
                                <div className="flex gap-1">
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex gap-2 items-end">
                        <textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder={isTyping ? "AIが回答を生成中..." : "AIに相談する..."}
                            rows={1}
                            disabled={isTyping}
                            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100 disabled:text-gray-500"
                            style={{
                                minHeight: '44px',
                                maxHeight: '150px',
                                msOverflowStyle: 'none',  /* IE and Edge */
                                scrollbarWidth: 'none'  /* Firefox */
                            }}
                        />
                        <style jsx>{`
                            textarea::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="flex h-[44px] w-[44px] items-center justify-center rounded-lg bg-gray-900 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => onSendMessage('これまでの内容でドラフトを書いてみて')}
                        disabled={isTyping}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        <Bot className="h-4 w-4" />
                        AIにドラフト生成を依頼
                    </button>
                </form>
            </div>
        </div>
    );
}
