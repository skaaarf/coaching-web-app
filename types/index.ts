// Core types for the coaching app

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  systemPrompt: string;
  estimatedTime: string;
  category: 'exploration' | 'decision' | 'planning' | 'reflection' | 'interactive';
  moduleType?: 'chat' | 'interactive';
}

export interface ModuleProgress {
  moduleId: string;
  sessionId: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
  completed: boolean;
  insights?: string[];
  userId?: string;
  userEmail?: string;
}

export interface UserInsights {
  careerThinking: string[];
  currentConcerns: string[];
  thoughtFlow: string[];
  patterns: string[];
  lastAnalyzed: Date;
}

// Interactive module types
export interface ValueBattleChoice {
  optionA: string;
  optionB: string;
  category: string;
  meritsA?: string[];
  demeritsA?: string[];
  meritsB?: string[];
  demeritsB?: string[];
}

export interface ValueBattleResult {
  [category: string]: number;
}

export interface LifePath {
  id: string;
  title: string;
  timeline: Array<{
    age: number;
    event: string;
  }>;
  aspects: string[];
}

export interface ScaleQuestion {
  id: number;
  question: string;
}

export interface BranchMapNode {
  label: string;
  description: string;
  tags?: string[];
  eventType?: string;
}

export type BranchMapPath = BranchMapNode[];

export type LifeSimulatorSelections = Record<string, string[]>;

export type ParentSelfScaleResponses = Record<string, number>;

export interface TimeMachineLetters {
  pastLetter: string;
  futureLetter: string;
}

export interface PersonaProfile {
  name: string;
  grade: string;
  tagline: string;
  description: string;
  values?: string[];
  concerns?: string[];
  quote?: string;
}

export interface CareerTimelineEntry {
  label: string;
  description: string;
  reason: string;
  episode?: string;
  learnings?: string;
}

export interface CareerInterview {
  question: string;
  answer: string;
}

export interface CareerProfile {
  id: string;
  name: string;
  kana: string;
  avatar: string;
  tags: string[];
  headline: string;
  summary: string;
  keywords: string[];
  introduction: string;
  quote: string;
  updatedAt: string;
  score: number;
  timeline: CareerTimelineEntry[];
  interview: CareerInterview[];
  lessons: string[];
}

// Life Reflection module types
export interface EraQuestion {
  id: string;
  text: string;
}

export interface EraResponse {
  questionId: string;
  response: string;
  timestamp: Date;
}

export interface Episode {
  id: string;
  title: string;          // タイトル
  age: string;            // 年齢/時期（数値文字列や「高校3年生」など）
  isCompleted: boolean;   // 対話完了フラグ
  messageCount: number;   // 対話メッセージ数
  conversationHistory: Message[]; // 対話履歴
  discoveries?: string[]; // 発見キーワード
}

export interface EraData {
  eraId: string;
  questionResponses: EraResponse[];
  satisfaction: number | null; // 1-10
  completed: boolean;
}

export interface TurningPoint {
  id: string;
  age: number;
  description: string;
  timestamp: Date;
}

export interface LifeReflectionData {
  userAge: number; // Current age selected
  eras: {
    elementary: EraData | null;
    middleschool: EraData | null;
    highschool: EraData | null;
    college: EraData | null;
    working: EraData | null;
  };
  turningPoints: TurningPoint[];
  // 問いごとの対話セッションIDを保持して、再開を簡単にする
  dialogueSessions?: Record<string, string>;
  // --- V2: エピソードベースの振り返り ---
  episodes?: Episode[];
  overallProgress?: number;
}


export type InteractiveModuleId =
  | 'value-battle'
  | 'life-simulator'
  | 'parent-self-scale'
  | 'time-machine'
  | 'branch-map'
  | 'persona-dictionary'
  | 'career-dictionary'
  | 'life-reflection'
  | 'es-builder';

export type InteractiveModuleDataMap = {
  'value-battle': ValueBattleResult;
  'life-simulator': LifeSimulatorSelections;
  'parent-self-scale': ParentSelfScaleResponses;
  'time-machine': TimeMachineLetters;
  'branch-map': BranchMapPath;
  'persona-dictionary': PersonaProfile;
  'career-dictionary': CareerProfile;
  'life-reflection': LifeReflectionData;
  'es-builder': EsBuilderData;
};

// ES Builder Types
export type EsStatus = 'not_started' | 'drafting' | 'needs_review' | 'done';

export interface EsAnswer {
  id: string;
  questionId: string;
  text: string;
  status: EsStatus;
  updatedAt: string;
}

export interface EsChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  draftContent?: string;
  suggestedShortcuts?: string[];
  timestamp: number;
}

export interface EsChatSession {
  id: string;
  questionId: string;
  messages: EsChatMessage[];
}

export interface EsQuestionTemplate {
  id: string;
  title: string;
  description: string;
  recommendedLength?: number;
}

export interface EsBuilderData {
  answers: Record<string, EsAnswer>;
  chatSessions: Record<string, EsChatSession>;
  customQuestions?: EsQuestionTemplate[];
}

export interface EsScoreResult {
  totalScore: number;
  criteriaScores: {
    structure: number;   // 構成
    specificity: number; // 具体性
    logic: number;       // 論理性
    uniqueness: number;  // 独自性
    readability: number; // 読みやすさ
  };
  goodPoints: string[];
  improvementPoints: string[];
  feedback: string;
}

export type InteractiveActivityData =
  | InteractiveModuleDataMap[keyof InteractiveModuleDataMap]
  | Record<string, unknown>;

export type InteractiveState =
  | { phase: 'activity'; activityData?: InteractiveActivityData }
  | { phase: 'result'; data: InteractiveActivityData }
  | { phase: 'dialogue'; data: InteractiveActivityData; messages: Message[] };

export interface InteractiveModuleProgress {
  moduleId: string;
  sessionId: string;
  data: InteractiveState | null;
  createdAt: Date;
  lastUpdated: Date;
  completed: boolean;
  userId?: string;
  userEmail?: string;
}

// Value snapshot types
export interface ValueAxes {
  money_vs_meaning: number;        // お金(0) ←→ やりがい(100)
  stability_vs_challenge: number;  // 安定(0) ←→ 挑戦(100)
  team_vs_solo: number;            // 人と(0) ←→ 一人で(100)
  specialist_vs_generalist: number;// 専門(0) ←→ 幅広(100)
  growth_vs_balance: number;       // 成長(0) ←→ バランス(100)
  corporate_vs_startup: number;    // 大企業(0) ←→ 起業(100)
  social_vs_self: number;          // 社会貢献(0) ←→ 自己実現(100)
}

export interface AxisReasoning {
  reason: string;
  confidence: number;
}

export interface ValueSnapshot {
  id: string;
  user_id: string;
  module_id?: string;
  axes: ValueAxes;
  reasoning: Record<keyof ValueAxes, AxisReasoning>;
  overall_confidence: number;
  created_at: Date;
  last_updated: Date;
}

export interface ValueChange {
  axis: keyof ValueAxes;
  previous: number;
  current: number;
  change: number;
}

// Self analysis result (values & strengths) generated from conversations
export interface SelfAnalysisItem {
  title: string;
  description: string;
  evidences: string[];
}

export interface SelfAnalysisResult {
  summary: string;
  values: SelfAnalysisItem[];
  strengths: SelfAnalysisItem[];
  completedEpisodeCount: number;
  totalDialogueCount: number;
  generatedAt: string;
}
