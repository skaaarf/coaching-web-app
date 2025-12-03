import { Option } from '@/types/activity';
import { ListPlus } from 'lucide-react';

interface InlineOptionsProps {
    options: Option[];
    onSelect: (value: string) => void;
    disabled?: boolean;
}

export default function InlineOptions({ options, onSelect, disabled }: InlineOptionsProps) {
    return (
        <div className="w-full max-w-[90%] animate-fade-in">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <ListPlus className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-semibold text-base">選択してください</span>
            </div>
            <div className="flex flex-col gap-3 items-start">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onSelect(option.value)}
                        disabled={disabled}
                        className="w-fit max-w-full text-left px-6 py-4 rounded-2xl bg-white border-2 border-blue-200 text-gray-900 hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-pre-wrap font-medium text-base"
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
