'use client';

import { LifeReflectionData } from '@/types';
import LifeSatisfactionGraph from './life-reflection/LifeSatisfactionGraph';
import { useState } from 'react';
import TurningPointDialog from './life-reflection/TurningPointDialog';

interface Props {
    data: LifeReflectionData;
    onStartDialogue: () => void;
}

export default function LifeReflectionResult({ data, onStartDialogue }: Props) {
    console.log('LifeReflectionResult Render:', { data });
    const [showTurningPointDialog, setShowTurningPointDialog] = useState(false);

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <LifeSatisfactionGraph
                    data={data}
                    onAddTurningPoint={() => setShowTurningPointDialog(true)}
                    onBack={() => { }} // In result view, no back button needed
                />

                {/* Dialogue Button */}
                <div className="px-4 pb-6">
                    <button
                        onClick={onStartDialogue}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                    >
                        💬 この結果について話してみる
                    </button>
                </div>
            </div>

            <TurningPointDialog
                isOpen={showTurningPointDialog}
                userAge={data.userAge}
                onAdd={() => { }} // Read-only in result view
                onClose={() => setShowTurningPointDialog(false)}
            />
        </>
    );
}
