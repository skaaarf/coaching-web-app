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

export type InteractiveModuleId =
  | 'value-battle'
  | 'life-simulator'
  | 'parent-self-scale'
  | 'time-machine'
  | 'branch-map'
  | 'persona-dictionary'
  | 'career-dictionary';

export type InteractiveModuleDataMap = {
  'value-battle': ValueBattleResult;
  'life-simulator': LifeSimulatorSelections;
  'parent-self-scale': ParentSelfScaleResponses;
  'time-machine': TimeMachineLetters;
  'branch-map': BranchMapPath;
  'persona-dictionary': PersonaProfile;
  'career-dictionary': CareerProfile;
};

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
