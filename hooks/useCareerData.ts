'use client';

import { useState, useEffect } from 'react';
import { activities, modules, Activity, Module } from '@/data/activities';

interface CareerDataState {
    completedActivityIds: string[];
    inProgressModuleIds: string[];
    moduleProgress: Record<string, number>; // moduleId -> progress (0-100)
}

export function useCareerData() {
    // Initialize with some mock data
    const [state, setState] = useState<CareerDataState>({
        completedActivityIds: ['act-1'],
        inProgressModuleIds: ['mod-1'],
        moduleProgress: {
            'mod-1': 30,
        },
    });

    const getModule = (id: string) => modules.find((m) => m.id === id);
    const getActivity = (id: string) => activities.find((a) => a.id === id);

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

    // Derived state
    const inProgressModules = state.inProgressModuleIds
        .map((id) => {
            const module = getModule(id);
            return module ? { ...module, progress: state.moduleProgress[id] || 0 } : null;
        })
        .filter((m): m is Module & { progress: number } => m !== null);

    const completedActivities = state.completedActivityIds
        .map((id) => getActivity(id))
        .filter((a): a is Activity => a !== null);

    const lastActiveItem = inProgressModules.length > 0 ? inProgressModules[0] : null;

    return {
        state,
        inProgressModules,
        completedActivities,
        lastActiveItem,
        startModule,
        completeActivity,
        updateModuleProgress,
    };
}
