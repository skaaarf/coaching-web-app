/**
 * Unified storage layer that uses Supabase when authenticated, localStorage when not
 * 未ログインユーザーは匿名セッションIDでSupabaseに保存
 */

import { ModuleProgress, UserInsights, InteractiveModuleProgress, ValueSnapshot } from '@/types';
import * as localStorageLib from './storage';
import * as remoteStorageLib from './storage-firestore';
import { getOrCreateAnonymousSessionId } from './anonymous-session';
import { isFirebaseConfigured } from './firebase-client';

const GLOBAL_FLAG = '__mikataFirebaseDisabled';
const isGlobalRemoteDisabled =
  typeof globalThis !== 'undefined' && (globalThis as Record<string, unknown>)[GLOBAL_FLAG] === true;

let hasLoggedSupabaseFallback = false;
let remoteAvailable = isFirebaseConfigured && !isGlobalRemoteDisabled;

const logSupabaseFallback = (error: unknown) => {
  if (hasLoggedSupabaseFallback) return;
  console.warn('Firebase unavailable, falling back to local storage.', error);
  hasLoggedSupabaseFallback = true;
};

async function withStorageFallback<T>(supabaseOp: () => Promise<T>, localOp: () => T | Promise<T>): Promise<T> {
  if (!remoteAvailable) {
    return await Promise.resolve(localOp());
  }

  try {
    return await supabaseOp();
  } catch (error) {
    remoteAvailable = false;
    if (typeof globalThis !== 'undefined') {
      (globalThis as Record<string, unknown>)[GLOBAL_FLAG] = true;
    }
    logSupabaseFallback(error);
    return await Promise.resolve(localOp());
  }
}

// Module Progress functions
export async function getModuleProgress(moduleId: string, userId?: string): Promise<ModuleProgress | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await remoteStorageLib.getModuleProgress(userOrAnonymousId, moduleId);
    },
    () => localStorageLib.getModuleProgress(moduleId)
  );
}

export async function saveModuleProgress(moduleId: string, progress: ModuleProgress, userId?: string): Promise<void> {
  await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      await remoteStorageLib.saveModuleProgress(userOrAnonymousId, moduleId, progress);
    },
    () => localStorageLib.saveModuleProgress(moduleId, progress)
  );
}

export async function getAllModuleProgress(userId?: string): Promise<Record<string, ModuleProgress>> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await remoteStorageLib.getAllModuleProgress(userOrAnonymousId);
    },
    () => localStorageLib.getAllModuleProgress()
  );
}

// Interactive Module Progress functions
export async function getInteractiveModuleProgress(moduleId: string, userId?: string): Promise<InteractiveModuleProgress | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await remoteStorageLib.getInteractiveModuleProgress(userOrAnonymousId, moduleId);
    },
    () => localStorageLib.getInteractiveModuleProgress(moduleId)
  );
}

export async function saveInteractiveModuleProgress(moduleId: string, progress: InteractiveModuleProgress, userId?: string): Promise<void> {
  await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      await remoteStorageLib.saveInteractiveModuleProgress(userOrAnonymousId, moduleId, progress);
    },
    () => localStorageLib.saveInteractiveModuleProgress(moduleId, progress)
  );
}

export async function getAllInteractiveModuleProgress(userId?: string): Promise<Record<string, InteractiveModuleProgress>> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await remoteStorageLib.getAllInteractiveModuleProgress(userOrAnonymousId);
    },
    () => localStorageLib.getAllInteractiveModuleProgress()
  );
}

// User Insights functions
export async function getUserInsights(userId?: string): Promise<UserInsights | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await remoteStorageLib.getUserInsights(userOrAnonymousId);
    },
    () => localStorageLib.getUserInsights()
  );
}

export async function saveUserInsights(insights: UserInsights, userId?: string): Promise<void> {
  await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      await remoteStorageLib.saveUserInsights(userOrAnonymousId, insights);
    },
    () => localStorageLib.saveUserInsights(insights)
  );
}

// Clear all data
export async function clearAllData(userId?: string): Promise<void> {
  await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      await remoteStorageLib.clearAllData(userOrAnonymousId);
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
      return await remoteStorageLib.getModuleSessions(userOrAnonymousId, moduleId);
    },
    () => localStorageLib.getModuleSessions(moduleId)
  );
}

export async function getModuleSession(moduleId: string, sessionId: string, userId?: string): Promise<ModuleProgress | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await remoteStorageLib.getModuleSession(userOrAnonymousId, moduleId, sessionId);
    },
    () => localStorageLib.getModuleSession(moduleId, sessionId)
  );
}

export async function getInteractiveModuleSessions(moduleId: string, userId?: string): Promise<InteractiveModuleProgress[]> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await remoteStorageLib.getInteractiveModuleSessions(userOrAnonymousId, moduleId);
    },
    () => localStorageLib.getInteractiveModuleSessions(moduleId)
  );
}

export async function getInteractiveModuleSession(moduleId: string, sessionId: string, userId?: string): Promise<InteractiveModuleProgress | null> {
  return await withStorageFallback(
    async () => {
      const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
      return await remoteStorageLib.getInteractiveModuleSession(userOrAnonymousId, moduleId, sessionId);
    },
    () => localStorageLib.getInteractiveModuleSession(moduleId, sessionId)
  );
}
