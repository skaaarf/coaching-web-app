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
  messages: Message[];
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
  data: any;
  lastUpdated: Date;
  completed: boolean;
}
