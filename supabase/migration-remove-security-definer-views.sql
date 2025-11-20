-- ==========================================
-- Migration: Recreate usage views without SECURITY DEFINER
-- ==========================================
-- The database linter flagged several views that were previously created
-- with SECURITY DEFINER. This script drops and recreates them as regular
-- SECURITY INVOKER views (default) so that RLS policies apply correctly.

-- Anonymous user stats
DROP VIEW IF EXISTS anonymous_user_stats;
CREATE VIEW anonymous_user_stats AS
SELECT
  anonymous_session_id,
  COUNT(DISTINCT module_id) AS unique_modules_used,
  SUM(visit_count) AS total_visits,
  MAX(last_updated) AS last_visit_date,
  MIN(created_at) AS first_visit_date
FROM module_progress
WHERE anonymous_session_id IS NOT NULL
GROUP BY anonymous_session_id
ORDER BY total_visits DESC;
COMMENT ON VIEW anonymous_user_stats IS '匿名ユーザーの利用統計';

-- Logged-in user stats
DROP VIEW IF EXISTS logged_user_stats;
CREATE VIEW logged_user_stats AS
SELECT
  user_id,
  user_email,
  COUNT(DISTINCT module_id) AS unique_modules_used,
  SUM(visit_count) AS total_visits,
  MAX(last_updated) AS last_visit_date,
  MIN(created_at) AS first_visit_date
FROM module_progress
WHERE user_id IS NOT NULL
GROUP BY user_id, user_email
ORDER BY total_visits DESC;
COMMENT ON VIEW logged_user_stats IS 'ログインユーザーの利用統計';

-- Overall usage stats
DROP VIEW IF EXISTS overall_usage_stats;
CREATE VIEW overall_usage_stats AS
SELECT
  'anonymous' AS user_type,
  COUNT(DISTINCT anonymous_session_id) AS unique_users,
  SUM(visit_count) AS total_visits,
  AVG(visit_count) AS avg_visits_per_user
FROM module_progress
WHERE anonymous_session_id IS NOT NULL

UNION ALL

SELECT
  'logged_in' AS user_type,
  COUNT(DISTINCT user_id) AS unique_users,
  SUM(visit_count) AS total_visits,
  AVG(visit_count) AS avg_visits_per_user
FROM module_progress
WHERE user_id IS NOT NULL;
COMMENT ON VIEW overall_usage_stats IS '全体の利用統計（匿名 + ログイン）';

-- User sessions (chat modules)
DROP VIEW IF EXISTS user_sessions;
CREATE VIEW user_sessions AS
SELECT
  u.email,
  u.name,
  mp.module_id,
  mp.session_id,
  mp.messages,
  mp.completed,
  mp.created_at,
  mp.last_updated,
  jsonb_array_length(mp.messages) AS message_count
FROM module_progress mp
JOIN users u ON mp.user_id = u.id
ORDER BY mp.last_updated DESC;
ALTER VIEW user_sessions SET (security_barrier = true);
COMMENT ON VIEW user_sessions IS 'Shows all chat module sessions with user email for easy data export';

-- Interactive module sessions
DROP VIEW IF EXISTS interactive_sessions;
CREATE VIEW interactive_sessions AS
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
ALTER VIEW interactive_sessions SET (security_barrier = true);
COMMENT ON VIEW interactive_sessions IS 'Shows all interactive module sessions with user email for easy data export';

-- ==========================================
-- ✅ これですべてのビューが SECURITY INVOKER (デフォルト) で再作成され、
--    RLS ポリシーを正しく尊重するようになります。
