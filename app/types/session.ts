export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

export interface SessionTopic {
  id: string;
  title: string;
  description: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  updatedAt: string;
  messages: Message[];
  insight?: string;
  durationMinutes?: number;
  topic?: SessionTopic;
  lastSummaryMessageCount?: number;
  needsSummary?: boolean;
}

export interface SessionStore {
  sessions: SessionRecord[];
  overallSummary: string;
  tools: ToolUsage[];
}

export interface ActiveSession {
  id: string;
  startedAt: string;
  messages: Message[];
  topic: SessionTopic;
}

export interface ToolUsage {
  id: string;
  lastOpenedAt: string;
  openCount: number;
}

