-- NextAuth tables (required by @auth/supabase-adapter)
-- Note: These tables are automatically managed by NextAuth

-- Users table (managed by NextAuth)
-- CREATE TABLE IF NOT EXISTS users (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   name text,
--   email text UNIQUE,
--   email_verified timestamp with time zone,
--   image text,
--   created_at timestamp with time zone DEFAULT now(),
--   updated_at timestamp with time zone DEFAULT now()
-- );

-- User progress and data tables

-- Module progress (chat-based modules)
CREATE TABLE IF NOT EXISTS module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed boolean DEFAULT false,
  insights text[] DEFAULT ARRAY[]::text[],
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Interactive module progress
CREATE TABLE IF NOT EXISTS interactive_module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed boolean DEFAULT false,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- User insights
CREATE TABLE IF NOT EXISTS user_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  career_thinking text[] DEFAULT ARRAY[]::text[],
  current_concerns text[] DEFAULT ARRAY[]::text[],
  thought_flow text[] DEFAULT ARRAY[]::text[],
  patterns text[] DEFAULT ARRAY[]::text[],
  last_analyzed timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

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

-- RLS Policies: Users can only access their own data

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

-- Triggers to auto-update last_updated
CREATE TRIGGER update_module_progress_updated_at
  BEFORE UPDATE ON module_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactive_module_progress_updated_at
  BEFORE UPDATE ON interactive_module_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
