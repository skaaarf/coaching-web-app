import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function initApp() {
  if (app) return app;
  const configToUse = isFirebaseConfigured
    ? firebaseConfig
    : {
        apiKey: 'demo',
        authDomain: 'demo.firebaseapp.com',
        projectId: 'demo',
        storageBucket: 'demo.appspot.com',
        messagingSenderId: '0',
        appId: 'demo:app',
      };
  if (!isFirebaseConfigured) {
    console.warn('Firebase client is not fully configured. Falling back to demo config for local-only storage.');
  }
  app = getApps().length ? getApp() : initializeApp(configToUse);
  return app;
}

function initAuth() {
  if (auth) return auth;
  const firebaseApp = initApp();
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
  db = getFirestore(firebaseApp);
  return db;
}

export const firebaseApp = initApp();
export const firebaseAuth = initAuth();
export const firebaseDb = initDb();
