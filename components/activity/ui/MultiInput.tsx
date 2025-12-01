import { useState } from 'react';
import { Send, Plus, X } from 'lucide-react';

interface MultiInputProps {
    inputs: { label: string; placeholder: string }[];
    onSubmit: (values: string[]) => void;
}

export default function MultiInput({ inputs, onSubmit }: MultiInputProps) {
    const [values, setValues] = useState<string[]>(new Array(inputs.length).fill(''));

    const handleChange = (index: number, value: string) => {
        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);
    };

    const handleSubmit = () => {
        // Filter out empty values? Or keep them? 
        // Usually for "List 5 things", we might want at least some filled.
        // Let's require at least the first one.
        if (!values[0].trim()) return;
        onSubmit(values);
    };

    return (
        <div className="w-full space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            {inputs.map((input, index) => (
                <div key={index} className="flex items-center gap-3">
                    <span className="w-6 text-right text-sm font-bold text-gray-400">{input.label}</span>
                    <input
                        type="text"
                        value={values[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder={input.placeholder}
                        className="flex-1 rounded-lg border-0 bg-gray-50 py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                </div>
            ))}
            <div className="pt-2">
                <button
                    onClick={handleSubmit}
                    disabled={!values[0].trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white transition-all hover:bg-primary/90 disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                    <span>決定</span>
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
