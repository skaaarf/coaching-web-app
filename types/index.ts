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
  category: 'exploration' | 'decision' | 'planning' | 'reflection';
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
