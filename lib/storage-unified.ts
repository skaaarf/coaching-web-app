/**
 * Unified storage layer that uses Supabase when authenticated, localStorage when not
 * 未ログインユーザーは匿名セッションIDでSupabaseに保存
 */

import { ModuleProgress, UserInsights, InteractiveModuleProgress, ValueSnapshot } from '@/types';
import * as localStorageLib from './storage';
import * as supabaseStorageLib from './storage-supabase';
import { getOrCreateAnonymousSessionId } from './anonymous-session';
import { isSupabaseConfigured } from './supabase';

let hasLoggedSupabaseFallback = false;

const logSupabaseFallback = (error: unknown) => {
  if (hasLoggedSupabaseFallback) return;
  console.warn('Supabase unavailable, falling back to local storage.', error);
  hasLoggedSupabaseFallback = true;
};

async function withStorageFallback<T>(supabaseOp: () => Promise<T>, localOp: () => T | Promise<T>): Promise<T> {
  if (!isSupabaseConfigured) {
    return await Promise.resolve(localOp());
  }

  try {
    return await supabaseOp();
  } catch (error) {
    logSupabaseFallback(error);
    return await Promise.resolve(localOp());
  }
}

// Module Progress functions
export async function getModuleProgress(moduleId: string, userId?: string): Promise<ModuleProgress | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await supabaseStorageLib.getModuleProgress(userOrAnonymousId, moduleId);
    },
    () => localStorageLib.getModuleProgress(moduleId)
  );
}

export async function saveModuleProgress(moduleId: string, progress: ModuleProgress, userId?: string): Promise<void> {
  await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      await supabaseStorageLib.saveModuleProgress(userOrAnonymousId, moduleId, progress);
    },
    () => localStorageLib.saveModuleProgress(moduleId, progress)
  );
}

export async function getAllModuleProgress(userId?: string): Promise<Record<string, ModuleProgress>> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await supabaseStorageLib.getAllModuleProgress(userOrAnonymousId);
    },
    () => localStorageLib.getAllModuleProgress()
  );
}

// Interactive Module Progress functions
export async function getInteractiveModuleProgress(moduleId: string, userId?: string): Promise<InteractiveModuleProgress | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await supabaseStorageLib.getInteractiveModuleProgress(userOrAnonymousId, moduleId);
    },
    () => localStorageLib.getInteractiveModuleProgress(moduleId)
  );
}

export async function saveInteractiveModuleProgress(moduleId: string, progress: InteractiveModuleProgress, userId?: string): Promise<void> {
  await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      await supabaseStorageLib.saveInteractiveModuleProgress(userOrAnonymousId, moduleId, progress);
    },
    () => localStorageLib.saveInteractiveModuleProgress(moduleId, progress)
  );
}

export async function getAllInteractiveModuleProgress(userId?: string): Promise<Record<string, InteractiveModuleProgress>> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await supabaseStorageLib.getAllInteractiveModuleProgress(userOrAnonymousId);
    },
    () => localStorageLib.getAllInteractiveModuleProgress()
  );
}

// User Insights functions
export async function getUserInsights(userId?: string): Promise<UserInsights | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await supabaseStorageLib.getUserInsights(userOrAnonymousId);
    },
    () => localStorageLib.getUserInsights()
  );
}

export async function saveUserInsights(insights: UserInsights, userId?: string): Promise<void> {
  await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      await supabaseStorageLib.saveUserInsights(userOrAnonymousId, insights);
    },
    () => localStorageLib.saveUserInsights(insights)
  );
}

// Clear all data
export async function clearAllData(userId?: string): Promise<void> {
  await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      await supabaseStorageLib.clearAllData(userOrAnonymousId);
    },
    () => localStorageLib.clearAllData()
  );
}

// Value snapshots functions (localStorage only for now)
export async function getCurrentValueSnapshot(): Promise<ValueSnapshot | null> {
  return localStorageLib.getCurrentValueSnapshot();
}

export async function saveValueSnapshot(snapshot: ValueSnapshot): Promise<void> {
  localStorageLib.saveValueSnapshot(snapshot);
}

export async function getAllValueSnapshots(): Promise<ValueSnapshot[]> {
  return localStorageLib.getAllValueSnapshots();
}

// Session functions
export async function getModuleSessions(moduleId: string, userId?: string): Promise<ModuleProgress[]> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await supabaseStorageLib.getModuleSessions(userOrAnonymousId, moduleId);
    },
    () => localStorageLib.getModuleSessions(moduleId)
  );
}

export async function getModuleSession(moduleId: string, sessionId: string, userId?: string): Promise<ModuleProgress | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await supabaseStorageLib.getModuleSession(userOrAnonymousId, moduleId, sessionId);
    },
    () => localStorageLib.getModuleSession(moduleId, sessionId)
  );
}

export async function getInteractiveModuleSessions(moduleId: string, userId?: string): Promise<InteractiveModuleProgress[]> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await supabaseStorageLib.getInteractiveModuleSessions(userOrAnonymousId, moduleId);
    },
    () => localStorageLib.getInteractiveModuleSessions(moduleId)
  );
}

export async function getInteractiveModuleSession(moduleId: string, sessionId: string, userId?: string): Promise<InteractiveModuleProgress | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await supabaseStorageLib.getInteractiveModuleSession(userOrAnonymousId, moduleId, sessionId);
    },
    () => localStorageLib.getInteractiveModuleSession(moduleId, sessionId)
  );
}
