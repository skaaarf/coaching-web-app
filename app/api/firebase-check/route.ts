import { NextResponse } from 'next/server';
import { getFirebaseAdminAuth, getFirebaseAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase-admin';

export async function GET() {
  if (!isFirebaseAdminConfigured) {
    return NextResponse.json({ status: 'error', error: 'Firebase admin is not configured' }, { status: 500 });
  }

  try {
    const auth = getFirebaseAdminAuth();
    const db = getFirebaseAdminDb();

    // Simple write/read to verify Firestore connectivity
    const ref = db.collection('connectivity_tests').doc('server_check');
    const now = new Date().toISOString();
    await ref.set({ ok: true, ts: now }, { merge: true });
    const snap = await ref.get();

    return NextResponse.json({
      status: 'ok',
      projectId: process.env.FIREBASE_PROJECT_ID,
      authConfigured: !!auth,
      firestoreWriteRead: snap.exists,
      data: snap.data(),
    });
  } catch (error) {
    console.error('Firebase check failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
