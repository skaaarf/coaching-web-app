# マイページ分析結果実装計画書（詳細版）

## 📋 目次
1. [プロジェクト概要](#プロジェクト概要)
2. [全体アーキテクチャ](#全体アーキテクチャ)
3. [コンポーネント設計](#コンポーネント設計)
4. [データ型定義](#データ型定義)
5. [モックデータ仕様](#モックデータ仕様)
6. [UI/UXデザイン仕様](#uiuxデザイン仕様)
7. [実装手順](#実装手順)
8. [技術的考慮事項](#技術的考慮事項)

---

## プロジェクト概要

### 目的
ユーザーの自己分析・キャリア診断結果を包括的に可視化し、就職活動の意思決定をサポートするマイページの拡張機能を実装する。

### スコープ
- **対象ページ**: `/profile`（既存ページの拡張）
- **実装形式**: 8つの独立したReactコンポーネント + 統合コンポーネント
- **データ管理**: コンポーネント内ハードコードサンプルデータ（後でAPI接続予定）
- **レスポンシブ対応**: モバイルファーストデザイン

### 技術スタック
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIライブラリ**: 既存のカスタムコンポーネント（Badge, Card, Button等）
- **アイコン**: lucide-react

---

## 全体アーキテクチャ

### ディレクトリ構造
```
coaching-web-app/
├── app/
│   └── profile/
│       └── page.tsx                          # メインページ（既存を拡張）
├── components/
│   └── profile/
│       ├── AIAptitudeResults.tsx             # 既存コンポーネント
│       ├── RadarChart.tsx                    # 既存コンポーネント
│       ├── analysis/                         # 新規ディレクトリ
│       │   ├── AnalysisResults.tsx           # 統合コンポーネント
│       │   ├── CareerTypeCard.tsx            # 1. キャリアタイプカード
│       │   ├── SelfUnderstandingProgress.tsx # 2. 自己理解の進捗
│       │   ├── StrengthsList.tsx             # 3. 強み（詳細版）
│       │   ├── ValuesCompatibility.tsx       # 4. 価値観+働き方の相性
│       │   ├── CareerVision.tsx              # 5. キャリアビジョン
│       │   ├── IndustryMatch.tsx             # 6. 向いている業界・職種
│       │   ├── AIComment.tsx                 # 7. AI総合コメント
│       │   └── UpdateHistory.tsx             # 8. 更新履歴
│       └── shared/
│           ├── ProgressBar.tsx               # 共通プログレスバー
│           └── SliderBar.tsx                 # 価値観スライダー
├── types/
│   └── profile.ts                            # 型定義ファイル
└── data/
    └── mockProfileAnalysis.ts                # モックデータ
```

### コンポーネント階層
```
ProfilePage
├── UserInfoCard (既存)
├── StatsGrid (既存)
├── CareerCandidates (既存)
├── AIAptitudeResults (既存)
└── AnalysisResults (新規)
    ├── CareerTypeCard
    ├── SelfUnderstandingProgress
    ├── StrengthsList
    ├── ValuesCompatibility
    ├── CareerVision
    ├── IndustryMatch
    ├── AIComment
    └── UpdateHistory
```

---

## コンポーネント設計

### 1. CareerTypeCard（キャリアタイプカード）

#### 責務
ユーザーのキャリアタイプ（キャリア・アンカー）を視覚的に表示し、強みと最終更新日を示す。

#### Props型
```typescript
interface CareerTypeCardProps {
  type: string;              // 例: "構造化×起業家的創造性"
  description: string;       // 2行程度の説明文
  anchors: string[];         // キャリア・アンカー（最大2つ）
  strengths: string[];       // 主要な強み（最大3つ）
  lastUpdated: string;       // ISO 8601形式の日付
}
```

#### UI構成
```
┌─────────────────────────────────────────┐
│ 🏷️ あなたのキャリアタイプ              │
│                                         │
│ 「構造化×起業家的創造性」タイプ        │
│                                         │
│ 複雑な課題を整理し、0→1を生み出す力  │
│ が強み。変化の多い環境で、裁量を持っ  │
│ て新しいことに挑める場が最適。        │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│ キャリア・アンカー：                    │
│   起業家的創造性 × 自律・独立          │
│ 強み：構造化力、創造的思考、粘り強さ  │
│ 最終更新：2024/12/3                     │
└─────────────────────────────────────────┘
```

#### 実装詳細
- **背景**: `bg-gradient-to-br from-primary/5 to-accent/5`
- **タイトル絵文字**: 🏷️
- **区切り線**: 上下にグレーの区切り線
- **日付フォーマット**: `YYYY/M/D` 形式
- **レスポンシブ**: フル幅表示

---

### 2. SelfUnderstandingProgress（自己理解の進捗）

#### 責務
自己分析の完成度を可視化し、次のおすすめアクションを提示する。

#### Props型
```typescript
interface SelfUnderstandingProgressProps {
  overallProgress: number;        // 0-100
  categories: {
    name: string;                 // カテゴリ名
    progress: number;             // 0-100
    count?: number;               // 件数（任意）
    confidence?: number;          // 信頼度 1-5（任意）
  }[];
  nextRecommendation: {
    title: string;                // おすすめアクション
    description: string;          // 説明
    benefits: string[];           // 期待される効果
  };
}
```

#### UI構成
```
┌─────────────────────────────────────────┐
│ 📊 自己理解の完成度：78% 🎉             │
│                                         │
│ ├ 強み発見：100%（3件、信頼度 ⭐⭐⭐⭐☆）│
│ ├ 価値観明確化：80%（4項目）            │
│ ├ キャリア・アンカー：100%（診断完了） │
│ ├ キャリアビジョン：60%                 │
│ └ 業界マッチング：50%                   │
│                                         │
│ 💡 次のおすすめ：                       │
│    「インターン経験を振り返る」        │
│    → 強みの信頼度UP、業界マッチング  │
│       精度が向上                        │
│                                         │
│ [🎯 今すぐ始める]                       │
└─────────────────────────────────────────┘
```

#### 実装詳細
- **プログレスバー**: 親が大きく、子カテゴリは小さく
- **アニメーション**: 数値カウントアップアニメーション（0→78%）
- **信頼度表示**: ⭐を1-5個で視覚化
- **CTAボタン**: `bg-accent` の丸みのあるボタン

---

### 3. StrengthsList（強み・詳細版）

#### 責務
発見された強みを、信頼度・エピソード付きで一覧表示する。

#### Props型
```typescript
interface Episode {
  id: string;
  title: string;                 // エピソードタイトル
  fullText?: string;             // 展開時に表示する全文（任意）
  date?: string;                 // 記録日（任意）
}

interface Strength {
  id: string;
  name: string;                  // 強みの名前
  rating: number;                // 信頼度 1-5
  ratingText: string;            // 表示用 "4.0/5.0"
  description: string;           // 説明文
  typicalBehaviors: string[];    // 典型行動（3つ程度）
  episodes: Episode[];           // 根拠エピソード
  lastUpdated: string;           // ISO 8601
  needsMoreEpisodes?: boolean;   // エピソード不足の警告有無
}

interface StrengthsListProps {
  strengths: Strength[];
  totalCount: number;            // 強みの件数表示用
}
```

#### UI構成
```
┌─────────────────────────────────────────┐
│ 💪 強み（3件発見）                      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ [構造化・要点整理力] ⭐⭐⭐⭐⭐ (5.0/5.0) │
│                                         │
│ 複雑な状況でも情報を整理し、論点を明確│
│ 化できる。                              │
│                                         │
│ 典型行動：                              │
│ ・課題の背景を素早く把握する          │
│ ・バラバラの情報を構造化して整理する  │
│ ・論点を明確にしてチームに共有する    │
│                                         │
│ 根拠エピソード（3件）：                │
│ 📝 学園祭で混乱した進行タスクを可視化…│
│ 📝 ゼミでデータ分析結果を構造化…      │
│ 📝 インターンで顧客課題を整理し…      │
│                                         │
│ 最終更新：2024/12/3                     │
│ [詳細を見る]                            │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ [創造的思考] ⭐⭐⭐⭐☆ (4.0/5.0)         │
│ ...                                     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ ➕ 新しい強みを追加する                │
└─────────────────────────────────────────┘
```

#### 実装詳細
- **件数表示**: `totalCount` を見出しの「n件発見」に反映
- **信頼度**: 星5段階 + 数値表示
- **エピソード**: 省略表示（最初の20文字程度）
- **アコーディオン**: 「詳細を見る」でエピソード全文展開
- **低信頼度の場合**: 💡マークで「もう1-2件エピソードがあると信頼度UP」と促す
- **追加ボタン**: 画面下部に固定

---

### 4. ValuesCompatibility（価値観+働き方の相性）

#### 責務
ユーザーの価値観と働き方の傾向をスライダーと文章で表現する。

#### Props型
```typescript
interface ValueItem {
  id: string;
  title: string;                 // 価値観名
  score: number;                 // 1-10スケール
  leftLabel: string;             // 左端ラベル
  rightLabel: string;            // 右端ラベル
  description: string;           // 説明文
  anchorRelation?: string[];     // 関連するキャリア・アンカー
}

interface WorkStyleAxis {
  name: string;                  // 軸名
  score: number;                 // 1-10
  leftLabel: string;
  rightLabel: string;
}

interface ValuesCompatibilityProps {
  values: ValueItem[];
  workStyleAxes: WorkStyleAxis[];
  suitableEnvironments: string[];
  unsuitableEnvironments: string[];
}
```

#### UI構成
```
┌─────────────────────────────────────────┐
│ 🧭 価値観＋働き方の相性                 │
│                                         │
│ 【あなたが大切にしたいこと】           │
│                                         │
│ ①新しいことへの挑戦意欲                │
│ 挑戦 ━━━━━━━●━━ 安定 (8/10)          │
│ └ 未知の領域に飛び込む瞬間に最も成長  │
│    を実感                               │
│ └ キャリア・アンカー：起業家的創造性、│
│    純粋な挑戦                           │
│                                         │
│ ②選択の自由・裁量                      │
│ 自由 ━━━━━━━━●━ ルール (9/10)        │
│ └ 自分で判断しながら動ける環境で最も  │
│    パフォーマンスが上がる              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 【働き方の相性】                        │
│ チーム ━━━●━━━━━━ 個人 (4/10)        │
│ 速い   ━━━━━●━━━━ 緻密 (6/10)        │
│ 外向   ━━━━●━━━━━ 内向 (5/10)        │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 【合う環境】                            │
│ ✅ ベンチャー/新規事業                  │
│ ✅ 裁量権が大きい環境                  │
│                                         │
│ 【合わない環境】                        │
│ ⚠️ ルーティンワーク中心                │
│ ⚠️ 裁量が少ない組織                    │
└─────────────────────────────────────────┘
```

#### 実装詳細
- **スライダー**: Unicode文字でビジュアル表現（●の位置でスコア表示）
- **色分け**: 高スコア（8-10）は太字、低スコア（1-3）は灰色
- **階層構造**: 番号付きリスト + インデント
- **アイコン**: ✅（合う）、⚠️（合わない）

---

### 5. CareerVision（キャリアビジョン）

#### 責務
キャリア・アンカー診断結果と将来ビジョンを統合表示する。

#### Props型
```typescript
interface AnchorScore {
  name: string;                  // アンカー名
  score: number;                 // 1-10
  description: string;           // 説明
}

interface CareerVisionProps {
  coreAnchors: string[];         // コアアンカー（2つ）
  anchorRanking: AnchorScore[];  // トップ3
  opportunities: string[];       // 手放したくない機会
  challenges: string[];          // 苦手なこと
  vision3Years: string;          // 3年後の姿
  vision10Years: string;         // 10年後の姿
  skillsToGrow: string[];        // 伸ばしたいスキル
}
```

#### UI構成
```
┌─────────────────────────────────────────┐
│ 🚀 キャリアビジョン                     │
│                                         │
│ 【核となるキャリア・アンカー】         │
│ 「起業家的創造性」×「自律・独立」タイプ│
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 🎯 アンカー診断（Top3）                 │
│                                         │
│ 1位：起業家的創造性 ━━━━━━━●━ (8/10)  │
│ └ 組織の構築、新規性、リスクテイクに  │
│    魅力                                 │
│                                         │
│ 2位：自律・独立 ━━━━━━●━━ (7/10)      │
│ └ 自己裁量、自由を重視                │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 【あなたが手放したくない機会】         │
│ ✅ 新しいプロジェクトを0から立ち上げる│
│    機会                                 │
│ ✅ 自分で判断し、裁量を持って動ける  │
│    環境                                 │
│                                         │
│ ⚠️ 逆に苦手なこと                       │
│ ・ルーティンワークが中心の業務        │
│ ・指示待ちで動く仕事                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 【3年後の姿】                           │
│ 新規事業や企画職で、裁量を持ちながら  │
│ 0→1を生み出せる人材。                  │
│                                         │
│ 【10年後の姿】                          │
│ 事業責任者、または起業家として、複数  │
│ 領域で価値を生み続ける存在。          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 【今後伸ばしたいスキル】                │
│ ✅ 課題発見力                           │
│ ✅ 仮説検証力                           │
│ ✅ データ分析                           │
│ ✅ チームマネジメント                   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 💡 キャリア・アンカーは経験を通じて    │
│    変化することもあります。定期的に見  │
│    直すことが大切です。                │
└─────────────────────────────────────────┘
```

#### 実装詳細
- **プログレスバー**: 各アンカーにスコア付き
- **セクション分割**: 明確な区切り線
- **注意書き**: 最下部に薄いグレーで表示

---

### 6. IndustryMatch（向いている業界・職種）

#### 責務
適職マッチング結果をランキング形式で表示し、詳細情報へのリンクを提供する。

#### Props型
```typescript
interface IndustryMatchItem {
  rank: number;                  // 順位
  industry: string;              // 業界名
  positions: string[];           // 想定職種
  matchScore: number;            // マッチ度 0-100
  matchReasons: string[];        // マッチ理由（箇条書き）
  warnings?: string[];           // 注意点（任意）
  companies: string[];           // 代表企業
}

interface IndustryMatchProps {
  matches: IndustryMatchItem[];  // Top 3
}
```

#### UI構成
```
┌─────────────────────────────────────────┐
│ 🎯 向いている業界・職種（Top3）         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 1️⃣ コンサル・IT/SaaS業界                │
│ 想定職種：企画職 / PM / コンサルタント  │
│ マッチ度：★★★★★ 92%                   │
│                                         │
│ 【マッチ理由】                          │
│ ✅ 強み「構造化力」「創造的思考」が    │
│    業務と一致                           │
│ ✅ アンカー「起業家的創造性」「自律・  │
│    独立」が満たされる                  │
│ ✅ 新しいプロジェクト、裁量、挑戦の    │
│    機会が豊富                           │
│                                         │
│ 【代表企業】                            │
│ アクセンチュア、デロイト、リクルート、│
│ ビズリーチ、メルカリ                   │
│                                         │
│ [📄 この職種向けのES例を見る]           │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 2️⃣ マーケティング・広告業界            │
│ ...                                     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 📌 すべての業界を見る                   │
│ 📝 この結果をもとにESを作成する         │
└─────────────────────────────────────────┘
```

#### 実装詳細
- **星表示**: 20%ごとに★1つ（満点5つ）
- **順位絵文字**: 1️⃣ 2️⃣ 3️⃣
- **警告**: ⚠️マークで注意点を表示
- **CTAボタン**: 各業界にES例リンク
- **フッターリンク**: 全体を見る、ES作成へ

---

### 7. AIComment（AI総合コメント）

#### 責務
全分析結果を統合したAIの総評を表示する。

#### Props型
```typescript
interface AICommentProps {
  summary: string;               // 総評（3-4行）
  strengths: string[];           // 就活での強み
  warnings: string[];            // 注意すべきポイント
  downloadAvailable: boolean;    // PDF DL可否
  emailAvailable: boolean;       // メール送信可否
}
```

#### UI構成
```
┌─────────────────────────────────────────┐
│ 🤖 AIからの総合コメント                 │
│                                         │
│ あなたは「構造化×起業家的創造性」タイプ│
│ で、複雑な課題を整理し、新しいフィール│
│ ドで価値を生み出す力があります。      │
│                                         │
│ 【就活での強み】                        │
│ ✅ 論理的に課題を整理できる力          │
│    → 面接で高評価                      │
│ ✅ 挑戦志向の姿勢                      │
│    → 成長企業で求められる              │
│ ✅ 自分の価値観が明確                  │
│    → 企業選びの軸がブレない            │
│                                         │
│ 【注意すべきポイント】                  │
│ ⚠️ 裁量が少ない企業では、モチベーション│
│    低下のリスク                         │
│ ⚠️ 自由度だけでなく、成長機会も重視    │
│    すると◎                              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ [📄 この分析結果をPDFでダウンロード]    │
│ [📧 この結果を自分にメールで送る]      │
└─────────────────────────────────────────┘
```

#### 実装詳細
- **アイコン**: 🤖
- **背景**: 薄いグレーの枠線
- **ボタン**: アウトライン型、2つ横並び

---

### 8. UpdateHistory（更新履歴）

#### 責務
分析結果の変更履歴をタイムライン形式で表示する。

#### Props型
```typescript
interface UpdateHistoryItem {
  date: string;                  // ISO 8601
  changes: {
    category: string;            // カテゴリ
    description: string;         // 変更内容
  }[];
}

interface UpdateHistoryProps {
  history: UpdateHistoryItem[];  // 最新3件
  hasMore: boolean;              // それ以上あるか
}
```

#### UI構成
```
┌─────────────────────────────────────────┐
│ 📅 更新履歴                              │
│                                         │
│ 2024/12/3                               │
│ ・強み「構造化力」にエピソード1件追加  │
│ ・キャリア候補「データアナリスト」が  │
│   新たに追加                            │
│ ・AI総合コメントが更新                  │
│                                         │
│ 2024/12/1                               │
│ ・価値観「挑戦志向」のスコアが7→8に  │
│   上昇                                  │
│ ・適職マッチ度が再計算                │
│                                         │
│ 2024/11/20                              │
│ ・強み「創造的思考」が新たに発見      │
│ ・適性職種に「プロデューサー」が追加  │
│                                         │
│ [すべての履歴を見る →]                  │
└─────────────────────────────────────────┘
```

#### 実装詳細
- **日付**: 太字で強調
- **変更項目**: インデント + ・付き箇条書き
- **件数制限**: デフォルト3件まで表示
- **展開リンク**: 「すべての履歴を見る」

---

## データ型定義

### 統合型定義ファイル: `types/profile.ts`

```typescript
// ========================================
// 1. CareerTypeCard
// ========================================
export interface CareerTypeData {
  type: string;
  description: string;
  anchors: string[];
  strengths: string[];
  lastUpdated: string;
}

// ========================================
// 2. SelfUnderstandingProgress
// ========================================
export interface ProgressCategory {
  name: string;
  progress: number;
  count?: number;
  confidence?: number;
}

export interface NextRecommendation {
  title: string;
  description: string;
  benefits: string[];
}

export interface SelfUnderstandingData {
  overallProgress: number;
  categories: ProgressCategory[];
  nextRecommendation: NextRecommendation;
}

// ========================================
// 3. StrengthsList
// ========================================
export interface Episode {
  id: string;
  title: string;
  fullText?: string;
  date?: string;
}

export interface Strength {
  id: string;
  name: string;
  rating: number;
  ratingText: string;
  description: string;
  typicalBehaviors: string[];
  episodes: Episode[];
  lastUpdated: string;
  needsMoreEpisodes?: boolean;
}

export interface StrengthsData {
  strengths: Strength[];
  totalCount: number;
}

// ========================================
// 4. ValuesCompatibility
// ========================================
export interface ValueItem {
  id: string;
  title: string;
  score: number;
  leftLabel: string;
  rightLabel: string;
  description: string;
  anchorRelation?: string[];
}

export interface WorkStyleAxis {
  name: string;
  score: number;
  leftLabel: string;
  rightLabel: string;
}

export interface ValuesCompatibilityData {
  values: ValueItem[];
  workStyleAxes: WorkStyleAxis[];
  suitableEnvironments: string[];
  unsuitableEnvironments: string[];
}

// ========================================
// 5. CareerVision
// ========================================
export interface AnchorScore {
  name: string;
  score: number;
  description: string;
}

export interface CareerVisionData {
  coreAnchors: string[];
  anchorRanking: AnchorScore[];
  opportunities: string[];
  challenges: string[];
  vision3Years: string;
  vision10Years: string;
  skillsToGrow: string[];
}

// ========================================
// 6. IndustryMatch
// ========================================
export interface IndustryMatchItem {
  rank: number;
  industry: string;
  positions: string[];
  matchScore: number;
  matchReasons: string[];
  warnings?: string[];
  companies: string[];
}

export interface IndustryMatchData {
  matches: IndustryMatchItem[];
}

// ========================================
// 7. AIComment
// ========================================
export interface AICommentData {
  summary: string;
  strengths: string[];
  warnings: string[];
  downloadAvailable: boolean;
  emailAvailable: boolean;
}

// ========================================
// 8. UpdateHistory
// ========================================
export interface UpdateHistoryChange {
  category: string;
  description: string;
}

export interface UpdateHistoryItem {
  date: string;
  changes: UpdateHistoryChange[];
}

export interface UpdateHistoryData {
  history: UpdateHistoryItem[];
  hasMore: boolean;
}

// ========================================
// 統合型
// ========================================
export interface ProfileAnalysisData {
  careerType: CareerTypeData;
  selfUnderstanding: SelfUnderstandingData;
  strengths: StrengthsData;
  valuesCompatibility: ValuesCompatibilityData;
  careerVision: CareerVisionData;
  industryMatch: IndustryMatchData;
  aiComment: AICommentData;
  updateHistory: UpdateHistoryData;
}
```

---

## モックデータ仕様

### `data/mockProfileAnalysis.ts`

```typescript
import { ProfileAnalysisData } from '@/types/profile';

export const mockProfileAnalysisData: ProfileAnalysisData = {
  // 1. キャリアタイプ
  careerType: {
    type: '「構造化×起業家的創造性」タイプ',
    description: '複雑な課題を整理し、0→1を生み出す力が強み。変化の多い環境で、裁量を持って新しいことに挑める場が最適。',
    anchors: ['起業家的創造性', '自律・独立'],
    strengths: ['構造化力', '創造的思考', '粘り強さ'],
    lastUpdated: '2024-12-03T00:00:00Z',
  },

  // 2. 自己理解の進捗
  selfUnderstanding: {
    overallProgress: 78,
    categories: [
      { name: '強み発見', progress: 100, count: 3, confidence: 4 },
      { name: '価値観明確化', progress: 80, count: 4 },
      { name: 'キャリア・アンカー', progress: 100 },
      { name: 'キャリアビジョン', progress: 60 },
      { name: '業界マッチング', progress: 50 },
    ],
    nextRecommendation: {
      title: 'インターン経験を振り返る',
      description: '強みの信頼度UP、業界マッチング精度が向上',
      benefits: ['強みの信頼度UP', '業界マッチング精度向上'],
    },
  },

  // 3. 強み
  strengths: {
    totalCount: 3,
    strengths: [
      {
        id: 'strength-1',
        name: '構造化・要点整理力',
        rating: 5,
        ratingText: '5.0/5.0',
        description: '複雑な状況でも情報を整理し、論点を明確化できる。',
        typicalBehaviors: [
          '課題の背景を素早く把握する',
          'バラバラの情報を構造化して整理する',
          '論点を明確にしてチームに共有する',
        ],
        episodes: [
          {
            id: 'ep-1',
            title: '学園祭で混乱した進行タスクを可視化、役割分担を再構築',
            fullText: '学園祭の準備期間中、タスク管理が混乱していたため、全体を可視化し役割分担を再構築した。結果、遅延していた作業が予定通り完了した。',
            date: '2024-10-15',
          },
          {
            id: 'ep-2',
            title: 'ゼミでデータ分析結果を構造化してレポート作成',
            fullText: 'ゼミの研究で複雑なデータ分析結果をわかりやすく構造化し、教授から高評価を得た。',
            date: '2024-09-20',
          },
          {
            id: 'ep-3',
            title: 'インターンで顧客課題を整理し、提案資料に落とし込み',
            fullText: 'インターン先で顧客からヒアリングした課題を整理し、提案資料として落とし込んだ。顧客から「わかりやすい」との評価を受けた。',
            date: '2024-08-10',
          },
        ],
        lastUpdated: '2024-12-03T00:00:00Z',
      },
      {
        id: 'strength-2',
        name: '創造的思考',
        rating: 4,
        ratingText: '4.0/5.0',
        description: '既存の枠にとらわれず、新しいアイデアを生み出せる。',
        typicalBehaviors: [
          '前例にとらわれない発想ができる',
          '「なぜ？」を繰り返して本質を探る',
          '複数の視点から物事を見られる',
        ],
        episodes: [
          {
            id: 'ep-4',
            title: 'サークルで新企画を立案し、実行まで主導',
            date: '2024-07-01',
          },
          {
            id: 'ep-5',
            title: '授業で独自の視点から課題を分析',
            date: '2024-06-15',
          },
        ],
        lastUpdated: '2024-12-01T00:00:00Z',
      },
      {
        id: 'strength-3',
        name: '粘り強さ',
        rating: 3,
        ratingText: '3.0/5.0',
        description: '困難な状況でも諦めずに取り組み続けられる。',
        typicalBehaviors: [],
        episodes: [
          {
            id: 'ep-6',
            title: 'アルバイトで難しい業務に挑戦、3ヶ月かけて習得',
            date: '2024-05-01',
          },
        ],
        lastUpdated: '2024-11-20T00:00:00Z',
        needsMoreEpisodes: true,
      },
    ],
  },

  // 4. 価値観+働き方の相性
  valuesCompatibility: {
    values: [
      {
        id: 'value-1',
        title: '新しいことへの挑戦意欲',
        score: 8,
        leftLabel: '挑戦',
        rightLabel: '安定',
        description: '未知の領域に飛び込む瞬間に最も成長を実感',
        anchorRelation: ['起業家的創造性', '純粋な挑戦'],
      },
      {
        id: 'value-2',
        title: '選択の自由・裁量',
        score: 9,
        leftLabel: '自由',
        rightLabel: 'ルール',
        description: '自分で判断しながら動ける環境で最もパフォーマンスが上がる',
        anchorRelation: ['自律・独立'],
      },
      {
        id: 'value-3',
        title: '創造性を活かした企画力',
        score: 8,
        leftLabel: '創造',
        rightLabel: '実行',
        description: '新しい価値を生み出すことにやりがいを感じる',
        anchorRelation: ['起業家的創造性'],
      },
      {
        id: 'value-4',
        title: '最後までやり抜く継続力',
        score: 7,
        leftLabel: '継続',
        rightLabel: '柔軟',
        description: '始めたことは責任を持って完遂したい',
      },
    ],
    workStyleAxes: [
      { name: 'チーム⇔個人', score: 4, leftLabel: 'チーム', rightLabel: '個人' },
      { name: '速い⇔緻密', score: 6, leftLabel: '速い', rightLabel: '緻密' },
      { name: '外向⇔内向', score: 5, leftLabel: '外向', rightLabel: '内向' },
    ],
    suitableEnvironments: [
      'ベンチャー/新規事業',
      '裁量権が大きい環境',
      'スピード感重視',
    ],
    unsuitableEnvironments: [
      'ルーティンワーク中心',
      '裁量が少ない組織',
      '変化を嫌う保守的な文化',
    ],
  },

  // 5. キャリアビジョン
  careerVision: {
    coreAnchors: ['起業家的創造性', '自律・独立'],
    anchorRanking: [
      {
        name: '起業家的創造性',
        score: 8,
        description: '組織の構築、新規性、リスクテイクに魅力',
      },
      {
        name: '自律・独立',
        score: 7,
        description: '自己裁量、自由を重視',
      },
      {
        name: '純粋な挑戦',
        score: 5,
        description: '困難な課題に取り組むこと自体が楽しい',
      },
    ],
    opportunities: [
      '新しいプロジェクトを0から立ち上げる機会',
      '自分で判断し、裁量を持って動ける環境',
      '未知の課題に挑戦できる場',
    ],
    challenges: [
      'ルーティンワークが中心の業務',
      '指示待ちで動く仕事',
    ],
    vision3Years: '新規事業や企画職で、裁量を持ちながら0→1を生み出せる人材。「このプロジェクトは〇〇さんが立ち上げた」と言われる存在。',
    vision10Years: '事業責任者、または起業家として、複数領域で価値を生み続ける存在。',
    skillsToGrow: ['課題発見力', '仮説検証力', 'データ分析', 'チームマネジメント'],
  },

  // 6. 向いている業界・職種
  industryMatch: {
    matches: [
      {
        rank: 1,
        industry: 'コンサル・IT/SaaS業界',
        positions: ['企画職', 'PM', 'コンサルタント'],
        matchScore: 92,
        matchReasons: [
          '強み「構造化力」「創造的思考」が業務と一致',
          'アンカー「起業家的創造性」「自律・独立」が満たされる',
          '新しいプロジェクト、裁量、挑戦の機会が豊富',
        ],
        companies: ['アクセンチュア', 'デロイト', 'リクルート', 'ビズリーチ', 'メルカリ'],
      },
      {
        rank: 2,
        industry: 'マーケティング・広告業界',
        positions: ['マーケター', 'ブランドマネージャー'],
        matchScore: 85,
        matchReasons: [
          '強み「創造的思考」が企画立案で活きる',
          'アンカー「起業家的創造性」と相性◎',
        ],
        warnings: ['データ分析スキルを伸ばすとさらに◎'],
        companies: ['電通', '博報堂', 'サイバーエージェント', 'ユーザベース'],
      },
      {
        rank: 3,
        industry: 'エンターテイメント・コンテンツ業界',
        positions: ['企画職', 'プロデューサー'],
        matchScore: 78,
        matchReasons: [
          '強み「創造性」「企画力」が活かせる',
        ],
        warnings: ['裁量が限られる場合もあり、企業選びを慎重に'],
        companies: ['ソニー・ミュージック', 'アニプレックス', '集英社'],
      },
    ],
  },

  // 7. AI総合コメント
  aiComment: {
    summary: 'あなたは「構造化×起業家的創造性」タイプで、複雑な課題を整理し、新しいフィールドで価値を生み出す力があります。',
    strengths: [
      '論理的に課題を整理できる力 → 面接で高評価',
      '挑戦志向の姿勢 → 成長企業で求められる',
      '自分の価値観が明確 → 企業選びの軸がブレない',
    ],
    warnings: [
      '裁量が少ない企業では、モチベーション低下のリスク',
      '自由度だけでなく、成長機会も重視すると◎',
    ],
    downloadAvailable: true,
    emailAvailable: true,
  },

  // 8. 更新履歴
  updateHistory: {
    history: [
      {
        date: '2024-12-03T00:00:00Z',
        changes: [
          { category: '強み', description: '強み「構造化力」にエピソード1件追加' },
          { category: 'キャリア候補', description: 'キャリア候補「データアナリスト」が新たに追加' },
          { category: 'AI総合コメント', description: 'AI総合コメントが更新' },
        ],
      },
      {
        date: '2024-12-01T00:00:00Z',
        changes: [
          { category: '価値観', description: '価値観「挑戦志向」のスコアが7→8に上昇' },
          { category: '適職マッチ度', description: '適職マッチ度が再計算' },
        ],
      },
      {
        date: '2024-11-20T00:00:00Z',
        changes: [
          { category: '強み', description: '強み「創造的思考」が新たに発見' },
          { category: '適性職種', description: '適性職種に「プロデューサー」が追加' },
        ],
      },
    ],
    hasMore: true,
  },
};
```

---

## UI/UXデザイン仕様

### カラーパレット
```css
/* プライマリ */
--primary: #2563eb;           /* 青 */
--primary-light: #dbeafe;     /* 薄い青 */

/* アクセント */
--accent: #f97316;            /* オレンジ */
--accent-light: #ffedd5;      /* 薄いオレンジ */

/* セマンティック */
--success: #10b981;           /* 緑 */
--warning: #f59e0b;           /* 黄 */
--error: #ef4444;             /* 赤 */
--info: #3b82f6;              /* 青 */

/* グレースケール */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-700: #374151;
--gray-900: #111827;
```

### タイポグラフィ
- **見出し1**: `text-2xl font-bold` (24px, 700)
- **見出し2**: `text-xl font-bold` (20px, 700)
- **見出し3**: `text-lg font-bold` (18px, 700)
- **本文**: `text-base` (16px, 400)
- **小文字**: `text-sm` (14px, 400)

### スペーシング
- **カード間**: `space-y-6` (24px)
- **セクション間**: `space-y-8` (32px)
- **カード内余白**: `p-6` (24px)

### シャドウ
- **カード**: `shadow-sm` (軽いシャドウ)
- **ホバー**: `hover:shadow-md` (中程度のシャドウ)

### ボーダー半径
- **カード**: `rounded-2xl` (16px)
- **ボタン**: `rounded-lg` (8px)
- **バッジ**: `rounded-full` (完全な丸)

---

## 実装手順

### フェーズ1: 基盤構築（1時間）
1. ✅ 型定義ファイル作成 `types/profile.ts`
2. ✅ モックデータファイル作成 `data/mockProfileAnalysis.ts`
3. ✅ 共通コンポーネント作成
   - `components/profile/shared/ProgressBar.tsx`
   - `components/profile/shared/SliderBar.tsx`

### フェーズ2: 個別コンポーネント実装（3時間）
4. ✅ `CareerTypeCard.tsx` 作成
5. ✅ `SelfUnderstandingProgress.tsx` 作成
6. ✅ `StrengthsList.tsx` 作成（最も複雑）
7. ✅ `ValuesCompatibility.tsx` 作成
8. ✅ `CareerVision.tsx` 作成
9. ✅ `IndustryMatch.tsx` 作成
10. ✅ `AIComment.tsx` 作成
11. ✅ `UpdateHistory.tsx` 作成

### フェーズ3: 統合（1時間）
12. ✅ `AnalysisResults.tsx` 作成（統合コンポーネント）
13. ✅ `app/profile/page.tsx` に追加
14. ✅ レスポンシブ対応確認

### フェーズ4: 仕上げ（1時間）
15. ✅ スタイル調整
16. ✅ アニメーション追加
17. ✅ アクセシビリティ対応
18. ✅ 動作確認

**総所要時間**: 約6時間

---

## 技術的考慮事項

### パフォーマンス
- **コード分割**: 各コンポーネントは独立して遅延読み込み可能
- **メモ化**: 大きなリストは `useMemo` で最適化
- **仮想スクロール**: エピソードリストが長い場合は検討

### アクセシビリティ
- **セマンティックHTML**: `<section>`, `<article>` を適切に使用
- **ARIA属性**: プログレスバーに `role="progressbar"` 等
- **キーボード操作**: アコーディオンやボタンにフォーカス対応
- **カラーコントラスト**: WCAG AA基準遵守

### 将来の拡張性
- **API統合**: Props型はそのままでデータソースを切り替え可能
- **状態管理**: 必要に応じてZustand/Jotai導入
- **ページネーション**: 履歴やエピソードの無限スクロール対応
- **フィルタリング**: 強みや業界の絞り込み機能

### エラーハンドリング
- **データ欠損**: デフォルト値とフォールバック表示
- **日付フォーマット**: `date-fns` 等のライブラリ使用
- **型安全性**: 厳格な TypeScript 設定

### テスト戦略
- **ユニットテスト**: 各コンポーネントのスナップショット
- **統合テスト**: データフローの確認
- **E2Eテスト**: ユーザー操作シナリオ

---

## 実装コード例（サンプル）

### 共通コンポーネント: ProgressBar

```typescript
// components/profile/shared/ProgressBar.tsx
interface ProgressBarProps {
  value: number;      // 0-100
  color?: string;     // デフォルト: accent
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({
  value,
  color = 'bg-accent',
  showLabel = true,
  label
}: ProgressBarProps) {
  return (
    <div>
      {showLabel && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-bold text-gray-900">{label}</span>
          <span className="text-gray-700">{value}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
```

### 共通コンポーネント: SliderBar

```typescript
// components/profile/shared/SliderBar.tsx
interface SliderBarProps {
  score: number;        // 1-10
  leftLabel: string;
  rightLabel: string;
}

export default function SliderBar({ score, leftLabel, rightLabel }: SliderBarProps) {
  const position = ((score - 1) / 9) * 100; // 0-100%に変換

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="shrink-0 font-medium text-gray-700">{leftLabel}</span>
      <div className="relative flex-1">
        <div className="h-1 rounded-full bg-gray-200" />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `${position}%` }}
        />
      </div>
      <span className="shrink-0 font-medium text-gray-700">{rightLabel}</span>
      <span className="shrink-0 text-gray-500">({score}/10)</span>
    </div>
  );
}
```

---

## まとめ

この実装計画書に従うことで、以下が実現します：

✅ **8つの独立した分析結果コンポーネント**の体系的な実装
✅ **型安全なデータ構造**による保守性の高いコード
✅ **モバイルファースト**のレスポンシブデザイン
✅ **将来のAPI統合**を見据えた拡張可能な設計
✅ **約6時間**での段階的実装

次のステップ: この計画書を承認後、フェーズ1から順次実装を開始します。
