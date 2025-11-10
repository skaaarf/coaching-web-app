/**
 * Unified storage layer that uses Supabase when authenticated, localStorage when not
 */

import { ModuleProgress, UserInsights, InteractiveModuleProgress } from '@/types';
import * as localStorageLib from './storage';
import * as supabaseStorageLib from './storage-supabase';

// Module Progress functions
export async function getModuleProgress(moduleId: string, userId?: string): Promise<ModuleProgress | null> {
  if (userId) {
    return await supabaseStorageLib.getModuleProgress(userId, moduleId);
  }
  return localStorageLib.getModuleProgress(moduleId);
}

export async function saveModuleProgress(moduleId: string, progress: ModuleProgress, userId?: string): Promise<void> {
  if (userId) {
    await supabaseStorageLib.saveModuleProgress(userId, moduleId, progress);
  } else {
    localStorageLib.saveModuleProgress(moduleId, progress);
  }
}

export async function getAllModuleProgress(userId?: string): Promise<Record<string, ModuleProgress>> {
  if (userId) {
    return await supabaseStorageLib.getAllModuleProgress(userId);
  }
  return localStorageLib.getAllModuleProgress();
}

// Interactive Module Progress functions
export async function getInteractiveModuleProgress(moduleId: string, userId?: string): Promise<InteractiveModuleProgress | null> {
  if (userId) {
    return await supabaseStorageLib.getInteractiveModuleProgress(userId, moduleId);
  }
  return localStorageLib.getInteractiveModuleProgress(moduleId);
}

export async function saveInteractiveModuleProgress(moduleId: string, progress: InteractiveModuleProgress, userId?: string): Promise<void> {
  if (userId) {
    await supabaseStorageLib.saveInteractiveModuleProgress(userId, moduleId, progress);
  } else {
    localStorageLib.saveInteractiveModuleProgress(moduleId, progress);
  }
}

export async function getAllInteractiveModuleProgress(userId?: string): Promise<Record<string, InteractiveModuleProgress>> {
  if (userId) {
    return await supabaseStorageLib.getAllInteractiveModuleProgress(userId);
  }
  return localStorageLib.getAllInteractiveModuleProgress();
}

// User Insights functions
export async function getUserInsights(userId?: string): Promise<UserInsights | null> {
  if (userId) {
    return await supabaseStorageLib.getUserInsights(userId);
  }
  return localStorageLib.getUserInsights();
}

export async function saveUserInsights(insights: UserInsights, userId?: string): Promise<void> {
  if (userId) {
    await supabaseStorageLib.saveUserInsights(userId, insights);
  } else {
    localStorageLib.saveUserInsights(insights);
  }
}

// Clear all data
export async function clearAllData(userId?: string): Promise<void> {
  if (userId) {
    await supabaseStorageLib.clearAllData(userId);
  } else {
    localStorageLib.clearAllData();
  }
}
