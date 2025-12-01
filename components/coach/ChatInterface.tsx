'use client';

import { useState } from 'react';
import { Send, Paperclip, Mic, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'こんにちは！🌟 あなたにぴったりのアクティビティを見つけましょう。どのようなキャリアサポートが必要ですか？進路を探している、面接の準備をしている、あるいは特定の何かをお探しですか？',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue('');

        // Mock response
        setTimeout(() => {
            const newAssistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '承知しました。関連するアクティビティを探してみますね。',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, newAssistantMessage]);
        }, 1000);
    };

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-gray-900">コーチ</span>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-900">
                    リセット
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''
                            }`}
                    >
                        {message.role === 'assistant' && (
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                                <Sparkles className="h-4 w-4" />
                            </div>
                        )}
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${message.role === 'user'
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-white text-gray-900'
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4">
                <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="コーチにメッセージを送る..."
                        className="block w-full resize-none border-0 bg-transparent py-3 pl-4 pr-12 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        rows={2}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Paperclip className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Mic className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="rounded-lg bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <p className="mt-2 text-center text-xs text-gray-400">
                    コーチは間違いを犯す可能性があります。重要な事実は確認してください。
                </p>
            </div>
        </div>
    );
}
