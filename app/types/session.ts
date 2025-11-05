export interface Message {
  id: string;
  content: string;
  role: "user" | "coach";
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  question: string;
  createdAt: string;
  status: "active" | "completed";
  messages: Message[];
}

export type SessionFormData = {
  question: string;
};

