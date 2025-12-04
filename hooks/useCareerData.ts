'use client';

import { useState, useEffect } from 'react';
import { activities, modules } from '@/data/activities';
import { ActivityDefinition, Module } from '@/types/activity';
import { ProfileAnalysisData } from '@/types/profile';

interface HistoryItem {
    type: 'mikata' | 'user' | 'summary';
    content: string | any;
}

interface CareerDataState {
    completedActivityIds: string[];
    inProgressModuleIds: string[];
    moduleProgress: Record<string, number>; // moduleId -> progress (0-100)
    answers: Record<string, any>; // activityId -> stepId -> answer
    chatHistory: Record<string, HistoryItem[]>; // activityId -> history
    profileAnalysis: ProfileAnalysisData | null;
}

const STORAGE_KEY = 'career_app_data_v1';

const INITIAL_STATE: CareerDataState = {
    completedActivityIds: [],
    inProgressModuleIds: [],
    moduleProgress: {},
    answers: {},
    chatHistory: {},
    profileAnalysis: null,
};

export function useCareerData() {
    const [state, setState] = useState<CareerDataState>(INITIAL_STATE);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setState(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved data', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }, [state, isLoaded]);

    const getModule = (id: string) => modules.find((m) => m.id === id);
    const getActivity = (id: string) => activities[id];

    const startModule = (moduleId: string) => {
        if (!state.inProgressModuleIds.includes(moduleId)) {
            setState((prev) => ({
                ...prev,
                inProgressModuleIds: [moduleId, ...prev.inProgressModuleIds],
                moduleProgress: {
                    ...prev.moduleProgress,
                    [moduleId]: 0,
                },
            }));
        }
    };

    const completeActivity = (activityId: string) => {
        if (!state.completedActivityIds.includes(activityId)) {
            setState((prev) => ({
                ...prev,
                completedActivityIds: [...prev.completedActivityIds, activityId],
            }));
        }
    };

    const updateModuleProgress = (moduleId: string, progress: number) => {
        setState((prev) => ({
            ...prev,
            moduleProgress: {
                ...prev.moduleProgress,
                [moduleId]: progress,
            },
        }));
    };

    const saveActivityProgress = (activityId: string, history: HistoryItem[], answers: any) => {
        setState((prev) => ({
            ...prev,
            chatHistory: {
                ...prev.chatHistory,
                [activityId]: history,
            },
            answers: {
                ...prev.answers,
                [activityId]: answers,
            },
        }));
    };

    const saveProfileAnalysis = (data: ProfileAnalysisData) => {
        setState((prev) => ({
            ...prev,
            profileAnalysis: data,
        }));
    };

    const clearData = () => {
        setState(INITIAL_STATE);
        localStorage.removeItem(STORAGE_KEY);
    };

    const clearActivityData = (activityId: string) => {
        setState((prev) => {
            const newHistory = { ...prev.chatHistory };
            delete newHistory[activityId];

            const newAnswers = { ...prev.answers };
            delete newAnswers[activityId];

            const newCompletedIds = prev.completedActivityIds.filter(id => id !== activityId);

            return {
                ...prev,
                chatHistory: newHistory,
                answers: newAnswers,
                completedActivityIds: newCompletedIds,
            };
        });
    };

    // Derived state
    const inProgressModules = state.inProgressModuleIds
        .map((id) => {
            const module = getModule(id);
            return module ? { ...module, progress: state.moduleProgress[id] || 0 } : null;
        })
        .filter((m): m is Module & { progress: number } => m !== null);

    const completedActivities = state.completedActivityIds
        .map((id) => getActivity(id))
        .filter((a): a is ActivityDefinition => a !== undefined);

    const lastActiveItem = inProgressModules.length > 0 ? inProgressModules[0] : null;

    return {
        state,
        isLoaded,
        inProgressModules,
        completedActivities,
        lastActiveItem,
        startModule,
        completeActivity,
        updateModuleProgress,
        saveActivityProgress,
        saveProfileAnalysis,
        clearData,
        clearActivityData,
    };
}
