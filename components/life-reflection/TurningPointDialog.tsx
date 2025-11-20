'use client';

import { useState } from 'react';
import { TurningPoint } from '@/types';

interface Props {
    isOpen: boolean;
    userAge: number;
    onAdd: (turningPoint: Omit<TurningPoint, 'id' | 'timestamp'>) => void;
    onClose: () => void;
}

export default function TurningPointDialog({
    isOpen,
    userAge,
    onAdd,
    onClose,
}: Props) {
    const [age, setAge] = useState<number>(Math.floor(userAge / 2));
    const [description, setDescription] = useState('');

    const handleAdd = () => {
        if (description.trim() && age >= 12 && age <= userAge) {
            onAdd({ age, description: description.trim() });
            setAge(Math.floor(userAge / 2));
            setDescription('');
            onClose();
        }
    };

    const handleClose = () => {
        setDescription('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    ⭐ 転機を追加
                </h3>

                <div className="space-y-4">
                    {/* Age Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            何歳の時？
                        </label>
                        <input
                            type="number"
                            min="12"
                            max={userAge}
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none text-base"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            12歳から{userAge}歳までの間で入力
                        </p>
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            どんな出来事？
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="例: 高校受験に合格した、部活で全国大会に出た、家族が引っ越した..."
                            className="w-full min-h-[100px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none text-base"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold text-sm transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={!description.trim() || age < 12 || age > userAge}
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${description.trim() && age >= 12 && age <= userAge
                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            追加する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
