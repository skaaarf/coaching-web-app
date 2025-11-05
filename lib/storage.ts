import { ModuleProgress, UserInsights, Message } from '@/types';

const STORAGE_PREFIX = 'mikata-';
const PROGRESS_KEY = `${STORAGE_PREFIX}progress`;
const INSIGHTS_KEY = `${STORAGE_PREFIX}insights`;

export function getModuleProgress(moduleId: string): ModuleProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const allProgress = localStorage.getItem(PROGRESS_KEY);
    if (!allProgress) return null;

    const progressMap = JSON.parse(allProgress) as Record<string, ModuleProgress>;
    const progress = progressMap[moduleId];

    if (!progress) return null;

    // Parse dates
    return {
      ...progress,
      lastUpdated: new Date(progress.lastUpdated),
      messages: progress.messages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    };
  } catch (error) {
    console.error('Error loading module progress:', error);
    return null;
  }
}

export function saveModuleProgress(moduleId: string, progress: ModuleProgress): void {
  if (typeof window === 'undefined') return;

  try {
    const allProgress = localStorage.getItem(PROGRESS_KEY);
    const progressMap = allProgress ? JSON.parse(allProgress) : {};

    progressMap[moduleId] = progress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressMap));
  } catch (error) {
    console.error('Error saving module progress:', error);
  }
}

export function getAllModuleProgress(): Record<string, ModuleProgress> {
  if (typeof window === 'undefined') return {};

  try {
    const allProgress = localStorage.getItem(PROGRESS_KEY);
    if (!allProgress) return {};

    const progressMap = JSON.parse(allProgress) as Record<string, ModuleProgress>;

    // Parse dates for all modules
    Object.keys(progressMap).forEach(moduleId => {
      progressMap[moduleId] = {
        ...progressMap[moduleId],
        lastUpdated: new Date(progressMap[moduleId].lastUpdated),
        messages: progressMap[moduleId].messages.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      };
    });

    return progressMap;
  } catch (error) {
    console.error('Error loading all module progress:', error);
    return {};
  }
}

export function getUserInsights(): UserInsights | null {
  if (typeof window === 'undefined') return null;

  try {
    const insights = localStorage.getItem(INSIGHTS_KEY);
    if (!insights) return null;

    const parsed = JSON.parse(insights) as UserInsights;
    return {
      ...parsed,
      lastAnalyzed: new Date(parsed.lastAnalyzed)
    };
  } catch (error) {
    console.error('Error loading insights:', error);
    return null;
  }
}

export function saveUserInsights(insights: UserInsights): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(INSIGHTS_KEY, JSON.stringify(insights));
  } catch (error) {
    console.error('Error saving insights:', error);
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(INSIGHTS_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
