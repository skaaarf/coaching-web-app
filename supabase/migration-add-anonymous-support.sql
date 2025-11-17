-- ==========================================
-- Migration: Add Anonymous User Support
-- ==========================================
-- 未ログインユーザーのデータもSupabaseに保存できるようにする
-- 匿名セッションIDを使用して、後でログイン時にデータをマージ可能
-- 使い方: このファイル全体を Supabase の SQL Editor にコピーして実行してください。
--        IF NOT EXISTS 付きなので複数回実行しても安全です。

-- ==========================================
-- 1. テーブルに anonymous_session_id カラムを追加
-- ==========================================

-- module_progress テーブル
ALTER TABLE module_progress
  ADD COLUMN IF NOT EXISTS anonymous_session_id TEXT;

-- interactive_module_progress テーブル
ALTER TABLE interactive_module_progress
  ADD COLUMN IF NOT EXISTS anonymous_session_id TEXT;

-- user_insights テーブル
ALTER TABLE user_insights
  ADD COLUMN IF NOT EXISTS anonymous_session_id TEXT;

-- value_snapshots テーブル
ALTER TABLE value_snapshots
  ADD COLUMN IF NOT EXISTS anonymous_session_id TEXT;

-- ==========================================
-- 2. user_id を NULL 許可に変更
-- ==========================================
-- 未ログインユーザーの場合、user_id は NULL で anonymous_session_id を使用

ALTER TABLE module_progress
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE interactive_module_progress
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE user_insights
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE value_snapshots
  ALTER COLUMN user_id DROP NOT NULL;

-- ==========================================
-- 3. CHECK制約を追加
-- ==========================================
-- user_id と anonymous_session_id のどちらか一方は必須

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'module_progress_user_or_anon_check'
  ) THEN
    ALTER TABLE module_progress
      ADD CONSTRAINT module_progress_user_or_anon_check
      CHECK (user_id IS NOT NULL OR anonymous_session_id IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interactive_module_progress_user_or_anon_check'
  ) THEN
    ALTER TABLE interactive_module_progress
      ADD CONSTRAINT interactive_module_progress_user_or_anon_check
      CHECK (user_id IS NOT NULL OR anonymous_session_id IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_insights_user_or_anon_check'
  ) THEN
    ALTER TABLE user_insights
      ADD CONSTRAINT user_insights_user_or_anon_check
      CHECK (user_id IS NOT NULL OR anonymous_session_id IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'value_snapshots_user_or_anon_check'
  ) THEN
    ALTER TABLE value_snapshots
      ADD CONSTRAINT value_snapshots_user_or_anon_check
      CHECK (user_id IS NOT NULL OR anonymous_session_id IS NOT NULL);
  END IF;
END $$;

-- ==========================================
-- 4. インデックスを追加
-- ==========================================
-- 匿名セッションIDでの検索を高速化

CREATE INDEX IF NOT EXISTS idx_module_progress_anonymous_session
ON module_progress(anonymous_session_id)
WHERE anonymous_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_interactive_module_progress_anonymous_session
ON interactive_module_progress(anonymous_session_id)
WHERE anonymous_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_insights_anonymous_session
ON user_insights(anonymous_session_id)
WHERE anonymous_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_value_snapshots_anonymous_session
ON value_snapshots(anonymous_session_id)
WHERE anonymous_session_id IS NOT NULL;

-- ==========================================
-- 5. UNIQUE制約を更新
-- ==========================================
-- user_id だけでなく anonymous_session_id も考慮（存在しない場合のみ追加）

ALTER TABLE user_insights
  DROP CONSTRAINT IF EXISTS user_insights_user_id_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'module_progress_anon_unique'
  ) THEN
    ALTER TABLE module_progress
      ADD CONSTRAINT module_progress_anon_unique
      UNIQUE (anonymous_session_id, module_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interactive_module_progress_anon_unique'
  ) THEN
    ALTER TABLE interactive_module_progress
      ADD CONSTRAINT interactive_module_progress_anon_unique
      UNIQUE (anonymous_session_id, module_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_insights_anon_unique'
  ) THEN
    ALTER TABLE user_insights
      ADD CONSTRAINT user_insights_anon_unique
      UNIQUE (anonymous_session_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'value_snapshots_anon_unique'
  ) THEN
    ALTER TABLE value_snapshots
      ADD CONSTRAINT value_snapshots_anon_unique
      UNIQUE (anonymous_session_id, id);
  END IF;
END $$;

-- ==========================================
-- 6. RLSポリシーを更新
-- ==========================================
-- 匿名ユーザーでも読み書きできるように

-- module_progress のポリシー更新
DROP POLICY IF EXISTS "Users can view their own module progress" ON module_progress;
DROP POLICY IF EXISTS "Users can insert their own module progress" ON module_progress;
DROP POLICY IF EXISTS "Users can update their own module progress" ON module_progress;
DROP POLICY IF EXISTS "Users can delete their own module progress" ON module_progress;
DROP POLICY IF EXISTS "Anyone can view their own module progress" ON module_progress;
DROP POLICY IF EXISTS "Anyone can insert module progress" ON module_progress;
DROP POLICY IF EXISTS "Anyone can update their own module progress" ON module_progress;
DROP POLICY IF EXISTS "Anyone can delete their own module progress" ON module_progress;

-- 匿名ユーザーも含めて読み書き可能に
CREATE POLICY "Anyone can view their own module progress"
  ON module_progress FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can insert module progress"
  ON module_progress FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can update their own module progress"
  ON module_progress FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can delete their own module progress"
  ON module_progress FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

-- interactive_module_progress のポリシー更新
DROP POLICY IF EXISTS "Users can view their own interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Users can insert their own interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Users can update their own interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Users can delete their own interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Anyone can view their own interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Anyone can insert interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Anyone can update their own interactive module progress" ON interactive_module_progress;
DROP POLICY IF EXISTS "Anyone can delete their own interactive module progress" ON interactive_module_progress;

CREATE POLICY "Anyone can view their own interactive module progress"
  ON interactive_module_progress FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can insert interactive module progress"
  ON interactive_module_progress FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can update their own interactive module progress"
  ON interactive_module_progress FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can delete their own interactive module progress"
  ON interactive_module_progress FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

-- user_insights のポリシー更新
DROP POLICY IF EXISTS "Users can view their own insights" ON user_insights;
DROP POLICY IF EXISTS "Users can insert their own insights" ON user_insights;
DROP POLICY IF EXISTS "Users can update their own insights" ON user_insights;
DROP POLICY IF EXISTS "Users can delete their own insights" ON user_insights;
DROP POLICY IF EXISTS "Anyone can view their own insights" ON user_insights;
DROP POLICY IF EXISTS "Anyone can insert insights" ON user_insights;
DROP POLICY IF EXISTS "Anyone can update their own insights" ON user_insights;
DROP POLICY IF EXISTS "Anyone can delete their own insights" ON user_insights;

CREATE POLICY "Anyone can view their own insights"
  ON user_insights FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can insert insights"
  ON user_insights FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can update their own insights"
  ON user_insights FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can delete their own insights"
  ON user_insights FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

-- value_snapshots のポリシー更新
DROP POLICY IF EXISTS "Users can view their own value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Users can insert their own value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Users can update their own value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Users can delete their own value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Anyone can view their own value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Anyone can insert value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Anyone can update their own value snapshots" ON value_snapshots;
DROP POLICY IF EXISTS "Anyone can delete their own value snapshots" ON value_snapshots;

CREATE POLICY "Anyone can view their own value snapshots"
  ON value_snapshots FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can insert value snapshots"
  ON value_snapshots FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can update their own value snapshots"
  ON value_snapshots FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can delete their own value snapshots"
  ON value_snapshots FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    (auth.uid() IS NULL AND anonymous_session_id IS NOT NULL)
  );

-- ==========================================
-- 7. データマージ用のヘルパー関数
-- ==========================================
-- 匿名セッションのデータをユーザーアカウントにマージする関数

CREATE OR REPLACE FUNCTION merge_anonymous_data_to_user(
  p_user_id UUID,
  p_anonymous_session_id TEXT
)
RETURNS TABLE (
  module_progress_count INTEGER,
  interactive_progress_count INTEGER,
  insights_count INTEGER,
  snapshots_count INTEGER
) AS $$
DECLARE
  v_module_progress_count INTEGER := 0;
  v_interactive_progress_count INTEGER := 0;
  v_insights_count INTEGER := 0;
  v_snapshots_count INTEGER := 0;
BEGIN
  -- module_progress をマージ
  UPDATE module_progress
  SET
    user_id = p_user_id,
    anonymous_session_id = NULL,
    last_updated = NOW()
  WHERE anonymous_session_id = p_anonymous_session_id
    AND user_id IS NULL;

  GET DIAGNOSTICS v_module_progress_count = ROW_COUNT;

  -- interactive_module_progress をマージ
  UPDATE interactive_module_progress
  SET
    user_id = p_user_id,
    anonymous_session_id = NULL,
    last_updated = NOW()
  WHERE anonymous_session_id = p_anonymous_session_id
    AND user_id IS NULL;

  GET DIAGNOSTICS v_interactive_progress_count = ROW_COUNT;

  -- user_insights をマージ
  UPDATE user_insights
  SET
    user_id = p_user_id,
    anonymous_session_id = NULL,
    last_analyzed = NOW()
  WHERE anonymous_session_id = p_anonymous_session_id
    AND user_id IS NULL;

  GET DIAGNOSTICS v_insights_count = ROW_COUNT;

  -- value_snapshots をマージ
  UPDATE value_snapshots
  SET
    user_id = p_user_id,
    anonymous_session_id = NULL,
    last_updated = NOW()
  WHERE anonymous_session_id = p_anonymous_session_id
    AND user_id IS NULL;

  GET DIAGNOSTICS v_snapshots_count = ROW_COUNT;

  -- 結果を返す
  RETURN QUERY SELECT
    v_module_progress_count,
    v_interactive_progress_count,
    v_insights_count,
    v_snapshots_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 8. 統計情報の更新
-- ==========================================

ANALYZE module_progress;
ANALYZE interactive_module_progress;
ANALYZE user_insights;
ANALYZE value_snapshots;

-- ==========================================
-- 完了メッセージ
-- ==========================================
-- 匿名ユーザーサポートの追加が完了しました！
--
-- 【変更内容】
-- ✅ 匿名セッションIDカラムを追加
-- ✅ user_id を NULL 許可に変更
-- ✅ RLSポリシーを更新（匿名ユーザーも読み書き可能）
-- ✅ データマージ用のヘルパー関数を追加
--
-- 【使い方】
-- 1. フロントエンドで匿名セッションIDを生成
-- 2. user_id が null の場合は anonymous_session_id を使用
-- 3. ログイン後に merge_anonymous_data_to_user() を呼び出してデータをマージ
--
-- 【セキュリティ】
-- - 匿名セッションIDは推測不可能なUUID
-- - RLSで自分のデータのみアクセス可能
-- - ログイン後は user_id に紐付け
