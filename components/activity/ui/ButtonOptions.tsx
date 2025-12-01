import { Option } from '@/types/activity';

interface ButtonOptionsProps {
    options: Option[];
    onSelect: (value: string) => void;
}

export default function ButtonOptions({ options, onSelect }: ButtonOptionsProps) {
    return (
        <div className="flex flex-col gap-3">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                    className="w-full rounded-xl border-2 border-gray-100 bg-white p-4 text-left font-medium text-gray-900 transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.99]"
                >
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    {option.label}
                </button>
            ))}
        </div>
    );
}
