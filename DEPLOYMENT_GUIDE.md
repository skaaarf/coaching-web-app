# デプロイメントガイド

## 📖 目次

1. [データ保護の基本方針](#-データ保護の基本方針)
2. [本番環境で会話履歴を保存するための設定手順](#-本番環境で会話履歴を保存するための設定手順)
3. [環境分離戦略（本番・開発）](#-環境分離戦略本番開発)
4. [データベースマイグレーション](#-データベースマイグレーション)
5. [Vercelデプロイ戦略](#-vercelデプロイ戦略)
6. [緊急時の対応](#-緊急時の対応)

---

## 🛡️ データ保護の基本方針

### ✅ 現在実装されている保護機能

このアプリでは、**ユーザーの発言履歴は永続的に保存**されます：

- **永続化**: Supabaseクラウドデータベースに保存（localStorageではない）
- **ユーザー分離**: Row Level Security (RLS)で各ユーザーのデータを保護
- **タイムスタンプ**: 作成日時・更新日時を自動記録
- **外部キー制約**: データの整合性を保証

### 📦 ユーザーデータの保存場所

```
users テーブル（メールアドレスとuser_idを紐づけ）
├── module_progress (チャット履歴: messages jsonb)
├── interactive_module_progress (インタラクティブモジュールデータ)
├── value_snapshots (価値観スナップショット)
└── user_insights (ユーザーインサイト)
```

**重要ポイント**:
- ✅ アプリを更新しても、ユーザーデータは自動的に保持される
- ✅ ユーザーは次回ログイン時に続きから再開できる
- ✅ データはメールアドレス（user_id）に紐づいているため、どのデバイスからでもアクセス可能

---

## 🎯 本番環境で会話履歴を保存するための設定手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com) にアクセスしてアカウント作成
2. 新しいプロジェクトを作成
3. プロジェクトのAPIキーを取得：
   - Settings → API → Project URL
   - Settings → API → anon public key
   - Settings → API → service_role key (secret)

### 2. データベーススキーマの設定

Supabase SQL Editorで `supabase/schema.sql` の内容を実行：

```bash
# supabase/schema.sql の内容をコピーして、
# Supabase Dashboard → SQL Editor で実行
```

### 3. Supabaseでメール認証を有効化

1. Supabase Dashboard → Authentication → Providers
2. **Email** プロバイダーをクリック
3. 以下を設定：
   - Enable Email provider: **ON**
   - Enable Email Confirmations: **OFF** (開発中はOFFを推奨、本番ではONにして確認メールを送信)
4. Save

### 4. メール送信の設定（本番環境用）

**開発環境**: Supabaseのデフォルトメールサービスを使用（制限あり）

**本番環境**: カスタムSMTPを設定することを推奨
1. Supabase Dashboard → Project Settings → Auth
2. SMTP Settings セクションで設定：
   - Enable Custom SMTP: ON
   - Sender Email / Sender Name
   - Host, Port, Username, Password（SendGrid, AWS SES, Resend などのサービスを利用）

### 5. 環境変数の設定

#### ローカル開発用（.env.local）

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-...

# Supabase（データベースとマジックリンク認証）
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Admin email
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com
```

#### 本番環境用（Vercel）

Vercelダッシュボードで同じ環境変数を設定：
- Settings → Environment Variables
- 上記の値を入力

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

---

## 🔀 環境分離戦略（本番・開発）

### なぜ環境を分ける必要があるのか？

**本番環境で直接開発すると危険**：
- ❌ 実験中にユーザーデータを壊す可能性
- ❌ バグがそのままユーザーに影響する
- ❌ データベーススキーマ変更で既存データが消える可能性

### 推奨: 本番 + 開発環境の2環境構成

| 環境 | 用途 | データベース | ブランチ | URL例 |
|------|------|--------------|---------|-------|
| **本番** | 実際のユーザーが使用 | 本番用Supabase | `main` | `your-app.vercel.app` |
| **開発** | 新機能のテスト | 開発用Supabase | `development` | `your-app-git-dev.vercel.app` |

### セットアップ手順

#### 1. 開発用Supabaseプロジェクトを作成

1. [Supabase](https://supabase.com)で**新しいプロジェクト**を作成
   - プロジェクト名: `coaching-app-dev` など（開発用とわかる名前）
2. `/supabase/schema.sql`を実行してテーブルを作成
3. 開発用の認証情報を取得（後で環境変数に設定）

#### 2. Gitブランチ戦略

```bash
# メインブランチ（本番環境）
main

# 開発ブランチ（開発環境）
development

# 機能ブランチ（ローカル開発）
feature/new-feature
```

**開発フロー**：
```bash
# 1. 新機能開発開始
git checkout development
git checkout -b feature/awesome-feature

# 2. ローカルで開発・テスト
npm run dev

# 3. 開発ブランチにマージ
git checkout development
git merge feature/awesome-feature
git push origin development
# → Vercelが自動的にプレビュー環境にデプロイ

# 4. プレビュー環境でテスト（本番に影響なし）
# https://your-app-git-development-yourname.vercel.app

# 5. テスト完了後、本番にデプロイ
git checkout main
git merge development
git push origin main
# → 本番環境に自動デプロイ
```

#### 3. Vercelで環境変数を設定

Vercel Dashboard → Settings → Environment Variables で設定：

**本番環境用** (Environment: `Production`)
```bash
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
```

**開発環境用** (Environment: `Preview`)
```bash
SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_dev_anon_key
```

---

## 🔄 データベースマイグレーション

### アプリ更新時にユーザーデータを守る方法

アプリをバージョンアップする際、**データベーススキーマを変更しても既存データを壊さない**ための手順：

### ステップ1: マイグレーションファイルを作成

`/supabase/migrations/` フォルダに番号付きファイルを作成：

```sql
-- supabase/migrations/003_add_new_feature.sql

-- ✅ 既存データに影響しない変更
ALTER TABLE module_progress
ADD COLUMN IF NOT EXISTS new_field TEXT DEFAULT NULL;

-- ✅ 新しいテーブルを追加
CREATE TABLE IF NOT EXISTS new_feature_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ インデックスを追加
CREATE INDEX IF NOT EXISTS idx_new_feature_user_id ON new_feature_data(user_id);
```

### ステップ2: 安全なデプロイ手順

```bash
# 1. 開発環境でテスト
# Supabase (開発)のSQL Editorでマイグレーションを実行
# → エラーがないか、既存データが壊れないか確認

# 2. コードを開発ブランチにプッシュ
git push origin development
# → Vercelが自動的にプレビュー環境にデプロイ

# 3. プレビュー環境で動作確認
# → 新機能が正しく動作するか確認

# 4. 本番環境のデータベースにマイグレーション実行
# Supabase (本番)のSQL Editorでマイグレーションを実行

# 5. 本番環境にコードをデプロイ
git checkout main
git merge development
git push origin main
```

### ⚠️ 絶対にやってはいけないこと

```sql
-- ❌ カラムを削除（ユーザーデータが失われる）
ALTER TABLE module_progress DROP COLUMN messages;

-- ❌ テーブルを削除
DROP TABLE module_progress;

-- ❌ NOT NULL制約を追加（既存レコードがエラーになる）
ALTER TABLE module_progress ADD COLUMN required_field TEXT NOT NULL;
```

### ✅ 安全なスキーマ変更パターン

```sql
-- ✅ カラム追加（デフォルト値またはNULLを許可）
ALTER TABLE module_progress ADD COLUMN session_id TEXT DEFAULT NULL;

-- ✅ 新しいテーブル作成
CREATE TABLE IF NOT EXISTS new_feature (...);

-- ✅ インデックス追加（パフォーマンス向上、既存データに影響なし）
CREATE INDEX IF NOT EXISTS idx_name ON table_name(column);

-- ✅ カラム名変更は2段階で実施
-- Step 1: 新カラム追加 + データコピー
ALTER TABLE module_progress ADD COLUMN new_name TEXT;
UPDATE module_progress SET new_name = old_name;

-- Step 2: 次のバージョンで古いカラム削除
-- （ユーザーが新バージョンに移行完了後）
-- ALTER TABLE module_progress DROP COLUMN old_name;
```

---

## 🚀 Vercelデプロイ戦略

### 自動デプロイの設定

1. **Vercel Dashboard → Add New Project**
2. GitHubリポジトリをインポート
3. **Build Settings**:
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Root Directory: ./
   ```
4. **Git Configuration**:
   - Production Branch: `main`
   - Preview Branches: `development`, `feature/*`（すべてのブランチ）

### デプロイフロー

```
feature/xxx → ローカル開発
     ↓ マージ
development → プッシュ → Vercel自動デプロイ（Preview環境）
     ↓ テスト完了
  main → プッシュ → Vercel自動デプロイ（Production環境）
```

これにより：
- ✅ `main`ブランチにプッシュ = 本番環境に即デプロイ
- ✅ `development`ブランチにプッシュ = プレビュー環境でテスト可能
- ✅ 各ブランチに異なる環境変数（Supabase接続先）が適用される

---

## 🆘 緊急時の対応

### データベースバックアップ

Supabaseは自動バックアップを提供しますが、**重要な変更前は手動バックアップを推奨**：

1. Supabase Dashboard → Database → Backups
2. "Create backup" をクリック
3. 復元が必要な場合は "Restore" から選択

### ロールバック手順

#### アプリケーションコードのロールバック

```bash
# 方法1: 直前のコミットを取り消し
git revert HEAD
git push origin main

# 方法2: 特定のバージョンに戻す
git reset --hard <commit-hash>
git push origin main --force
```

Vercelが自動的に再デプロイします。

#### データベーススキーマのロールバック

```sql
-- 例: 追加したカラムを削除
ALTER TABLE module_progress DROP COLUMN IF EXISTS new_field;

-- 例: 追加したテーブルを削除
DROP TABLE IF EXISTS new_feature_data;
```

**注意**: データが失われる可能性があるため、バックアップから復元することを推奨します。

---

## 💡 よくある質問

### Q: 本番環境で直接開発してもいい？
**A**: ❌ **推奨しません**。本番データベースで実験するとユーザーデータが破損するリスクがあります。必ず開発環境でテストしてから本番にデプロイしてください。

### Q: ユーザーのデータは本当に消えない？
**A**: ✅ はい。Supabaseに保存されているため、アプリをアップデートしてもデータは保持されます。ただし、**スキーマ変更時に誤ってカラムやテーブルを削除しない**ように注意が必要です。

### Q: アプリをバージョンアップしても、ユーザーは続きから再開できる？
**A**: ✅ はい。`module_progress`テーブルの`messages`カラムにチャット履歴が保存されているため、ログインすれば続きから再開できます。

### Q: マイグレーション中にエラーが起きたら？
**A**:
1. すぐにロールバック（元のスキーマに戻す）
2. Supabaseの自動バックアップから復元
3. 開発環境で再度テストしてから実行

### Q: 環境変数を間違えて設定したら？
**A**: Vercelの Environment Variables で修正して、空コミットでプッシュすれば反映されます：
```bash
git commit --allow-empty -m "Redeploy"
git push
```

---

## 📋 まとめ

### ✅ ユーザーデータ保護のポイント

1. **データは既に永続化されている**: Supabaseのおかげで安全に保存
2. **環境を分離する**: 本番・開発環境を分けて安全にテスト
3. **マイグレーションは慎重に**: 常に開発環境でテスト → 本番の順
4. **自動デプロイを活用**: Vercelで`main`ブランチにプッシュするだけ

### 🎯 安全な開発フロー

```
ローカル開発 → development → プレビュー確認 → main → 本番デプロイ
```

このガイドに従えば、**ユーザーの発言履歴を守りながら安全にアプリを更新**できます。

---

## トラブルシューティング

### 認証エラーが出る場合
- Google OAuth設定のリダイレクトURIを確認
- AUTH_URLが正しいか確認
- AUTH_SECRETが設定されているか確認

### データが保存されない場合
- Supabaseの接続情報が正しいか確認
- SQLスキーマが実行されているか確認
- ブラウザのコンソールでエラーを確認

### プレビュー環境が動かない場合
- Vercelの環境変数でPreview用の設定を確認
- 開発用Supabaseの接続情報が正しいか確認
