# デプロイメントガイド

## 🎯 本番環境で会話履歴を保存するための設定手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com) にアクセスしてアカウント作成
2. 新しいプロジェクトを作成
3. プロジェクトのAPIキーを取得：
   - Settings → API → Project URL
   - Settings → API → service_role key (secret)

### 2. データベーススキーマの設定

Supabase SQL Editorで `supabase/schema.sql` の内容を実行：

```bash
# supabase/schema.sql の内容をコピーして、
# Supabase Dashboard → SQL Editor で実行
```

### 3. 環境変数の設定

#### ローカル開発用（.env.local）

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-...

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# NextAuth
AUTH_SECRET=（openssl rand -base64 32で生成）
AUTH_URL=http://localhost:3000

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

#### 本番環境用（Vercel）

Vercelダッシュボードで同じ環境変数を設定：
- Settings → Environment Variables
- AUTH_URLは本番ドメイン（例：`https://your-app.vercel.app`）に変更

### 4. Google OAuth認証情報の設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成
3. 「APIとサービス」→「認証情報」→「認証情報を作成」→「OAuthクライアントID」
4. アプリケーションの種類：ウェブアプリケーション
5. 承認済みのリダイレクトURIを追加：
   - 開発: `http://localhost:3000/api/auth/callback/google`
   - 本番: `https://your-domain.com/api/auth/callback/google`

### 5. セッション履歴機能の拡張（推奨）

現在のスキーマでは各モジュールに1セッションのみ保存可能です。
複数セッションを保存するには以下のマイグレーションを実行：

```sql
-- session_idカラムを追加して、複数セッション対応
ALTER TABLE interactive_module_progress
  DROP CONSTRAINT interactive_module_progress_user_id_module_id_key;

-- session_idを追加
ALTER TABLE interactive_module_progress
  ADD COLUMN IF NOT EXISTS session_id TEXT NOT NULL DEFAULT gen_random_uuid()::text;

-- 新しいUNIQUE制約を追加
ALTER TABLE interactive_module_progress
  ADD CONSTRAINT interactive_module_progress_user_session_unique
  UNIQUE(user_id, module_id, session_id);

-- session_idにインデックスを追加
CREATE INDEX IF NOT EXISTS idx_interactive_module_progress_session_id
  ON interactive_module_progress(session_id);
```

同様に`module_progress`テーブルにも適用：

```sql
ALTER TABLE module_progress
  DROP CONSTRAINT module_progress_user_id_module_id_key;

ALTER TABLE module_progress
  ADD COLUMN IF NOT EXISTS session_id TEXT NOT NULL DEFAULT gen_random_uuid()::text;

ALTER TABLE module_progress
  ADD CONSTRAINT module_progress_user_session_unique
  UNIQUE(user_id, module_id, session_id);

CREATE INDEX IF NOT EXISTS idx_module_progress_session_id
  ON module_progress(session_id);
```

### 6. Vercelへのデプロイ

```bash
# Vercel CLIのインストール（初回のみ）
npm i -g vercel

# デプロイ
vercel

# 本番環境へのデプロイ
vercel --prod
```

または、GitHubと連携して自動デプロイ：
1. Vercelダッシュボードで「New Project」
2. GitHubリポジトリをインポート
3. 環境変数を設定
4. Deploy

## 📊 データの確認

### ユーザーデータの確認方法

Supabase Dashboard → Table Editor で以下を確認：

- `users`: 登録ユーザー一覧
- `interactive_module_progress`: ゲームの進捗
- `module_progress`: チャット対話の履歴
- `value_snapshots`: 価値観分析データ

### データのエクスポート

```sql
-- 全ユーザーの対話履歴をエクスポート
SELECT
  u.email,
  mp.module_id,
  mp.session_id,
  mp.messages,
  mp.created_at
FROM module_progress mp
JOIN users u ON mp.user_id = u.id
ORDER BY mp.created_at DESC;
```

## 🔒 セキュリティ

- ✅ Row Level Security (RLS) 有効
- ✅ ユーザーは自分のデータのみアクセス可能
- ✅ service_role keyは環境変数で管理
- ⚠️ service_role keyは絶対にGitにコミットしない

## 🧪 動作確認

1. ローカルで開発サーバー起動: `npm run dev`
2. Google認証でログイン
3. モジュールを実行して対話
4. Supabaseダッシュボードでデータ保存を確認

## トラブルシューティング

### 認証エラーが出る場合
- Google OAuth設定のリダイレクトURIを確認
- AUTH_URLが正しいか確認
- AUTH_SECRETが設定されているか確認

### データが保存されない場合
- Supabaseの接続情報が正しいか確認
- SQLスキーマが実行されているか確認
- ブラウザのコンソールでエラーを確認
