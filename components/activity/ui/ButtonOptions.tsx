import { Option } from '@/types/activity';

interface ButtonOptionsProps {
    options: Option[];
    onSelect: (value: string) => void;
    disabled?: boolean;
}

export default function ButtonOptions({ options, onSelect, disabled }: ButtonOptionsProps) {
    return (
        <div className="flex flex-col gap-3">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                    disabled={disabled}
                    className="w-full rounded-xl border-2 border-gray-100 bg-white p-4 text-left font-medium text-gray-900 transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-100 disabled:hover:bg-white"
                >
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    {option.label}
                </button>
            ))}
        </div>
    );
}
