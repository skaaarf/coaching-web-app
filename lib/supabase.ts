import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client if credentials are not available (for development without Supabase)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Database types
export interface DBModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  messages: any[];
  completed: boolean;
  insights: string[];
  last_updated: string;
  created_at: string;
}

export interface DBInteractiveModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  data: any;
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
  reasoning: any;
  overall_confidence: number;
  created_at: string;
  last_updated: string;
}
