/**
 * Data migration utilities
 * Migrates data from localStorage to Supabase when user logs in
 */

import * as localStorageLib from './storage';
import * as supabaseStorageLib from './storage-supabase';

const MIGRATION_KEY = 'mikata-migration-completed';

/**
 * Check if migration has already been completed for this user
 */
function isMigrationCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(MIGRATION_KEY) === 'true';
}

/**
 * Mark migration as completed
 */
function markMigrationCompleted(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MIGRATION_KEY, 'true');
}

/**
 * Migrate all data from localStorage to Supabase
 * This should be called once when user first logs in
 */
export async function migrateLocalStorageToSupabase(userId: string): Promise<{
  success: boolean;
  migratedModules: number;
  migratedInteractiveModules: number;
  migratedInsights: boolean;
  error?: string;
}> {
  // Check if migration already completed
  if (isMigrationCompleted()) {
    console.log('Migration already completed for this browser');
    return {
      success: true,
      migratedModules: 0,
      migratedInteractiveModules: 0,
      migratedInsights: false
    };
  }

  try {
    let migratedModules = 0;
    let migratedInteractiveModules = 0;
    let migratedInsights = false;

    // Migrate module progress
    const allModuleProgress = localStorageLib.getAllModuleProgress();
    for (const [moduleId, progress] of Object.entries(allModuleProgress)) {
      try {
        await supabaseStorageLib.saveModuleProgress(userId, moduleId, progress);
        migratedModules++;
        console.log(`Migrated module progress: ${moduleId}`);
      } catch (error) {
        console.error(`Failed to migrate module ${moduleId}:`, error);
      }
    }

    // Migrate interactive module progress
    const allInteractiveProgress = localStorageLib.getAllInteractiveModuleProgress();
    for (const [moduleId, progress] of Object.entries(allInteractiveProgress)) {
      try {
        await supabaseStorageLib.saveInteractiveModuleProgress(userId, moduleId, progress);
        migratedInteractiveModules++;
        console.log(`Migrated interactive module progress: ${moduleId}`);
      } catch (error) {
        console.error(`Failed to migrate interactive module ${moduleId}:`, error);
      }
    }

    // Migrate user insights
    const insights = localStorageLib.getUserInsights();
    if (insights) {
      try {
        await supabaseStorageLib.saveUserInsights(userId, insights);
        migratedInsights = true;
        console.log('Migrated user insights');
      } catch (error) {
        console.error('Failed to migrate insights:', error);
      }
    }

    // Mark migration as completed
    markMigrationCompleted();

    console.log(`Migration completed: ${migratedModules} modules, ${migratedInteractiveModules} interactive modules, insights: ${migratedInsights}`);

    return {
      success: true,
      migratedModules,
      migratedInteractiveModules,
      migratedInsights
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      migratedModules: 0,
      migratedInteractiveModules: 0,
      migratedInsights: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if there's any data in localStorage that could be migrated
 */
export function hasLocalStorageData(): boolean {
  if (typeof window === 'undefined') return false;

  const moduleProgress = localStorageLib.getAllModuleProgress();
  const interactiveProgress = localStorageLib.getAllInteractiveModuleProgress();
  const insights = localStorageLib.getUserInsights();

  return (
    Object.keys(moduleProgress).length > 0 ||
    Object.keys(interactiveProgress).length > 0 ||
    insights !== null
  );
}

/**
 * Reset migration status (for testing purposes)
 */
export function resetMigrationStatus(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MIGRATION_KEY);
}
