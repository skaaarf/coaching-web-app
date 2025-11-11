import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { DBValueSnapshot } from "@/lib/supabase";
import { ValueSnapshot, ValueAxes, AxisReasoning } from "@/types";

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

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const includeHistory = searchParams.get('includeHistory') === 'true';

    // Get all snapshots for the user, ordered by creation date
    const { data: snapshots, error: dbError } = await supabase
      .from('value_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "データベースからの取得に失敗しました" },
        { status: 500 }
      );
    }

    if (!snapshots || snapshots.length === 0) {
      return NextResponse.json({
        current: null,
        previous: null,
        history: [],
      });
    }

    const current = dbToSnapshot(snapshots[0]);
    const previous = snapshots.length > 1 ? dbToSnapshot(snapshots[1]) : null;
    const history = includeHistory ? snapshots.map(dbToSnapshot) : [];

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
