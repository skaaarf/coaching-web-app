-- Migration: Add session_id support for multiple session history
-- This allows users to have multiple conversation sessions per module
-- Run this migration AFTER running schema.sql

-- ==========================================
-- 1. Update interactive_module_progress table
-- ==========================================

-- Drop the old unique constraint
ALTER TABLE interactive_module_progress
  DROP CONSTRAINT IF EXISTS interactive_module_progress_user_id_module_id_key;

-- Add session_id column
ALTER TABLE interactive_module_progress
  ADD COLUMN IF NOT EXISTS session_id TEXT NOT NULL DEFAULT gen_random_uuid()::text;

-- Add user_email for easier data export and analysis
ALTER TABLE interactive_module_progress
  ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Create new unique constraint with session_id
ALTER TABLE interactive_module_progress
  ADD CONSTRAINT interactive_module_progress_user_session_unique
  UNIQUE(user_id, module_id, session_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interactive_module_progress_session_id
  ON interactive_module_progress(session_id);

CREATE INDEX IF NOT EXISTS idx_interactive_module_progress_user_email
  ON interactive_module_progress(user_email);

-- ==========================================
-- 2. Update module_progress table
-- ==========================================

-- Drop the old unique constraint
ALTER TABLE module_progress
  DROP CONSTRAINT IF EXISTS module_progress_user_id_module_id_key;

-- Add session_id column
ALTER TABLE module_progress
  ADD COLUMN IF NOT EXISTS session_id TEXT NOT NULL DEFAULT gen_random_uuid()::text;

-- Add user_email for easier data export and analysis
ALTER TABLE module_progress
  ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Create new unique constraint with session_id
ALTER TABLE module_progress
  ADD CONSTRAINT module_progress_user_session_unique
  UNIQUE(user_id, module_id, session_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_module_progress_session_id
  ON module_progress(session_id);

CREATE INDEX IF NOT EXISTS idx_module_progress_user_email
  ON module_progress(user_email);

-- ==========================================
-- 3. Helper views for data analysis
-- ==========================================

-- View: All user sessions with email
CREATE OR REPLACE VIEW user_sessions AS
SELECT
  u.email,
  u.name,
  mp.module_id,
  mp.session_id,
  mp.messages,
  mp.completed,
  mp.created_at,
  mp.last_updated,
  jsonb_array_length(mp.messages) as message_count
FROM module_progress mp
JOIN users u ON mp.user_id = u.id
ORDER BY mp.last_updated DESC;

-- View: Interactive module sessions with email
CREATE OR REPLACE VIEW interactive_sessions AS
SELECT
  u.email,
  u.name,
  imp.module_id,
  imp.session_id,
  imp.data,
  imp.completed,
  imp.created_at,
  imp.last_updated
FROM interactive_module_progress imp
JOIN users u ON imp.user_id = u.id
ORDER BY imp.last_updated DESC;

-- ==========================================
-- 4. Function to get user's session history
-- ==========================================

CREATE OR REPLACE FUNCTION get_user_session_history(
  p_user_id UUID,
  p_module_id TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  module_id TEXT,
  session_id TEXT,
  messages JSONB,
  completed BOOLEAN,
  created_at TIMESTAMPTZ,
  last_updated TIMESTAMPTZ,
  message_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mp.module_id,
    mp.session_id,
    mp.messages,
    mp.completed,
    mp.created_at,
    mp.last_updated,
    jsonb_array_length(mp.messages)::INTEGER as message_count
  FROM module_progress mp
  WHERE mp.user_id = p_user_id
    AND (p_module_id IS NULL OR mp.module_id = p_module_id)
  ORDER BY mp.last_updated DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. Grant permissions on views
-- ==========================================

-- Users can only see their own data through these views
ALTER VIEW user_sessions SET (security_barrier = true);
ALTER VIEW interactive_sessions SET (security_barrier = true);

COMMENT ON VIEW user_sessions IS 'Shows all chat module sessions with user email for easy data export';
COMMENT ON VIEW interactive_sessions IS 'Shows all interactive module sessions with user email for easy data export';
COMMENT ON FUNCTION get_user_session_history IS 'Retrieves session history for a specific user, optionally filtered by module';
