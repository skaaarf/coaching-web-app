-- NextAuth tables (required by @auth/supabase-adapter)
-- These tables are required for NextAuth to work with Supabase

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  image TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

-- Add foreign keys only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'accounts_user_id_fkey'
  ) THEN
    ALTER TABLE accounts ADD CONSTRAINT accounts_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sessions_user_id_fkey'
  ) THEN
    ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- User progress and data tables

-- Module progress (chat-based modules)
CREATE TABLE IF NOT EXISTS module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed boolean DEFAULT false,
  insights text[] DEFAULT ARRAY[]::text[],
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Add foreign key for module_progress
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'module_progress_user_id_fkey'
  ) THEN
    ALTER TABLE module_progress ADD CONSTRAINT module_progress_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Interactive module progress
CREATE TABLE IF NOT EXISTS interactive_module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed boolean DEFAULT false,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Add foreign key for interactive_module_progress
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interactive_module_progress_user_id_fkey'
  ) THEN
    ALTER TABLE interactive_module_progress ADD CONSTRAINT interactive_module_progress_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- User insights
CREATE TABLE IF NOT EXISTS user_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  career_thinking text[] DEFAULT ARRAY[]::text[],
  current_concerns text[] DEFAULT ARRAY[]::text[],
  thought_flow text[] DEFAULT ARRAY[]::text[],
  patterns text[] DEFAULT ARRAY[]::text[],
  last_analyzed timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Add foreign key for user_insights
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_insights_user_id_fkey'
  ) THEN
    ALTER TABLE user_insights ADD CONSTRAINT user_insights_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_module_progress_user_id ON module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_module_id ON module_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_interactive_module_progress_user_id ON interactive_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_interactive_module_progress_module_id ON interactive_module_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_insights_user_id ON user_insights(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactive_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own module progress" ON module_progress;
DROP POLICY IF EXISTS "Users can insert their own module progress" ON module_progress;
DROP POLICY IF EXISTS "Users can update their own module progress" ON module_progress;
DROP POLICY IF EXISTS "Users can delete their own module progress" ON module_progress;

DROP POLICY IF EXISTS "Users can view their own interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Users can insert their own interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Users can update their own interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Users can delete their own interactive module progress" ON interactive_module_progress;

DROP POLICY IF EXISTS "Users can view their own insights" ON user_insights;
DROP POLICY IF EXISTS "Users can insert their own insights" ON user_insights;
DROP POLICY IF EXISTS "Users can update their own insights" ON user_insights;
DROP POLICY IF EXISTS "Users can delete their own insights" ON user_insights;

-- Create RLS Policies
-- Module progress policies
CREATE POLICY "Users can view their own module progress"
  ON module_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own module progress"
  ON module_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own module progress"
  ON module_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own module progress"
  ON module_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Interactive module progress policies
CREATE POLICY "Users can view their own interactive module progress"
  ON interactive_module_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactive module progress"
  ON interactive_module_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactive module progress"
  ON interactive_module_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactive module progress"
  ON interactive_module_progress FOR DELETE
  USING (auth.uid() = user_id);

-- User insights policies
CREATE POLICY "Users can view their own insights"
  ON user_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights"
  ON user_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
  ON user_insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
  ON user_insights FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update last_updated timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.last_updated = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_module_progress_updated_at ON module_progress;
DROP TRIGGER IF EXISTS update_interactive_module_progress_updated_at ON interactive_module_progress;

-- Create triggers to auto-update last_updated
CREATE TRIGGER update_module_progress_updated_at
  BEFORE UPDATE ON module_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactive_module_progress_updated_at
  BEFORE UPDATE ON interactive_module_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Value snapshots table for tracking user values over time
CREATE TABLE IF NOT EXISTS value_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_id TEXT, -- Link to the module/session where values were extracted

  -- 7 axes (0-100)
  money_vs_meaning INTEGER CHECK (money_vs_meaning BETWEEN 0 AND 100),
  stability_vs_challenge INTEGER CHECK (stability_vs_challenge BETWEEN 0 AND 100),
  team_vs_solo INTEGER CHECK (team_vs_solo BETWEEN 0 AND 100),
  specialist_vs_generalist INTEGER CHECK (specialist_vs_generalist BETWEEN 0 AND 100),
  growth_vs_balance INTEGER CHECK (growth_vs_balance BETWEEN 0 AND 100),
  corporate_vs_startup INTEGER CHECK (corporate_vs_startup BETWEEN 0 AND 100),
  social_vs_self INTEGER CHECK (social_vs_self BETWEEN 0 AND 100),

  -- Reasoning and confidence for each axis
  reasoning JSONB DEFAULT '{}'::jsonb,

  -- Overall confidence (lower if conversation is short)
  overall_confidence INTEGER CHECK (overall_confidence BETWEEN 0 AND 100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for value_snapshots
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'value_snapshots_user_id_fkey'
  ) THEN
    ALTER TABLE value_snapshots ADD CONSTRAINT value_snapshots_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_value_snapshots_user_id ON value_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_value_snapshots_module_id ON value_snapshots(module_id);
CREATE INDEX IF NOT EXISTS idx_value_snapshots_created_at ON value_snapshots(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE value_snapshots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Users can insert their own value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Users can update their own value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Users can delete their own value snapshots" ON value_snapshots;

-- Create RLS Policies
CREATE POLICY "Users can view their own value snapshots"
  ON value_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own value snapshots"
  ON value_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own value snapshots"
  ON value_snapshots FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own value snapshots"
  ON value_snapshots FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to auto-update last_updated
DROP TRIGGER IF EXISTS update_value_snapshots_updated_at ON value_snapshots;

CREATE TRIGGER update_value_snapshots_updated_at
  BEFORE UPDATE ON value_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
