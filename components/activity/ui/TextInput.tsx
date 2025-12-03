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
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
            return;
        }
        if (e.key === 'Enter' && !e.shiftKey && !multiline) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full">
            <div className="group relative flex w-full flex-col gap-2 rounded-2xl border-2 border-gray-300 bg-gray-50 p-3 shadow-md transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-lg">

                {/* Input Area */}
                <div className="relative flex items-end gap-3">
                    {multiline ? (
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder || "メッセージを入力..."}
                            className="max-h-40 min-h-[3rem] flex-1 resize-none border-0 bg-transparent py-3 px-2 text-gray-900 placeholder:text-gray-500 focus:ring-0 text-base leading-relaxed disabled:text-gray-400"
                            rows={1}
                            disabled={disabled}
                        />
                    ) : (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder || "メッセージを入力..."}
                            className="flex-1 border-0 bg-transparent py-3 px-2 text-gray-900 placeholder:text-gray-500 focus:ring-0 text-base disabled:text-gray-400"
                            disabled={disabled}
                        />
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!value.trim() || disabled}
                        className="mb-1 mr-1 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-700 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
                    >
                        <ArrowUp className="h-5 w-5" />
                    </button>
                </div>


            </div>
        </div>
    );
}
