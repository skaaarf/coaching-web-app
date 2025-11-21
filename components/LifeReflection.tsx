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
    onStartDialogue?: (questionContext: string) => void;
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

export default function LifeReflection({ initialData, onComplete, onStartDialogue }: Props) {
    console.log('LifeReflection Render:', { initialData });

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

    const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
        console.log('LifeReflection Initial Screen State:', { userAge: initialData?.userAge });
        // 年齢が設定済みなら（0より大きい）、最初から時代リストを表示
        if (initialData?.userAge && initialData.userAge > 0) {
            return { type: 'era-list' };
        }
        return { type: 'age-selection' };
    });

    // Update state when initialData changes (e.g. after async load)
    useEffect(() => {
        if (initialData) {
            console.log('LifeReflection useEffect: initialData updated', initialData);
            setLifeData(prevData => {
                // CRITICAL FIX: If we have ANY local data (userAge > 0), DO NOT OVERWRITE IT with initialData
                // This assumes that once the user starts, local state is the source of truth until reload.
                if (prevData.userAge > 0) {
                    console.log('Ignoring initialData update because local state has data');
                    return prevData;
                }

                // Only update if local state is empty
                if (initialData.userAge > 0) {
                    return initialData;
                }

                return prevData;
            });

            // If we have a valid age and we're still on age selection, move to era list
            if (initialData.userAge > 0) {
                setCurrentScreen(prevScreen => {
                    if (prevScreen.type === 'age-selection') {
                        console.log('Switching to era-list because userAge is set');
                        return { type: 'era-list' };
                    }
                    return prevScreen;
                });
            }
        }
    }, [initialData]);

    console.log('LifeReflection State:', { currentScreen, lifeData });

    const [showTurningPointDialog, setShowTurningPointDialog] = useState(false);

    // Don't auto-call onComplete - only call it when user explicitly views graph

    const handleAgeSelect = (ageRange: number) => {
        console.log('handleAgeSelect called:', ageRange);
        const newData = { ...lifeData, userAge: ageRange };
        setLifeData(newData);
        // 年齢選択後は時代リストへ
        setCurrentScreen({ type: 'era-list' });
        // ここで一旦保存して、次回以降スキップできるようにする
        console.log('Calling onComplete with:', newData);
        onComplete(newData);
    };

    const handleEraSelect = (eraId: string) => {
        // 時代が選択されたら、その時代の質問リストへ
        // データ構造を初期化
        if (!lifeData.eras[eraId as keyof typeof lifeData.eras]) {
            setLifeData(prev => ({
                ...prev,
                eras: {
                    ...prev.eras,
                    [eraId]: createEmptyEraData(eraId)
                },
            }));
        }
        setCurrentScreen({ type: 'question-list', eraId });
    };

    const handleBack = () => {
        if (currentScreen.type === 'question-list') {
            setCurrentScreen({ type: 'era-list' });
        } else if (currentScreen.type === 'era-list') {
            // 年齢選択に戻るか、ホームに戻るか
            // ユーザーの要望「初期設定は一回だけ」に基づき、
            // ここでの戻るは実質的に何もしないか、年齢再選択を許容するか。
            // 今回は年齢再選択に戻れるようにする（設定変更のため）
            setCurrentScreen({ type: 'age-selection' });
        }
    };

    const handleQuestionSelect = (eraId: string, questionId: string) => {
        // AI対話を開始
        const eraConfig = getEraById(eraId);
        const question = eraConfig?.questions.find(q => q.id === questionId);
        const eraKey = eraId as keyof typeof lifeData.eras;
        const eraData = lifeData.eras[eraKey];

        if (onStartDialogue && question) {
            // 既存の回答があれば含める
            const existingResponse = eraData?.questionResponses.find(
                r => r.questionId === questionId
            )?.response;

            const contextMessage = existingResponse
                ? `[質問]: ${question.text}\n\n[前回の回答]:\n${existingResponse}\n\n※この回答を見直したり、深掘りしてみましょう。`
                : `[質問]: ${question.text}`;

            onStartDialogue(contextMessage);
        }
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

        const newData = {
            ...lifeData,
            eras: {
                ...lifeData.eras,
                [eraKey]: {
                    ...currentEra,
                    questionResponses: newResponses,
                    // Auto-mark completed if all questions answered and satisfaction set
                    completed:
                        newResponses.length === totalQuestions &&
                        currentEra.satisfaction !== null,
                },
            },
        };

        setLifeData(newData);
        console.log('Saving response:', newData);
        onComplete(newData);

        setCurrentScreen({ type: 'question-list', eraId });
    };

    const handleSatisfactionSave = (eraId: string, satisfaction: number) => {
        const eraKey = eraId as keyof typeof lifeData.eras;
        const currentEra = lifeData.eras[eraKey] || createEmptyEraData(eraId);

        const eraConfig = getEraById(eraId);
        const totalQuestions = eraConfig?.questions.length || 3;

        const newData = {
            ...lifeData,
            eras: {
                ...lifeData.eras,
                [eraKey]: {
                    ...currentEra,
                    satisfaction,
                    completed:
                        currentEra.questionResponses.length === totalQuestions,
                },
            },
        };

        setLifeData(newData);
        console.log('Saving satisfaction:', newData);
        onComplete(newData);
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
                    />
                );

            case 'question-list': {
                const eraKey = currentScreen.eraId as keyof typeof lifeData.eras;
                const eraData = lifeData.eras[eraKey] || createEmptyEraData(currentScreen.eraId);
                return (
                    <QuestionListScreen
                        eraId={currentScreen.eraId}
                        data={lifeData}
                        onSelectQuestion={(eraId: string, questionId: string) =>
                            handleQuestionSelect(eraId, questionId)
                        }
                        onUpdateSatisfaction={(eraId: string, value: number) =>
                            handleSatisfactionSave(eraId, value)
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
