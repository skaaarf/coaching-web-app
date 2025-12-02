import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Globe, Mic, Plus } from 'lucide-react';

interface TextInputProps {
    placeholder?: string;
    multiline?: boolean;
    onSubmit: (value: string) => void;
    disabled?: boolean;
}

export default function TextInput({ placeholder, multiline, onSubmit, disabled }: TextInputProps) {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    const handleSubmit = () => {
        if (!value.trim()) return;
        onSubmit(value);
        setValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !multiline) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full">
            <div className="group relative flex w-full flex-col gap-2 rounded-3xl border border-gray-200 bg-white p-2 shadow-lg transition-all focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400">

                {/* Input Area */}
                <div className="relative flex items-end gap-2">
                    {multiline ? (
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder || "質問してみましょう..."}
                            className="max-h-40 min-h-[3rem] flex-1 resize-none border-0 bg-transparent py-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 disabled:text-gray-400"
                            rows={1}
                            disabled={disabled}
                        />
                    ) : (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder || "質問してみましょう..."}
                            className="flex-1 border-0 bg-transparent py-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 disabled:text-gray-400"
                            disabled={disabled}
                        />
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!value.trim() || disabled}
                        className="mb-1 mr-1 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white transition-all hover:bg-purple-700 disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                        <ArrowUp className="h-5 w-5" />
                    </button>
                </div>


            </div>
        </div>
    );
}
