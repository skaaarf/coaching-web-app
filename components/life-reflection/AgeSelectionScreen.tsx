'use client';

interface Props {
    onAgeSelect: (ageRange: number) => void;
}

const AGE_OPTIONS = [
    { range: 15, label: '15歳以下', emoji: '👶', description: '中学生以下' },
    { range: 18, label: '16-18歳', emoji: '🧑‍🎓', description: '高校生' },
    { range: 22, label: '19-22歳', emoji: '🎓', description: '大学生' },
    { range: 99, label: '23歳以上', emoji: '💼', description: '社会人' },
];

export default function AgeSelectionScreen({ onAgeSelect }: Props) {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    あなたは今何歳ですか？
                </h2>
                <p className="text-sm text-gray-600">
                    年齢に応じて、振り返る時代が表示されます
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AGE_OPTIONS.map((option) => (
                    <button
                        key={option.range}
                        onClick={() => onAgeSelect(option.range)}
                        className="bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 transition-all duration-200 shadow-md hover:shadow-lg group"
                    >
                        <div className="text-5xl mb-3">{option.emoji}</div>
                        <div className="text-lg font-bold text-gray-900 mb-1">
                            {option.label}
                        </div>
                        <div className="text-sm text-gray-600">
                            {option.description}
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg inline-block">
                    💡 後から変更することはできませんが、すべての回答は保存されます
                </p>
            </div>
        </div>
    );
}
