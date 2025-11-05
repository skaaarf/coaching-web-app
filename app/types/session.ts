export type MessageRole = "user" | "coach";

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  createdAt: string;
}

export type SessionStatus = "in-progress" | "archived";
export type SessionKind = "talk" | "tool";

export interface Session {
  id: string;
  title: string;
  prompt: string;
  moduleId: string;
  moduleKind: SessionKind;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status: SessionStatus;
  messages: Message[];
  insight?: string;
}

export interface CoachingState {
  sessions: Session[];
  overallSummary: string;
}

export interface SessionFormData {
  topic: string;
  goal: string;
}
