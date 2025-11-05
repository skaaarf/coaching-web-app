export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  messages: Message[];
  insight: string;
  durationMinutes: number;
}

export interface SessionStore {
  sessions: SessionRecord[];
  overallSummary: string;
}

export interface ActiveSession {
  id: string;
  startedAt: string;
  messages: Message[];
}

