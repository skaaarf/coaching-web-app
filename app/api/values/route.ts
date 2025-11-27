import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminAuth, getFirebaseAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { ValueSnapshot, ValueAxes, AxisReasoning } from "@/types";

interface DBValueSnapshot {
  id: string;
  user_id: string;
  module_id: string | null;
  money_vs_meaning: number;
  stability_vs_challenge: number;
  team_vs_solo: number;
  specialist_vs_generalist: number;
  growth_vs_balance: number;
  corporate_vs_startup: number;
  social_vs_self: number;
  reasoning: Record<keyof ValueAxes, AxisReasoning>;
  overall_confidence: number;
  created_at: string;
  last_updated: string;
}

function dbToSnapshot(db: DBValueSnapshot): ValueSnapshot {
  return {
    id: db.id,
    user_id: db.user_id,
    module_id: db.module_id || undefined,
    axes: {
      money_vs_meaning: db.money_vs_meaning,
      stability_vs_challenge: db.stability_vs_challenge,
      team_vs_solo: db.team_vs_solo,
      specialist_vs_generalist: db.specialist_vs_generalist,
      growth_vs_balance: db.growth_vs_balance,
      corporate_vs_startup: db.corporate_vs_startup,
      social_vs_self: db.social_vs_self,
    },
    reasoning: db.reasoning as Record<keyof ValueAxes, AxisReasoning>,
    overall_confidence: db.overall_confidence,
    created_at: new Date(db.created_at),
    last_updated: new Date(db.last_updated),
  };
}

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
  if (!isFirebaseAdminConfigured) return null;
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const adminAuth = getFirebaseAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch (error) {
    console.error('Failed to verify Firebase ID token', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ error: "Firebase admin が未設定です" }, { status: 500 });
    }

    // Get authenticated user
    const userId = await getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const includeHistory = searchParams.get('includeHistory') === 'true';

    // Get all snapshots for the user, ordered by creation date
    const snapshotsSnap = await getFirebaseAdminDb()!
      .collection('value_snapshots')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    if (snapshotsSnap.empty) {
      return NextResponse.json({
        current: null,
        previous: null,
        history: [],
      });
    }

    const snapshots = snapshotsSnap.docs.map((doc) => {
      const data = doc.data() as DBValueSnapshot;
      return dbToSnapshot({
        ...data,
        id: doc.id,
      });
    });

    const current = snapshots[0];
    const previous = snapshots.length > 1 ? snapshots[1] : null;
    const history = includeHistory ? snapshots : [];

    return NextResponse.json({
      current,
      previous,
      history,
    });

  } catch (error) {
    console.error("Error fetching values:", error);
    return NextResponse.json(
      { error: "価値観の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ error: "Firebase admin が未設定です" }, { status: 500 });
    }

    // Get authenticated user
    const userId = await getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate the request body
    if (!body.axes) {
      return NextResponse.json(
        { error: "axes フィールドが必要です" },
        { status: 400 }
      );
    }

    // Get the most recent snapshot
    const currentSnapshotSnap = await getFirebaseAdminDb()!
      .collection('value_snapshots')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();

    if (currentSnapshotSnap.empty) {
      return NextResponse.json(
        { error: "既存の価値観が見つかりません" },
        { status: 404 }
      );
    }

    const currentSnapshot = currentSnapshotSnap.docs[0];
    const currentData = currentSnapshot.data() as DBValueSnapshot;

    // Update the snapshot
    const updatedPayload: Partial<DBValueSnapshot> = {
      money_vs_meaning: body.axes.money_vs_meaning ?? currentData.money_vs_meaning,
      stability_vs_challenge: body.axes.stability_vs_challenge ?? currentData.stability_vs_challenge,
      team_vs_solo: body.axes.team_vs_solo ?? currentData.team_vs_solo,
      specialist_vs_generalist: body.axes.specialist_vs_generalist ?? currentData.specialist_vs_generalist,
      growth_vs_balance: body.axes.growth_vs_balance ?? currentData.growth_vs_balance,
      corporate_vs_startup: body.axes.corporate_vs_startup ?? currentData.corporate_vs_startup,
      social_vs_self: body.axes.social_vs_self ?? currentData.social_vs_self,
      last_updated: new Date().toISOString(),
    };

    await currentSnapshot.ref.update(updatedPayload);

    const updatedSnapshot = {
      ...currentData,
      ...updatedPayload,
      id: currentSnapshot.id,
    } as DBValueSnapshot;

    return NextResponse.json({
      success: true,
      snapshot: dbToSnapshot(updatedSnapshot),
    });

  } catch (error) {
    console.error("Error updating values:", error);
    return NextResponse.json(
      { error: "価値観の更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
