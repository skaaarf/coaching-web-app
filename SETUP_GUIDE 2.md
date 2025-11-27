# セットアップガイド

このガイドでは、Supabaseとの接続を設定し、Google認証を有効にする手順を説明します。

## 前提条件

- Node.js 20以上がインストールされていること
- Supabaseアカウント（無料で作成可能）
- Google Cloud Platformアカウント

## 1. Supabaseのセットアップ

### 1.1 Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてログイン
2. 「New Project」をクリック
3. プロジェクト名、データベースパスワード、リージョンを設定
4. プロジェクトが作成されるまで待つ（数分かかります）

### 1.2 データベーススキーマの作成

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `/supabase/schema.sql`ファイルの内容をコピー
3. SQL Editorに貼り付けて実行

これにより、以下のテーブルが作成されます：
- `module_progress` - チャットモジュールの進捗
- `interactive_module_progress` - インタラクティブモジュールの進捗
- `user_insights` - ユーザーインサイト

### 1.3 Supabase認証情報の取得

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の情報をメモ：
   - **Project URL** → `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **警告**: `service_role`キーはサーバー側でのみ使用し、クライアント側で公開しないでください。

## 2. Supabaseでメール認証を有効化

### 2.1 認証プロバイダーの設定

1. Supabaseダッシュボードで「Authentication」→「Providers」を開く
2. **Email** プロバイダーをクリック
3. 以下を設定：
   - Enable Email provider: **ON**
   - Enable Email Confirmations: **OFF** (開発中はOFFを推奨)
4. Saveをクリック

### 2.2 リダイレクトURLの設定

1. Supabaseダッシュボードで「Authentication」→「URL Configuration」を開く
2. **Site URL** を設定：
   - ローカル開発: `http://localhost:3000`
   - 本番環境: `https://your-domain.com`
3. **Redirect URLs** に以下を追加：
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```

## 3. 環境変数の設定

### 3.1 .env.localファイルの作成

プロジェクトルートで`.env.local`ファイルを作成し、以下の内容を設定：

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Supabase（データベースとマジックリンク認証）
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Admin email
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com
```

## 4. アプリケーションの起動

### 4.1 依存関係のインストール

```bash
npm install
```

### 4.2 開発サーバーの起動

```bash
npm run dev
```

### 4.3 動作確認

1. http://localhost:3000 にアクセス
2. 「ログイン」ボタンをクリック
3. メールアドレスを入力
4. メールに届いたマジックリンクをクリック
5. ログイン成功後、以前のlocalStorageデータがSupabaseに自動的に移行されます

## 5. データの確認

### 5.1 Supabaseダッシュボードでデータを確認

1. Supabaseダッシュボードで「Table Editor」を開く
2. 各テーブル（`module_progress`, `interactive_module_progress`, `user_insights`）を確認
3. ユーザーのデータが保存されていることを確認

### 5.2 ブラウザのDevToolsで確認

```javascript
// Console で実行
localStorage.getItem('mikata-migration-completed') // "true"になっていればマイグレーション完了
```

## トラブルシューティング

### マジックリンクが届かない

- Supabaseの「Authentication」→「Providers」でEmailが有効になっているか確認
- スパムフォルダを確認
- Supabase Dashboardの「Logs」→「Auth」でエラーがないか確認
- 開発環境では、Supabaseのデフォルトメール送信に制限があるため、時間を置いて再試行

### ログインできない

- Supabaseのリダイレクト URL設定が正しいか確認
- `/auth/callback`ページが存在するか確認
- ブラウザのコンソールでエラーがないか確認

### データが保存されない

- Supabaseのテーブルが正しく作成されているか確認
- Row Level Security (RLS)ポリシーが正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### マイグレーションが実行されない

- ログインしているか確認（未ログインの場合はlocalStorageのみ使用）
- ブラウザのコンソールでマイグレーションログを確認
- localStorageにデータがあるか確認

## 本番環境へのデプロイ

### Vercelへのデプロイ

1. Vercelにプロジェクトをインポート
2. 環境変数を設定：
   - すべての`.env.local`の内容を追加
3. Supabaseで、本番環境のリダイレクトURLを追加：
   - Authentication → URL Configuration → Redirect URLs
   ```
   https://your-app.vercel.app/auth/callback
   ```
4. デプロイ実行

### 本番環境でのメール送信設定

開発環境ではSupabaseのデフォルトメールサービスに制限があるため、本番環境ではカスタムSMTPの設定を推奨：

1. Supabase Dashboard → Project Settings → Auth
2. SMTP Settings で以下を設定：
   - Enable Custom SMTP: ON
   - メール送信サービス（SendGrid、AWS SES、Resendなど）の認証情報を入力

## セキュリティに関する注意事項

- ✅ `NEXT_PUBLIC_*`で始まる環境変数のみクライアント側で公開される
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY`は絶対にクライアント側で使用しない
- ⚠️ `.env.local`ファイルをGitにコミットしない（`.gitignore`に含まれていることを確認）
- ✅ Row Level Security (RLS)が有効になっており、ユーザーは自分のデータのみアクセス可能

## サポート

問題が発生した場合は、以下を確認してください：

1. Supabaseのログ（Settings → Logs）
2. ブラウザのデベロッパーツールのコンソール
3. Next.jsのターミナル出力

それでも解決しない場合は、GitHubのIssuesで報告してください。
