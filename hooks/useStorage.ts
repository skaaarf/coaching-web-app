/**
 * Custom hook for unified storage access
 * Automatically uses Supabase when authenticated, localStorage when not
 */

import { useMemo } from 'react';
import { useAuth } from '@/components/SessionProvider';
import * as unifiedStorage from '@/lib/storage-unified';
import { ModuleProgress, UserInsights, InteractiveModuleProgress, ValueSnapshot } from '@/types';

export function useStorage() {
  const { userId } = useAuth();

  return useMemo(() => ({
    // Module Progress
    getModuleProgress: async (moduleId: string): Promise<ModuleProgress | null> => {
      return await unifiedStorage.getModuleProgress(moduleId, userId || undefined);
    },

    saveModuleProgress: async (moduleId: string, progress: ModuleProgress): Promise<void> => {
      await unifiedStorage.saveModuleProgress(moduleId, progress, userId || undefined);
    },

    getAllModuleProgress: async (): Promise<Record<string, ModuleProgress>> => {
      return await unifiedStorage.getAllModuleProgress(userId || undefined);
    },

    // Interactive Module Progress
    getInteractiveModuleProgress: async (moduleId: string): Promise<InteractiveModuleProgress | null> => {
      return await unifiedStorage.getInteractiveModuleProgress(moduleId, userId || undefined);
    },

    saveInteractiveModuleProgress: async (moduleId: string, progress: InteractiveModuleProgress): Promise<void> => {
      await unifiedStorage.saveInteractiveModuleProgress(moduleId, progress, userId || undefined);
    },

    getAllInteractiveModuleProgress: async (): Promise<Record<string, InteractiveModuleProgress>> => {
      return await unifiedStorage.getAllInteractiveModuleProgress(userId || undefined);
    },

    // User Insights
    getUserInsights: async (): Promise<UserInsights | null> => {
      return await unifiedStorage.getUserInsights(userId || undefined);
    },

    saveUserInsights: async (insights: UserInsights): Promise<void> => {
      await unifiedStorage.saveUserInsights(insights, userId || undefined);
    },

    // Clear all data
    clearAllData: async (): Promise<void> => {
      await unifiedStorage.clearAllData(userId || undefined);
    },

    // Value Snapshots
    getCurrentValueSnapshot: async (): Promise<ValueSnapshot | null> => {
      return await unifiedStorage.getCurrentValueSnapshot();
    },

    saveValueSnapshot: async (snapshot: ValueSnapshot): Promise<void> => {
      await unifiedStorage.saveValueSnapshot(snapshot);
    },

    getAllValueSnapshots: async (): Promise<ValueSnapshot[]> => {
      return await unifiedStorage.getAllValueSnapshots();
    },

    // Sessions
    getModuleSessions: async (moduleId: string): Promise<ModuleProgress[]> => {
      return await unifiedStorage.getModuleSessions(moduleId);
    },

    getModuleSession: async (moduleId: string, sessionId: string): Promise<ModuleProgress | null> => {
      return await unifiedStorage.getModuleSession(moduleId, sessionId);
    },

    getInteractiveModuleSessions: async (moduleId: string): Promise<InteractiveModuleProgress[]> => {
      return await unifiedStorage.getInteractiveModuleSessions(moduleId);
    },

    getInteractiveModuleSession: async (moduleId: string, sessionId: string): Promise<InteractiveModuleProgress | null> => {
      return await unifiedStorage.getInteractiveModuleSession(moduleId, sessionId);
    },

    // Metadata
    isAuthenticated: !!userId,
    userId: userId || null,
  }), [userId]); // Only re-create when userId changes
}
