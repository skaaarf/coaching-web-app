// ========================================
// Profile Analysis Types
// マイページ分析結果の型定義
// ========================================

// ========================================
// 1. CareerTypeCard
// ========================================
export interface CareerTypeData {
  type: string;              // キャリアタイプ名
  description: string;       // 説明文
  anchors: string[];         // キャリア・アンカー
  strengths: string[];       // 主要な強み
  lastUpdated: string;       // 最終更新日 (ISO 8601)
}

// ========================================
// 2. SelfUnderstandingProgress
// ========================================
export interface ProgressCategory {
  name: string;              // カテゴリ名
  progress: number;          // 進捗率 0-100
  count?: number;            // 件数（任意）
  confidence?: number;       // 信頼度 1-5（任意）
}

export interface NextRecommendation {
  title: string;             // おすすめアクション
  description: string;       // 説明
  benefits: string[];        // 期待される効果
}

export interface SelfUnderstandingData {
  overallProgress: number;              // 全体の進捗率
  categories: ProgressCategory[];       // カテゴリ別進捗
  nextRecommendation: NextRecommendation; // 次のおすすめ
}

// ========================================
// 3. StrengthsList
// ========================================
export interface Episode {
  id: string;
  title: string;             // エピソードタイトル
  fullText?: string;         // 全文（任意）
  date?: string;             // 記録日（任意、ISO 8601）
}

export interface Strength {
  id: string;
  name: string;              // 強みの名前
  rating: number;            // 信頼度 1-5
  ratingText: string;        // 表示用テキスト "4.0/5.0"
  description: string;       // 説明文
  typicalBehaviors: string[]; // 典型行動
  episodes: Episode[];       // 根拠エピソード
  lastUpdated: string;       // 最終更新日 (ISO 8601)
  needsMoreEpisodes?: boolean; // エピソード不足警告
}

export interface StrengthsData {
  strengths: Strength[];
  totalCount: number;        // 強みの総数
}

// ========================================
// 4. ValuesCompatibility
// ========================================
export interface ValueItem {
  id: string;
  title: string;             // 価値観名
  score: number;             // スコア 1-10
  leftLabel: string;         // 左端ラベル
  rightLabel: string;        // 右端ラベル
  description: string;       // 説明文
  anchorRelation?: string[]; // 関連するキャリア・アンカー
}

export interface WorkStyleAxis {
  name: string;              // 軸名
  score: number;             // スコア 1-10
  leftLabel: string;         // 左端ラベル
  rightLabel: string;        // 右端ラベル
}

export interface ValuesCompatibilityData {
  values: ValueItem[];                    // 価値観リスト
  workStyleAxes: WorkStyleAxis[];         // 働き方の軸
  suitableEnvironments: string[];         // 合う環境
  unsuitableEnvironments: string[];       // 合わない環境
}

// ========================================
// 5. CareerVision
// ========================================
export interface AnchorScore {
  name: string;              // アンカー名
  score: number;             // スコア 1-10
  description: string;       // 説明
}

export interface CareerVisionData {
  coreAnchors: string[];            // コアアンカー（2つ）
  anchorRanking: AnchorScore[];     // アンカーランキング Top3
  opportunities: string[];          // 手放したくない機会
  challenges: string[];             // 苦手なこと
  vision3Years: string;             // 3年後の姿
  vision10Years: string;            // 10年後の姿
  skillsToGrow: string[];           // 伸ばしたいスキル
}

// ========================================
// 6. IndustryMatch
// ========================================
export interface IndustryMatchItem {
  rank: number;                     // 順位
  industry: string;                 // 業界名
  positions: string[];              // 想定職種
  matchScore: number;               // マッチ度 0-100
  matchReasons: string[];           // マッチ理由
  warnings?: string[];              // 注意点（任意）
  companies: string[];              // 代表企業
}

export interface IndustryMatchData {
  matches: IndustryMatchItem[];     // Top 3
}

// ========================================
// 7. AIComment
// ========================================
export interface AICommentData {
  summary: string;                  // 総評
  strengths: string[];              // 就活での強み
  warnings: string[];               // 注意すべきポイント
  downloadAvailable: boolean;       // PDF DL可否
  emailAvailable: boolean;          // メール送信可否
}

// ========================================
// 8. UpdateHistory
// ========================================
export interface UpdateHistoryChange {
  category: string;                 // カテゴリ
  description: string;              // 変更内容
}

export interface UpdateHistoryItem {
  date: string;                     // 日付 (ISO 8601)
  changes: UpdateHistoryChange[];   // 変更内容リスト
}

export interface UpdateHistoryData {
  history: UpdateHistoryItem[];     // 履歴リスト
  hasMore: boolean;                 // さらに履歴があるか
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
