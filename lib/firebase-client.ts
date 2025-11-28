import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const isBrowser = typeof window !== 'undefined';

const requiredFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

const optionalFirebaseConfig = {
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
};

const missingRequiredFirebaseEnv = Object.entries(requiredFirebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingRequiredFirebaseEnv.length === 0;

if (missingRequiredFirebaseEnv.length && isBrowser) {
  console.warn(
    `Firebase client is missing required env vars: ${missingRequiredFirebaseEnv.join(', ')}. Auth will be disabled until these are set.`,
  );
}

const firebaseConfig: FirebaseOptions = {
  ...requiredFirebaseConfig,
  ...(optionalFirebaseConfig.storageBucket ? { storageBucket: optionalFirebaseConfig.storageBucket } : {}),
  ...(optionalFirebaseConfig.messagingSenderId ? { messagingSenderId: optionalFirebaseConfig.messagingSenderId } : {}),
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function initApp() {
  if (app) return app;
  if (!isBrowser) return null;
  if (!isFirebaseConfigured) {
    console.warn('Firebase client is not configured. Check Firebase env vars.');
    return null;
  }
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

function initAuth() {
  if (auth) return auth;
  const firebaseApp = initApp();
  if (!firebaseApp) return null;
  auth = getAuth(firebaseApp);

  // Use local persistence on the client so sessions survive reloads.
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.warn('Failed to set Firebase auth persistence', error);
    });
  }

  return auth;
}

function initDb() {
  if (db) return db;
  const firebaseApp = initApp();
  if (!firebaseApp) return null;
  db = getFirestore(firebaseApp);
  return db;
}

export const firebaseApp = isBrowser ? initApp() : null;
export const firebaseAuth = isBrowser ? initAuth() : null;
export const firebaseDb = isBrowser ? initDb() : null;
