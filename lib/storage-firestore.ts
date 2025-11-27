import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { firebaseDb } from './firebase-client';
import type { ModuleProgress, UserInsights, InteractiveModuleProgress, Message, InteractiveState } from '@/types';
import { getVisitCount } from './anonymous-session';

const DEFAULT_SESSION_LIMIT = 10;

const MODULE_PROGRESS_COLLECTION = 'module_progress';
const INTERACTIVE_PROGRESS_COLLECTION = 'interactive_module_progress';
const USER_INSIGHTS_COLLECTION = 'user_insights';

type FirestoreModuleProgress = {
  id?: string;
  owner_id: string;
  owner_type: 'user' | 'anonymous';
  module_id: string;
  session_id?: string;
  messages?: StoredMessage[];
  completed?: boolean;
  insights?: string[];
  user_email?: string | null;
  created_at: string;
  last_updated: string;
  is_latest: boolean;
  is_session: boolean;
  visit_count?: number;
};

type FirestoreInteractiveProgress = {
  id?: string;
  owner_id: string;
  owner_type: 'user' | 'anonymous';
  module_id: string;
  session_id?: string;
  data?: InteractiveState | Record<string, unknown>;
  completed?: boolean;
  user_email?: string | null;
  created_at: string;
  last_updated: string;
  is_latest: boolean;
  is_session: boolean;
  visit_count?: number;
};

export type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string };

const serializeMessages = (messages: Message[]): StoredMessage[] =>
  messages.map((message) => ({
    ...message,
    timestamp:
      message.timestamp instanceof Date
        ? message.timestamp.toISOString()
        : new Date(message.timestamp).toISOString(),
  }));

const normalizeMessages = (rawMessages?: StoredMessage[] | null): Message[] => {
  if (!rawMessages) return [];
  return rawMessages.map((message) => ({
    ...message,
    timestamp: new Date(message.timestamp),
  }));
};

const mapModuleProgress = (item: FirestoreModuleProgress): ModuleProgress => ({
  moduleId: item.module_id,
  sessionId: item.session_id || item.id || `session-${Date.now()}`,
  messages: normalizeMessages(item.messages || []),
  createdAt: item.created_at ? new Date(item.created_at) : new Date(),
  lastUpdated: item.last_updated ? new Date(item.last_updated) : new Date(),
  completed: item.completed ?? false,
  insights: item.insights || [],
  userId: item.owner_id,
  userEmail: item.user_email || undefined,
});

const mapInteractiveProgress = (item: FirestoreInteractiveProgress): InteractiveModuleProgress => ({
  moduleId: item.module_id,
  sessionId: item.session_id || item.id || `session-${Date.now()}`,
  data: (item.data as InteractiveState) || null,
  createdAt: item.created_at ? new Date(item.created_at) : new Date(),
  lastUpdated: item.last_updated ? new Date(item.last_updated) : new Date(),
  completed: item.completed ?? false,
  userId: item.owner_id,
  userEmail: item.user_email || undefined,
});

const getOwnerType = (userIdOrAnonymous: string) =>
  userIdOrAnonymous.startsWith('anon_') ? 'anonymous' : 'user';

// Module progress
export async function getModuleProgress(userIdOrAnonymous: string, moduleId: string): Promise<ModuleProgress | null> {
  const baseQuery = query(
    collection(firebaseDb, MODULE_PROGRESS_COLLECTION),
    where('owner_id', '==', userIdOrAnonymous),
    where('module_id', '==', moduleId),
    where('is_latest', '==', true),
    limit(1)
  );

  const snapshot = await getDocs(baseQuery);
  if (snapshot.empty) return null;

  return mapModuleProgress(snapshot.docs[0].data() as FirestoreModuleProgress);
}

export async function saveModuleProgress(userIdOrAnonymous: string, moduleId: string, progress: ModuleProgress): Promise<void> {
  const createdAtIso = progress.createdAt ? new Date(progress.createdAt).toISOString() : new Date().toISOString();
  const lastUpdatedIso = progress.lastUpdated ? new Date(progress.lastUpdated).toISOString() : new Date().toISOString();
  const sessionId = progress.sessionId || `session-${Date.now()}`;
  const visitCount = getVisitCount();

  const baseData: FirestoreModuleProgress = {
    owner_id: userIdOrAnonymous,
    owner_type: getOwnerType(userIdOrAnonymous),
    module_id: moduleId,
    session_id: sessionId,
    messages: serializeMessages(progress.messages),
    completed: progress.completed ?? false,
    insights: progress.insights || [],
    user_email: progress.userEmail || null,
    created_at: createdAtIso,
    last_updated: lastUpdatedIso,
    is_latest: true,
    is_session: false,
    visit_count: visitCount,
  };

  // Latest snapshot for the module
  const latestDocRef = doc(firebaseDb, MODULE_PROGRESS_COLLECTION, `latest_${userIdOrAnonymous}_${moduleId}`);
  await setDoc(latestDocRef, baseData);

  // Session history
  const historyData: FirestoreModuleProgress = {
    ...baseData,
    is_latest: false,
    is_session: true,
  };
  const historyDocRef = doc(firebaseDb, MODULE_PROGRESS_COLLECTION, `session_${userIdOrAnonymous}_${moduleId}_${sessionId}`);
  await setDoc(historyDocRef, historyData);
}

export async function getAllModuleProgress(userIdOrAnonymous: string): Promise<Record<string, ModuleProgress>> {
  const results: Record<string, ModuleProgress> = {};
  const qLatest = query(
    collection(firebaseDb, MODULE_PROGRESS_COLLECTION),
    where('owner_id', '==', userIdOrAnonymous),
    where('is_latest', '==', true)
  );

  const snapshot = await getDocs(qLatest);
  snapshot.forEach((docSnap) => {
    const item = docSnap.data() as FirestoreModuleProgress;
    results[item.module_id] = mapModuleProgress(item);
  });

  return results;
}

export async function getModuleSessions(userIdOrAnonymous: string, moduleId: string, limitCount = DEFAULT_SESSION_LIMIT): Promise<ModuleProgress[]> {
  // Latest entry
  const latestPromise = getModuleProgress(userIdOrAnonymous, moduleId);

  // Session history entries
  const sessionQuery = query(
    collection(firebaseDb, MODULE_PROGRESS_COLLECTION),
    where('owner_id', '==', userIdOrAnonymous),
    where('module_id', '==', moduleId),
    where('is_session', '==', true),
    orderBy('last_updated', 'desc'),
    limit(limitCount)
  );

  const [latest, sessionSnapshot] = await Promise.all([latestPromise, getDocs(sessionQuery)]);

  const sessions = sessionSnapshot.docs.map((docSnap) =>
    mapModuleProgress(docSnap.data() as FirestoreModuleProgress)
  );

  if (latest) {
    sessions.unshift(latest);
  }

  return sessions.slice(0, limitCount);
}

export async function getModuleSession(userIdOrAnonymous: string, moduleId: string, sessionId: string): Promise<ModuleProgress | null> {
  const sessionRef = doc(firebaseDb, MODULE_PROGRESS_COLLECTION, `session_${userIdOrAnonymous}_${moduleId}_${sessionId}`);
  const sessionSnap = await getDoc(sessionRef);
  if (sessionSnap.exists()) {
    return mapModuleProgress(sessionSnap.data() as FirestoreModuleProgress);
  }
  return await getModuleProgress(userIdOrAnonymous, moduleId);
}

// Interactive module progress
export async function getInteractiveModuleProgress(userIdOrAnonymous: string, moduleId: string): Promise<InteractiveModuleProgress | null> {
  const baseQuery = query(
    collection(firebaseDb, INTERACTIVE_PROGRESS_COLLECTION),
    where('owner_id', '==', userIdOrAnonymous),
    where('module_id', '==', moduleId),
    where('is_latest', '==', true),
    limit(1)
  );

  const snapshot = await getDocs(baseQuery);
  if (snapshot.empty) return null;

  return mapInteractiveProgress(snapshot.docs[0].data() as FirestoreInteractiveProgress);
}

export async function saveInteractiveModuleProgress(userIdOrAnonymous: string, moduleId: string, progress: InteractiveModuleProgress): Promise<void> {
  const createdAtIso = progress.createdAt ? new Date(progress.createdAt).toISOString() : new Date().toISOString();
  const lastUpdatedIso = progress.lastUpdated ? new Date(progress.lastUpdated).toISOString() : new Date().toISOString();
  const sessionId = progress.sessionId || `session-${Date.now()}`;
  const visitCount = getVisitCount();

  const baseData: FirestoreInteractiveProgress = {
    owner_id: userIdOrAnonymous,
    owner_type: getOwnerType(userIdOrAnonymous),
    module_id: moduleId,
    session_id: sessionId,
    data: progress.data || undefined,
    completed: progress.completed ?? false,
    user_email: progress.userEmail || null,
    created_at: createdAtIso,
    last_updated: lastUpdatedIso,
    is_latest: true,
    is_session: false,
    visit_count: visitCount,
  };

  const latestDocRef = doc(firebaseDb, INTERACTIVE_PROGRESS_COLLECTION, `latest_${userIdOrAnonymous}_${moduleId}`);
  await setDoc(latestDocRef, baseData);

  const historyDocRef = doc(firebaseDb, INTERACTIVE_PROGRESS_COLLECTION, `session_${userIdOrAnonymous}_${moduleId}_${sessionId}`);
  const historyData: FirestoreInteractiveProgress = { ...baseData, is_latest: false, is_session: true };
  await setDoc(historyDocRef, historyData);
}

export async function getAllInteractiveModuleProgress(userIdOrAnonymous: string): Promise<Record<string, InteractiveModuleProgress>> {
  const results: Record<string, InteractiveModuleProgress> = {};
  const qLatest = query(
    collection(firebaseDb, INTERACTIVE_PROGRESS_COLLECTION),
    where('owner_id', '==', userIdOrAnonymous),
    where('is_latest', '==', true)
  );

  const snapshot = await getDocs(qLatest);
  snapshot.forEach((docSnap) => {
    const item = docSnap.data() as FirestoreInteractiveProgress;
    results[item.module_id] = mapInteractiveProgress(item);
  });

  return results;
}

export async function getInteractiveModuleSessions(userIdOrAnonymous: string, moduleId: string, limitCount = DEFAULT_SESSION_LIMIT): Promise<InteractiveModuleProgress[]> {
  const latestPromise = getInteractiveModuleProgress(userIdOrAnonymous, moduleId);

  const sessionQuery = query(
    collection(firebaseDb, INTERACTIVE_PROGRESS_COLLECTION),
    where('owner_id', '==', userIdOrAnonymous),
    where('module_id', '==', moduleId),
    where('is_session', '==', true),
    orderBy('last_updated', 'desc'),
    limit(limitCount)
  );

  const [latest, sessionSnapshot] = await Promise.all([latestPromise, getDocs(sessionQuery)]);

  const sessions = sessionSnapshot.docs.map((docSnap) =>
    mapInteractiveProgress(docSnap.data() as FirestoreInteractiveProgress)
  );

  if (latest) {
    sessions.unshift(latest);
  }

  return sessions.slice(0, limitCount);
}

export async function getInteractiveModuleSession(userIdOrAnonymous: string, moduleId: string, sessionId: string): Promise<InteractiveModuleProgress | null> {
  const sessionRef = doc(firebaseDb, INTERACTIVE_PROGRESS_COLLECTION, `session_${userIdOrAnonymous}_${moduleId}_${sessionId}`);
  const sessionSnap = await getDoc(sessionRef);
  if (sessionSnap.exists()) {
    return mapInteractiveProgress(sessionSnap.data() as FirestoreInteractiveProgress);
  }
  return await getInteractiveModuleProgress(userIdOrAnonymous, moduleId);
}

// User insights
export async function getUserInsights(userIdOrAnonymous: string): Promise<UserInsights | null> {
  const ref = doc(firebaseDb, USER_INSIGHTS_COLLECTION, userIdOrAnonymous);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;

  const data = snapshot.data() as UserInsights & { last_analyzed?: string };
  return {
    ...data,
    lastAnalyzed: data.lastAnalyzed ? new Date(data.lastAnalyzed) : new Date(),
  };
}

export async function saveUserInsights(userIdOrAnonymous: string, insights: UserInsights): Promise<void> {
  const ref = doc(firebaseDb, USER_INSIGHTS_COLLECTION, userIdOrAnonymous);
  await setDoc(ref, {
    ...insights,
    lastAnalyzed: insights.lastAnalyzed ? new Date(insights.lastAnalyzed).toISOString() : new Date().toISOString(),
  });
}

// Clear all remote data for a user or anonymous session
export async function clearAllData(userIdOrAnonymous: string): Promise<void> {
  const moduleQuery = query(collection(firebaseDb, MODULE_PROGRESS_COLLECTION), where('owner_id', '==', userIdOrAnonymous));
  const interactiveQuery = query(collection(firebaseDb, INTERACTIVE_PROGRESS_COLLECTION), where('owner_id', '==', userIdOrAnonymous));

  const [moduleSnap, interactiveSnap] = await Promise.all([getDocs(moduleQuery), getDocs(interactiveQuery)]);

  const deletions: Promise<void>[] = [];
  moduleSnap.forEach((docSnap) => deletions.push(deleteDoc(docSnap.ref)));
  interactiveSnap.forEach((docSnap) => deletions.push(deleteDoc(docSnap.ref)));

  // Insights
  deletions.push(deleteDoc(doc(firebaseDb, USER_INSIGHTS_COLLECTION, userIdOrAnonymous)));

  await Promise.all(deletions);
}
