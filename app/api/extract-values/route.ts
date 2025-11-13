import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Message, ValueAxes, AxisReasoning } from "@/types";

const EXTRACT_VALUES_PROMPT = `あなたはキャリアカウンセラーです。
以下の対話から、ユーザーの価値観を7つの軸で0-100の数値で推定してください。

# 7つの軸

1. money_vs_meaning (お金 vs やりがい)
   - 0: お金・給料を最重視
   - 50: バランス
   - 100: やりがい・意義を最重視

2. stability_vs_challenge (安定 vs 挑戦)
   - 0: 安定・リスク回避を重視
   - 50: バランス
   - 100: 挑戦・リスクを取りたい

3. team_vs_solo (人と vs 一人で)
   - 0: チームワーク重視
   - 50: バランス
   - 100: 一人で働きたい

4. specialist_vs_generalist (専門 vs 幅広)
   - 0: 一つの専門性を極めたい
   - 50: バランス
   - 100: 幅広く色々やりたい

5. growth_vs_balance (成長 vs ワークライフバランス)
   - 0: 成長・スキルアップ重視
   - 50: バランス
   - 100: プライベート重視

6. corporate_vs_startup (大企業 vs 起業)
   - 0: 大企業・有名企業志向
   - 50: ベンチャー
   - 100: 起業志向

7. social_vs_self (社会貢献 vs 自己実現)
   - 0: 社会・他者のため
   - 50: バランス
   - 100: 自分のため

# 重要なルール
- 明確な手がかりがない軸は50(中立)とする
- 推測ではなく、発言内容に基づいて判断
- confidence は発言の明確さに応じて設定(0-100)
- reasonは具体的な発言内容を引用する

# 出力形式
JSONのみを返してください。説明文は不要です。

{
  "money_vs_meaning": { "value": 70, "reason": "「給料はそこそこでいい」「やりがいが大事」と発言", "confidence": 80 },
  "stability_vs_challenge": { "value": 90, "reason": "...", "confidence": 90 },
  "team_vs_solo": { "value": 30, "reason": "...", "confidence": 60 },
  "specialist_vs_generalist": { "value": 60, "reason": "...", "confidence": 50 },
  "growth_vs_balance": { "value": 80, "reason": "...", "confidence": 70 },
  "corporate_vs_startup": { "value": 95, "reason": "...", "confidence": 85 },
  "social_vs_self": { "value": 40, "reason": "...", "confidence": 65 }
}`;

export async function POST(request: NextRequest) {
  try {
    const { messages, moduleId } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "メッセージが必要です" },
        { status: 400 }
      );
    }

    // Check if there are enough messages for meaningful analysis
    if (messages.length < 2) {
      return NextResponse.json(
        { error: "分析には少なくとも1往復(2メッセージ)の対話が必要です" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Format messages for the prompt
    const conversationText = messages
      .map((msg: Message) => `${msg.role === 'user' ? 'ユーザー' : 'アシスタント'}: ${msg.content}`)
      .join('\n\n');

    const prompt = EXTRACT_VALUES_PROMPT.replace('{{MESSAGES}}', conversationText);

    // Call OpenAI API to extract values
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt },
        ],
        temperature: 0.3, // Lower temperature for more consistent analysis
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to analyze values" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;

    if (!analysisText) {
      return NextResponse.json(
        { error: "分析結果が取得できませんでした" },
        { status: 500 }
      );
    }

    // Parse the analysis result
    let analysis: Record<string, { value: number; reason: string; confidence: number }>;
    try {
      analysis = JSON.parse(analysisText);
    } catch (error) {
      console.error("Failed to parse analysis result:", error);
      return NextResponse.json(
        { error: "分析結果の解析に失敗しました" },
        { status: 500 }
      );
    }

    // Extract values and reasoning
    const axes: Partial<ValueAxes> = {};
    const reasoning: Record<string, AxisReasoning> = {};
    let totalConfidence = 0;
    let axisCount = 0;

    const axisKeys = [
      'money_vs_meaning',
      'stability_vs_challenge',
      'team_vs_solo',
      'specialist_vs_generalist',
      'growth_vs_balance',
      'corporate_vs_startup',
      'social_vs_self'
    ];

    for (const key of axisKeys) {
      if (analysis[key]) {
        axes[key as keyof ValueAxes] = analysis[key].value;
        reasoning[key] = {
          reason: analysis[key].reason,
          confidence: analysis[key].confidence
        };
        totalConfidence += analysis[key].confidence;
        axisCount++;
      } else {
        // Default to neutral if not provided
        axes[key as keyof ValueAxes] = 50;
        reasoning[key] = {
          reason: "情報不足のため中立値",
          confidence: 0
        };
      }
    }

    const overallConfidence = axisCount > 0 ? Math.round(totalConfidence / axisCount) : 0;

    // Return the analysis result (client will handle storage)
    console.log('✅ Value analysis completed successfully!', { overallConfidence });
    return NextResponse.json({
      snapshot: {
        id: `local-${Date.now()}`, // Temporary ID for local storage
        axes: axes as ValueAxes,
        reasoning,
        overall_confidence: overallConfidence,
        created_at: new Date().toISOString(),
        module_id: moduleId || null,
      }
    });

  } catch (error) {
    console.error("Error extracting values:", error);
    return NextResponse.json(
      { error: "価値観の抽出中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
