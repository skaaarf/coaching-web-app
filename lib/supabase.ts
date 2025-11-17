import { createClient } from '@supabase/supabase-js';
import type { AxisReasoning, InteractiveState, Message, ValueAxes } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create a dummy client if credentials are not available (for development without Supabase)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Database types
export type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string };

export interface DBModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  session_id?: string | null;
  user_email?: string | null;
  messages: StoredMessage[] | null;
  completed: boolean;
  insights: string[] | null;
  last_updated: string;
  created_at: string;
}

export interface DBInteractiveModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  session_id?: string | null;
  user_email?: string | null;
  data: InteractiveState | Record<string, unknown>;
  completed: boolean;
  last_updated: string;
  created_at: string;
}

export interface DBUserInsights {
  id: string;
  user_id: string;
  career_thinking: string[];
  current_concerns: string[];
  thought_flow: string[];
  patterns: string[];
  last_analyzed: string;
  created_at: string;
}

export interface DBValueSnapshot {
  id: string;
  user_id: string;
  module_id: string | null;
  money_vs_meaning: number;
  stability_vs_challenge: number;
  team_vs_solo: number;
  specialist_vs_generalist: number;
  growth_vs_balance: number;
  corporate_vs_startup: number;
  social_vs_self: number;
  reasoning: Record<keyof ValueAxes, AxisReasoning>;
  overall_confidence: number;
  created_at: string;
  last_updated: string;
}
