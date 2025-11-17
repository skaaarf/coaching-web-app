/**
 * Unified storage layer that uses Supabase when authenticated, localStorage when not
 * 未ログインユーザーは匿名セッションIDでSupabaseに保存
 */

import { ModuleProgress, UserInsights, InteractiveModuleProgress, ValueSnapshot } from '@/types';
import * as localStorageLib from './storage';
import * as supabaseStorageLib from './storage-supabase';
import { getOrCreateAnonymousSessionId } from './anonymous-session';

// Module Progress functions
export async function getModuleProgress(moduleId: string, userId?: string): Promise<ModuleProgress | null> {
  // ログイン済みまたは匿名セッションIDでSupabaseを使用
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  return await supabaseStorageLib.getModuleProgress(userOrAnonymousId, moduleId);
}

export async function saveModuleProgress(moduleId: string, progress: ModuleProgress, userId?: string): Promise<void> {
  // ログイン済みまたは匿名セッションIDでSupabaseを使用
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  await supabaseStorageLib.saveModuleProgress(userOrAnonymousId, moduleId, progress);
}

export async function getAllModuleProgress(userId?: string): Promise<Record<string, ModuleProgress>> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  return await supabaseStorageLib.getAllModuleProgress(userOrAnonymousId);
}

// Interactive Module Progress functions
export async function getInteractiveModuleProgress(moduleId: string, userId?: string): Promise<InteractiveModuleProgress | null> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  return await supabaseStorageLib.getInteractiveModuleProgress(userOrAnonymousId, moduleId);
}

export async function saveInteractiveModuleProgress(moduleId: string, progress: InteractiveModuleProgress, userId?: string): Promise<void> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  await supabaseStorageLib.saveInteractiveModuleProgress(userOrAnonymousId, moduleId, progress);
}

export async function getAllInteractiveModuleProgress(userId?: string): Promise<Record<string, InteractiveModuleProgress>> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  return await supabaseStorageLib.getAllInteractiveModuleProgress(userOrAnonymousId);
}

// User Insights functions
export async function getUserInsights(userId?: string): Promise<UserInsights | null> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  return await supabaseStorageLib.getUserInsights(userOrAnonymousId);
}

export async function saveUserInsights(insights: UserInsights, userId?: string): Promise<void> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  await supabaseStorageLib.saveUserInsights(userOrAnonymousId, insights);
}

// Clear all data
export async function clearAllData(userId?: string): Promise<void> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  await supabaseStorageLib.clearAllData(userOrAnonymousId);
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
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  return await supabaseStorageLib.getModuleSessions(userOrAnonymousId, moduleId);
}

export async function getModuleSession(moduleId: string, sessionId: string, userId?: string): Promise<ModuleProgress | null> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  return await supabaseStorageLib.getModuleSession(userOrAnonymousId, moduleId, sessionId);
}

export async function getInteractiveModuleSessions(moduleId: string, userId?: string): Promise<InteractiveModuleProgress[]> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  return await supabaseStorageLib.getInteractiveModuleSessions(userOrAnonymousId, moduleId);
}

export async function getInteractiveModuleSession(moduleId: string, sessionId: string, userId?: string): Promise<InteractiveModuleProgress | null> {
  const userOrAnonymousId = userId || getOrCreateAnonymousSessionId();
  return await supabaseStorageLib.getInteractiveModuleSession(userOrAnonymousId, moduleId, sessionId);
}
