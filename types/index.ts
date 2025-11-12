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
  systemPrompt?: string;
  estimatedTime: string;
  category: 'exploration' | 'decision' | 'planning' | 'reflection' | 'interactive';
  moduleType?: 'chat' | 'interactive' | 'content';
}

export interface ModuleProgress {
  moduleId: string;
  sessionId: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
  completed: boolean;
  insights?: string[];
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

export interface InteractiveModuleProgress {
  moduleId: string;
  sessionId: string;
  data: any;
  createdAt: Date;
  lastUpdated: Date;
  completed: boolean;
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
