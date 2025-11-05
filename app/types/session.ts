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
  messages: Message[];
  insight: string;
  durationMinutes: number;
  topic?: SessionTopic;
}

export interface SessionStore {
  sessions: SessionRecord[];
  overallSummary: string;
}

export interface ActiveSession {
  id: string;
  startedAt: string;
  messages: Message[];
  topic: SessionTopic;
}

