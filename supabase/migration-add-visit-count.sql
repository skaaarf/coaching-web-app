-- ==========================================
-- Migration: Add Visit Count Tracking
-- ==========================================
-- 匿名ユーザーの訪問回数を記録する機能を追加

-- ==========================================
-- 1. visit_count カラムを追加
-- ==========================================

-- module_progress テーブル
ALTER TABLE module_progress
  ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 1;

-- interactive_module_progress テーブル
ALTER TABLE interactive_module_progress
  ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 1;

-- user_insights テーブル
ALTER TABLE user_insights
  ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 1;

-- ==========================================
-- 2. 統計情報の更新
-- ==========================================

ANALYZE module_progress;
ANALYZE interactive_module_progress;
ANALYZE user_insights;

-- ==========================================
-- 3. 訪問回数集計用のビュー
-- ==========================================

-- 匿名ユーザーの訪問統計
CREATE OR REPLACE VIEW anonymous_user_stats AS
SELECT
  anonymous_session_id,
  COUNT(DISTINCT module_id) as unique_modules_used,
  SUM(visit_count) as total_visits,
  MAX(last_updated) as last_visit_date,
  MIN(created_at) as first_visit_date
FROM module_progress
WHERE anonymous_session_id IS NOT NULL
GROUP BY anonymous_session_id
ORDER BY total_visits DESC;

-- ログインユーザーの訪問統計
CREATE OR REPLACE VIEW logged_user_stats AS
SELECT
  user_id,
  user_email,
  COUNT(DISTINCT module_id) as unique_modules_used,
  SUM(visit_count) as total_visits,
  MAX(last_updated) as last_visit_date,
  MIN(created_at) as first_visit_date
FROM module_progress
WHERE user_id IS NOT NULL
GROUP BY user_id, user_email
ORDER BY total_visits DESC;

-- 全体統計（匿名 + ログイン）
CREATE OR REPLACE VIEW overall_usage_stats AS
SELECT
  'anonymous' as user_type,
  COUNT(DISTINCT anonymous_session_id) as unique_users,
  SUM(visit_count) as total_visits,
  AVG(visit_count) as avg_visits_per_user
FROM module_progress
WHERE anonymous_session_id IS NOT NULL

UNION ALL

SELECT
  'logged_in' as user_type,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(visit_count) as total_visits,
  AVG(visit_count) as avg_visits_per_user
FROM module_progress
WHERE user_id IS NOT NULL;

-- ==========================================
-- 4. コメント追加
-- ==========================================

COMMENT ON COLUMN module_progress.visit_count IS '同じ匿名ID/ユーザーIDでの訪問回数';
COMMENT ON COLUMN interactive_module_progress.visit_count IS '同じ匿名ID/ユーザーIDでの訪問回数';
COMMENT ON COLUMN user_insights.visit_count IS '同じ匿名ID/ユーザーIDでの訪問回数';

COMMENT ON VIEW anonymous_user_stats IS '匿名ユーザーの利用統計';
COMMENT ON VIEW logged_user_stats IS 'ログインユーザーの利用統計';
COMMENT ON VIEW overall_usage_stats IS '全体の利用統計（匿名 + ログイン）';

-- ==========================================
-- 完了メッセージ
-- ==========================================
-- 訪問回数カウント機能の追加が完了しました！
--
-- 【追加内容】
-- ✅ visit_count カラム（デフォルト: 1）
-- ✅ 匿名ユーザー統計ビュー
-- ✅ ログインユーザー統計ビュー
-- ✅ 全体統計ビュー
--
-- 【使い方】
-- 1. フロントエンドで訪問回数をカウント
-- 2. Supabaseに保存時に visit_count を指定
--
-- 【統計の確認】
-- SELECT * FROM anonymous_user_stats;  -- 匿名ユーザー統計
-- SELECT * FROM logged_user_stats;     -- ログインユーザー統計
-- SELECT * FROM overall_usage_stats;   -- 全体統計
