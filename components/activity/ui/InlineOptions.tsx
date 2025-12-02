import { Option } from '@/types/activity';
import { ListPlus } from 'lucide-react';

interface InlineOptionsProps {
    options: Option[];
    onSelect: (value: string) => void;
    disabled?: boolean;
}

export default function InlineOptions({ options, onSelect, disabled }: InlineOptionsProps) {
    return (
        <div className="w-full max-w-[90%]">
            <div className="flex items-center gap-2 mb-3 text-gray-700">
                <ListPlus className="w-5 h-5" />
                <span className="font-bold text-lg">関連</span>
            </div>
            <div className="flex flex-col gap-3 items-start">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onSelect(option.value)}
                        disabled={disabled}
                        className="w-fit max-w-full text-left px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-pre-wrap"
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
