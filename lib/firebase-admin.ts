import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

export const isFirebaseAdminConfigured = Boolean(projectId && clientEmail && privateKey);

let adminApp: App | null = null;

export function getFirebaseAdminApp(): App | null {
  if (adminApp) return adminApp;
  if (!isFirebaseAdminConfigured) return null;

  adminApp =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey!,
          }),
        });

  return adminApp;
}

export function getFirebaseAdminAuth() {
  const app = getFirebaseAdminApp();
  if (!app) {
    throw new Error('Firebase admin is not configured. Missing service account env vars.');
  }
  return getAuth(app);
}

export function getFirebaseAdminDb() {
  const app = getFirebaseAdminApp();
  if (!app) {
    throw new Error('Firebase admin is not configured. Missing service account env vars.');
  }
  return getFirestore(app);
}
