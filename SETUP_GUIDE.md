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

## 2. Google OAuthの設定

### 2.1 Google Cloud Consoleでプロジェクトを作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）

### 2.2 OAuth同意画面の設定

1. 「APIs & Services」→「OAuth consent screen」を開く
2. User Type: **External**を選択
3. アプリ名、サポートメールを入力
4. スコープ: デフォルトのままでOK
5. テストユーザー: 自分のGoogleアカウントを追加

### 2.3 OAuth認証情報の作成

1. 「APIs & Services」→「Credentials」を開く
2. 「Create Credentials」→「OAuth client ID」を選択
3. Application type: **Web application**を選択
4. 名前: 任意（例: "Coaching Web App"）
5. **Authorized redirect URIs**に以下を追加：
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.com/api/auth/callback/google
   ```
6. 作成後、**Client ID**と**Client Secret**をメモ

## 3. 環境変数の設定

### 3.1 .env.localファイルの作成

プロジェクトルートで`.env.local`ファイルを作成し、以下の内容を設定：

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
AUTH_SECRET=your_auth_secret_here
AUTH_URL=http://localhost:3000

# Supabase (Server-side)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Supabase (Client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3.2 AUTH_SECRETの生成

以下のコマンドでランダムなシークレットを生成：

```bash
openssl rand -base64 32
```

生成された文字列を`AUTH_SECRET`に設定してください。

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
2. 「Googleでログイン」ボタンをクリック
3. Googleアカウントで認証
4. ログイン成功後、以前のlocalStorageデータがSupabaseに自動的に移行されます

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

### ログインできない

- Google OAuth設定で、リダイレクトURIが正しく設定されているか確認
- `GOOGLE_CLIENT_ID`と`GOOGLE_CLIENT_SECRET`が正しいか確認
- `AUTH_SECRET`が設定されているか確認

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
   - `AUTH_URL`を本番環境のURLに変更（例: `https://your-app.vercel.app`）
3. Google Cloud Consoleで、本番環境のリダイレクトURIを追加：
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
4. デプロイ実行

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
