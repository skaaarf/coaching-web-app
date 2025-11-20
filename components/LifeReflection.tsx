'use client';

import { useState, useEffect } from 'react';
import { LifeReflectionData, EraData, EraResponse, TurningPoint } from '@/types';
import AgeSelectionScreen from './life-reflection/AgeSelectionScreen';
import EraListScreen from './life-reflection/EraListScreen';
import QuestionListScreen from './life-reflection/QuestionListScreen';
import QuestionInputScreen from './life-reflection/QuestionInputScreen';
import SatisfactionInputScreen from './life-reflection/SatisfactionInputScreen';
import LifeSatisfactionGraph from './life-reflection/LifeSatisfactionGraph';
import TurningPointDialog from './life-reflection/TurningPointDialog';
import { getEraById } from '@/lib/lifeReflectionData';

interface Props {
    initialData?: LifeReflectionData;
    onComplete: (data: LifeReflectionData) => void;
}

type Screen =
    | { type: 'age-selection' }
    | { type: 'era-list' }
    | { type: 'question-list'; eraId: string }
    | { type: 'question-input'; eraId: string; questionId: string }
    | { type: 'satisfaction-input'; eraId: string }
    | { type: 'graph' };

const createEmptyEraData = (eraId: string): EraData => ({
    eraId,
    questionResponses: [],
    satisfaction: null,
    completed: false,
});

export default function LifeReflection({ initialData, onComplete }: Props) {
    const [lifeData, setLifeData] = useState<LifeReflectionData>(
        initialData || {
            userAge: 0,
            eras: {
                elementary: null,
                middleschool: null,
                highschool: null,
                college: null,
                working: null,
            },
            turningPoints: [],
        }
    );

    const [currentScreen, setCurrentScreen] = useState<Screen>(
        lifeData.userAge === 0 ? { type: 'age-selection' } : { type: 'era-list' }
    );

    const [showTurningPointDialog, setShowTurningPointDialog] = useState(false);

    // Update parent on data changes
    useEffect(() => {
        if (lifeData.userAge > 0) {
            onComplete(lifeData);
        }
    }, [lifeData, onComplete]);

    const handleAgeSelect = (ageRange: number) => {
        setLifeData((prev) => ({
            ...prev,
            userAge: ageRange,
        }));
        setCurrentScreen({ type: 'era-list' });
    };

    const handleEraSelect = (eraId: string) => {
        // Ensure era data exists
        const eraKey = eraId as keyof typeof lifeData.eras;
        if (!lifeData.eras[eraKey]) {
            setLifeData((prev) => ({
                ...prev,
                eras: {
                    ...prev.eras,
                    [eraKey]: createEmptyEraData(eraId),
                },
            }));
        }
        setCurrentScreen({ type: 'question-list', eraId });
    };

    const handleQuestionSelect = (eraId: string, questionId: string) => {
        setCurrentScreen({ type: 'question-input', eraId, questionId });
    };

    const handleSaveResponse = (eraId: string, questionId: string, response: string) => {
        const eraKey = eraId as keyof typeof lifeData.eras;
        const currentEra = lifeData.eras[eraKey] || createEmptyEraData(eraId);

        // Remove existing response for this question
        const filteredResponses = currentEra.questionResponses.filter(
            (r) => r.questionId !== questionId
        );

        const newResponse: EraResponse = {
            questionId,
            response,
            timestamp: new Date(),
        };

        const eraConfig = getEraById(eraId);
        const totalQuestions = eraConfig?.questions.length || 3;
        const newResponses = [...filteredResponses, newResponse];

        setLifeData((prev) => ({
            ...prev,
            eras: {
                ...prev.eras,
                [eraKey]: {
                    ...currentEra,
                    questionResponses: newResponses,
                    // Auto-mark completed if all questions answered and satisfaction set
                    completed:
                        newResponses.length === totalQuestions &&
                        currentEra.satisfaction !== null,
                },
            },
        }));

        setCurrentScreen({ type: 'question-list', eraId });
    };

    const handleSatisfactionSave = (eraId: string, satisfaction: number) => {
        const eraKey = eraId as keyof typeof lifeData.eras;
        const currentEra = lifeData.eras[eraKey] || createEmptyEraData(eraId);

        const eraConfig = getEraById(eraId);
        const totalQuestions = eraConfig?.questions.length || 3;

        setLifeData((prev) => ({
            ...prev,
            eras: {
                ...prev.eras,
                [eraKey]: {
                    ...currentEra,
                    satisfaction,
                    completed: currentEra.questionResponses.length === totalQuestions,
                },
            },
        }));

        setCurrentScreen({ type: 'era-list' });
    };

    const handleAddTurningPoint = (
        turningPoint: Omit<TurningPoint, 'id' | 'timestamp'>
    ) => {
        const newTurningPoint: TurningPoint = {
            ...turningPoint,
            id: `tp_${Date.now()}`,
            timestamp: new Date(),
        };

        setLifeData((prev) => ({
            ...prev,
            turningPoints: [...prev.turningPoints, newTurningPoint],
        }));
    };

    // Render current screen
    const renderScreen = () => {
        switch (currentScreen.type) {
            case 'age-selection':
                return <AgeSelectionScreen onAgeSelect={handleAgeSelect} />;

            case 'era-list':
                return (
                    <EraListScreen
                        userAge={lifeData.userAge}
                        lifeData={lifeData}
                        onEraSelect={handleEraSelect}
                        onViewGraph={() => setCurrentScreen({ type: 'graph' })}
                    />
                );

            case 'question-list': {
                const eraKey = currentScreen.eraId as keyof typeof lifeData.eras;
                const eraData = lifeData.eras[eraKey] || createEmptyEraData(currentScreen.eraId);
                return (
                    <QuestionListScreen
                        eraId={currentScreen.eraId}
                        eraData={eraData}
                        onQuestionSelect={(qId) =>
                            handleQuestionSelect(currentScreen.eraId, qId)
                        }
                        onSatisfactionInput={() =>
                            setCurrentScreen({
                                type: 'satisfaction-input',
                                eraId: currentScreen.eraId,
                            })
                        }
                        onBack={() => setCurrentScreen({ type: 'era-list' })}
                    />
                );
            }

            case 'question-input': {
                const eraKey = currentScreen.eraId as keyof typeof lifeData.eras;
                const eraData = lifeData.eras[eraKey];
                const existingResponse = eraData?.questionResponses.find(
                    (r) => r.questionId === currentScreen.questionId
                )?.response;

                return (
                    <QuestionInputScreen
                        eraId={currentScreen.eraId}
                        questionId={currentScreen.questionId}
                        existingResponse={existingResponse}
                        onSaveResponse={(response) =>
                            handleSaveResponse(
                                currentScreen.eraId,
                                currentScreen.questionId,
                                response
                            )
                        }
                        onBack={() =>
                            setCurrentScreen({
                                type: 'question-list',
                                eraId: currentScreen.eraId,
                            })
                        }
                    />
                );
            }

            case 'satisfaction-input': {
                const eraKey = currentScreen.eraId as keyof typeof lifeData.eras;
                const eraData = lifeData.eras[eraKey];
                const eraConfig = getEraById(currentScreen.eraId);

                return (
                    <SatisfactionInputScreen
                        eraId={currentScreen.eraId}
                        eraName={eraConfig?.name || ''}
                        currentSatisfaction={eraData?.satisfaction || null}
                        onSave={(satisfaction) =>
                            handleSatisfactionSave(currentScreen.eraId, satisfaction)
                        }
                        onBack={() =>
                            setCurrentScreen({
                                type: 'question-list',
                                eraId: currentScreen.eraId,
                            })
                        }
                    />
                );
            }

            case 'graph':
                return (
                    <LifeSatisfactionGraph
                        data={lifeData}
                        onAddTurningPoint={() => setShowTurningPointDialog(true)}
                        onBack={() => setCurrentScreen({ type: 'era-list' })}
                    />
                );

            default:
                return <div>Unknown screen</div>;
        }
    };

    return (
        <>
            {renderScreen()}

            <TurningPointDialog
                isOpen={showTurningPointDialog}
                userAge={lifeData.userAge}
                onAdd={handleAddTurningPoint}
                onClose={() => setShowTurningPointDialog(false)}
            />
        </>
    );
}
