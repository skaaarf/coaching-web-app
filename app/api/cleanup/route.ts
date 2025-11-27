import { NextRequest, NextResponse } from 'next/server';
import type { Firestore } from 'firebase-admin/firestore';
import { getFirebaseAdminAuth, getFirebaseAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase-admin';

async function deleteByOwner(db: Firestore, collection: string, ownerId: string) {
  const snapshot = await db.collection(collection).where('owner_id', '==', ownerId).get();
  const deletes = snapshot.docs.map((doc) => doc.ref.delete());
  await Promise.all(deletes);
  return snapshot.size;
}

export async function POST(request: NextRequest) {
  if (!isFirebaseAdminConfigured) {
    return NextResponse.json({ error: 'Firebase admin is not configured' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 });
  }

  try {
    const token = authHeader.substring(7);
    const adminAuth = getFirebaseAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const db = getFirebaseAdminDb();
    const moduleCount = await deleteByOwner(db, 'module_progress', uid);
    const interactiveCount = await deleteByOwner(db, 'interactive_module_progress', uid);
    const insightsCount = await deleteByOwner(db, 'user_insights', uid);
    const valueSnapshotsCount = await deleteByOwner(db, 'value_snapshots', uid);

    // Also try deleting documents keyed directly by uid (insights may use uid as doc id)
    await Promise.all([
      db.collection('user_insights').doc(uid).delete().catch(() => null),
    ]);

    return NextResponse.json({
      status: 'ok',
      deleted: {
        module_progress: moduleCount,
        interactive_module_progress: interactiveCount,
        user_insights: insightsCount,
        value_snapshots: valueSnapshotsCount,
      },
    });
  } catch (error) {
    console.error('Cleanup error', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
