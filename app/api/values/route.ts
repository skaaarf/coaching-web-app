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

export async function PATCH(request: NextRequest) {
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
    const body = await request.json();

    // Validate the request body
    if (!body.axes) {
      return NextResponse.json(
        { error: "axes フィールドが必要です" },
        { status: 400 }
      );
    }

    // Get the most recent snapshot
    const { data: currentSnapshot, error: fetchError } = await supabase
      .from('value_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !currentSnapshot) {
      return NextResponse.json(
        { error: "既存の価値観が見つかりません" },
        { status: 404 }
      );
    }

    // Update the snapshot
    const { data: updatedSnapshot, error: updateError } = await supabase
      .from('value_snapshots')
      .update({
        money_vs_meaning: body.axes.money_vs_meaning ?? currentSnapshot.money_vs_meaning,
        stability_vs_challenge: body.axes.stability_vs_challenge ?? currentSnapshot.stability_vs_challenge,
        team_vs_solo: body.axes.team_vs_solo ?? currentSnapshot.team_vs_solo,
        specialist_vs_generalist: body.axes.specialist_vs_generalist ?? currentSnapshot.specialist_vs_generalist,
        growth_vs_balance: body.axes.growth_vs_balance ?? currentSnapshot.growth_vs_balance,
        corporate_vs_startup: body.axes.corporate_vs_startup ?? currentSnapshot.corporate_vs_startup,
        social_vs_self: body.axes.social_vs_self ?? currentSnapshot.social_vs_self,
        last_updated: new Date().toISOString(),
      })
      .eq('id', currentSnapshot.id)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json(
        { error: "価値観の更新に失敗しました" },
        { status: 500 }
      );
    }

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
