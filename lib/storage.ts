import { ModuleProgress, UserInsights, InteractiveModuleProgress, ValueSnapshot } from '@/types';

const STORAGE_PREFIX = 'mikata-';
const PROGRESS_KEY = `${STORAGE_PREFIX}progress`;
const SESSIONS_KEY = `${STORAGE_PREFIX}sessions`; // New key for multiple sessions
const INSIGHTS_KEY = `${STORAGE_PREFIX}insights`;
const INTERACTIVE_PROGRESS_KEY = `${STORAGE_PREFIX}interactive-progress`;
const VALUES_KEY = `${STORAGE_PREFIX}values`;

const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

// Migrate old progress data to new sessions format
export function migrateToSessions(): void {
  if (typeof window === 'undefined') return;

  try {
    const allSessions = localStorage.getItem(SESSIONS_KEY);
    if (allSessions) {
      debugLog('Sessions already migrated');
      return; // Already migrated
    }

    debugLog('Starting migration to sessions format...');
    const sessionsMap: Record<string, Array<ModuleProgress | InteractiveModuleProgress>> = {};

    // Migrate chat modules
    const chatProgress = localStorage.getItem(PROGRESS_KEY);
    if (chatProgress) {
      const progressMap = JSON.parse(chatProgress) as Record<string, ModuleProgress>;
      Object.entries(progressMap).forEach(([moduleId, progress]) => {
        if (progress.messages && progress.messages.length > 0) {
          const session: ModuleProgress = {
            ...progress,
            sessionId: progress.sessionId || `session-migrated-${Date.now()}`,
            createdAt: progress.createdAt || progress.lastUpdated || new Date(),
          };
          sessionsMap[moduleId] = [session];
          debugLog(`Migrated chat module: ${moduleId}`);
        }
      });
    }

    // Migrate interactive modules
    const interactiveProgress = localStorage.getItem(INTERACTIVE_PROGRESS_KEY);
    if (interactiveProgress) {
      const progressMap = JSON.parse(interactiveProgress) as Record<string, InteractiveModuleProgress>;
      Object.entries(progressMap).forEach(([moduleId, progress]) => {
        if (progress.data) {
          const session: InteractiveModuleProgress = {
            ...progress,
            sessionId: progress.sessionId || `session-migrated-${Date.now()}`,
            createdAt: progress.createdAt || progress.lastUpdated || new Date(),
          };
          const sessionKey = `interactive-${moduleId}`;
          sessionsMap[sessionKey] = [session];
          debugLog(`Migrated interactive module: ${moduleId}`);
        }
      });
    }

    // Save migrated sessions
    if (Object.keys(sessionsMap).length > 0) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionsMap));
      debugLog('Migration complete. Migrated sessions:', sessionsMap);
    } else {
      debugLog('No data to migrate');
    }
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

export function getModuleProgress(moduleId: string): ModuleProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const allProgress = localStorage.getItem(PROGRESS_KEY);
    if (!allProgress) return null;

    const progressMap = JSON.parse(allProgress) as Record<string, ModuleProgress>;
    const progress = progressMap[moduleId];

    if (!progress) return null;

    // Parse dates and add missing fields
    return {
      ...progress,
      sessionId: progress.sessionId || `session-${Date.now()}`,
      createdAt: progress.createdAt ? new Date(progress.createdAt) : new Date(),
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
    // Save to sessions storage (new format)
    const allSessions = localStorage.getItem(SESSIONS_KEY);
    const sessionsMap = allSessions ? JSON.parse(allSessions) : {};

    if (!sessionsMap[moduleId]) {
      sessionsMap[moduleId] = [];
    }

    // Add sessionId and createdAt if not present
    if (!progress.sessionId) {
      progress.sessionId = `session-${Date.now()}`;
    }
    if (!progress.createdAt) {
      progress.createdAt = new Date();
    }

    // Find and update existing session or add new one
    const sessionIndex = sessionsMap[moduleId].findIndex((s: ModuleProgress) => s.sessionId === progress.sessionId);
    if (sessionIndex >= 0) {
      sessionsMap[moduleId][sessionIndex] = progress;
    } else {
      sessionsMap[moduleId].unshift(progress); // Add at the beginning
    }

    // Keep only last 10 sessions per module
    if (sessionsMap[moduleId].length > 10) {
      sessionsMap[moduleId].splice(10);
    }

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionsMap));

    // Also save to old format for backward compatibility (only the latest session)
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

    // Parse dates for all modules and add missing fields
    Object.keys(progressMap).forEach(moduleId => {
      progressMap[moduleId] = {
        ...progressMap[moduleId],
        sessionId: progressMap[moduleId].sessionId || `session-${Date.now()}`,
        createdAt: progressMap[moduleId].createdAt ? new Date(progressMap[moduleId].createdAt) : new Date(),
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
    localStorage.removeItem(INTERACTIVE_PROGRESS_KEY);
    localStorage.removeItem(VALUES_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

// Interactive module progress functions
export function getInteractiveModuleProgress(moduleId: string): InteractiveModuleProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const allProgress = localStorage.getItem(INTERACTIVE_PROGRESS_KEY);
    if (!allProgress) return null;

    const progressMap = JSON.parse(allProgress) as Record<string, InteractiveModuleProgress>;
    const progress = progressMap[moduleId];

    if (!progress) return null;

    return {
      ...progress,
      createdAt: progress.createdAt ? new Date(progress.createdAt) : new Date(),
      lastUpdated: new Date(progress.lastUpdated)
    };
  } catch (error) {
    console.error('Error loading interactive module progress:', error);
    return null;
  }
}

export function saveInteractiveModuleProgress(moduleId: string, progress: InteractiveModuleProgress): void {
  if (typeof window === 'undefined') return;

  try {
    debugLog('=== saveInteractiveModuleProgress (storage) ===');
    debugLog('moduleId:', moduleId);
    debugLog('progress:', progress);

    // Add sessionId and createdAt if not present
    if (!progress.sessionId) {
      progress.sessionId = `session-${Date.now()}`;
      debugLog('Generated new sessionId:', progress.sessionId);
    }
    if (!progress.createdAt) {
      progress.createdAt = new Date();
    }

    // Save to sessions storage (using same key structure as chat modules)
    const allSessions = localStorage.getItem(SESSIONS_KEY);
    const sessionsMap = allSessions ? JSON.parse(allSessions) : {};

    const sessionKey = `interactive-${moduleId}`;
    debugLog('sessionKey:', sessionKey);

    if (!sessionsMap[sessionKey]) {
      sessionsMap[sessionKey] = [];
    }

    // Find and update existing session or add new one
    const sessionIndex = sessionsMap[sessionKey].findIndex((s: InteractiveModuleProgress) => s.sessionId === progress.sessionId);
    debugLog('Existing session index:', sessionIndex);

    if (sessionIndex >= 0) {
      debugLog('Updating existing session at index', sessionIndex);
      sessionsMap[sessionKey][sessionIndex] = progress;
    } else {
      debugLog('Adding new session');
      sessionsMap[sessionKey].unshift(progress); // Add at the beginning
    }

    debugLog('Total sessions for', sessionKey, ':', sessionsMap[sessionKey].length);

    // Keep only last 10 sessions per module
    if (sessionsMap[sessionKey].length > 10) {
      sessionsMap[sessionKey].splice(10);
    }

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionsMap));
    debugLog('Saved to localStorage');

    // Also save to old format for backward compatibility (only the latest session)
    const allProgress = localStorage.getItem(INTERACTIVE_PROGRESS_KEY);
    const progressMap = allProgress ? JSON.parse(allProgress) : {};
    progressMap[moduleId] = progress;
    localStorage.setItem(INTERACTIVE_PROGRESS_KEY, JSON.stringify(progressMap));
  } catch (error) {
    console.error('Error saving interactive module progress:', error);
  }
}

export function getAllInteractiveModuleProgress(): Record<string, InteractiveModuleProgress> {
  if (typeof window === 'undefined') return {};

  try {
    const allProgress = localStorage.getItem(INTERACTIVE_PROGRESS_KEY);
    if (!allProgress) return {};

    const progressMap = JSON.parse(allProgress) as Record<string, InteractiveModuleProgress>;

    // Parse dates and add missing fields
    Object.keys(progressMap).forEach(moduleId => {
      progressMap[moduleId] = {
        ...progressMap[moduleId],
        sessionId: progressMap[moduleId].sessionId || `session-${Date.now()}`,
        createdAt: progressMap[moduleId].createdAt ? new Date(progressMap[moduleId].createdAt) : new Date(),
        lastUpdated: new Date(progressMap[moduleId].lastUpdated)
      };
    });

    return progressMap;
  } catch (error) {
    console.error('Error loading all interactive module progress:', error);
    return {};
  }
}

// Value snapshots functions
export function getCurrentValueSnapshot(): ValueSnapshot | null {
  if (typeof window === 'undefined') return null;

  try {
    const snapshots = localStorage.getItem(VALUES_KEY);
    if (!snapshots) return null;

    const snapshotList = JSON.parse(snapshots) as ValueSnapshot[];
    if (snapshotList.length === 0) return null;

    const latest = snapshotList[0];
    return {
      ...latest,
      created_at: new Date(latest.created_at),
      last_updated: new Date(latest.last_updated),
    };
  } catch (error) {
    console.error('Error loading value snapshot:', error);
    return null;
  }
}

export function saveValueSnapshot(snapshot: ValueSnapshot): void {
  if (typeof window === 'undefined') return;

  try {
    const snapshots = localStorage.getItem(VALUES_KEY);
    const snapshotList = snapshots ? JSON.parse(snapshots) : [];

    // Add new snapshot at the beginning
    snapshotList.unshift(snapshot);

    // Keep only the last 10 snapshots
    if (snapshotList.length > 10) {
      snapshotList.splice(10);
    }

    localStorage.setItem(VALUES_KEY, JSON.stringify(snapshotList));
  } catch (error) {
    console.error('Error saving value snapshot:', error);
  }
}

export function getAllValueSnapshots(): ValueSnapshot[] {
  if (typeof window === 'undefined') return [];

  try {
    const snapshots = localStorage.getItem(VALUES_KEY);
    if (!snapshots) return [];

    const snapshotList = JSON.parse(snapshots) as ValueSnapshot[];
    return snapshotList.map(s => ({
      ...s,
      created_at: new Date(s.created_at),
      last_updated: new Date(s.last_updated),
    }));
  } catch (error) {
    console.error('Error loading value snapshots:', error);
    return [];
  }
}

// Get all sessions for a specific module
export function getModuleSessions(moduleId: string): ModuleProgress[] {
  if (typeof window === 'undefined') return [];

  try {
    const allSessions = localStorage.getItem(SESSIONS_KEY);
    debugLog('getModuleSessions - allSessions raw:', allSessions);
    if (!allSessions) return [];

    const sessionsMap = JSON.parse(allSessions) as Record<string, ModuleProgress[]>;
    debugLog('getModuleSessions - sessionsMap:', sessionsMap);
    debugLog('getModuleSessions - moduleId:', moduleId);
    const sessions = sessionsMap[moduleId] || [];
    debugLog('getModuleSessions - sessions:', sessions);

    // Parse dates
    return sessions.map(session => ({
      ...session,
      createdAt: session.createdAt ? new Date(session.createdAt) : new Date(),
      lastUpdated: new Date(session.lastUpdated),
      messages: session.messages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error loading module sessions:', error);
    return [];
  }
}

// Get a specific session by sessionId
export function getModuleSession(moduleId: string, sessionId: string): ModuleProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessions = getModuleSessions(moduleId);
    return sessions.find(s => s.sessionId === sessionId) || null;
  } catch (error) {
    console.error('Error loading module session:', error);
    return null;
  }
}

// Get all sessions for a specific interactive module
export function getInteractiveModuleSessions(moduleId: string): InteractiveModuleProgress[] {
  if (typeof window === 'undefined') return [];

  try {
    const allSessions = localStorage.getItem(SESSIONS_KEY);
    debugLog('getInteractiveModuleSessions - allSessions raw:', allSessions);
    if (!allSessions) return [];

    const sessionsMap = JSON.parse(allSessions) as Record<string, InteractiveModuleProgress[]>;
    debugLog('getInteractiveModuleSessions - sessionsMap:', sessionsMap);
    const sessionKey = `interactive-${moduleId}`;
    debugLog('getInteractiveModuleSessions - sessionKey:', sessionKey);
    const sessions = sessionsMap[sessionKey] || [];
    debugLog('getInteractiveModuleSessions - sessions:', sessions);

    // Parse dates
    return sessions.map(session => ({
      ...session,
      createdAt: session.createdAt ? new Date(session.createdAt) : new Date(),
      lastUpdated: new Date(session.lastUpdated)
    }));
  } catch (error) {
    console.error('Error loading interactive module sessions:', error);
    return [];
  }
}

// Get a specific interactive session by sessionId
export function getInteractiveModuleSession(moduleId: string, sessionId: string): InteractiveModuleProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessions = getInteractiveModuleSessions(moduleId);
    return sessions.find(s => s.sessionId === sessionId) || null;
  } catch (error) {
    console.error('Error loading interactive module session:', error);
    return null;
  }
}
