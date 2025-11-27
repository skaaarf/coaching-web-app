# セットアップガイド（Firebase版）

このガイドでは Firebase 認証と Firestore を使ったバックエンド接続の設定手順を説明します。

## 前提条件

- Node.js 20 以上
- Firebase プロジェクト（無料枠でOK）
- Google Cloud Platform アカウント（Google OAuthを使う場合）

## 1. Firebase プロジェクトの準備

1. [Firebase Console](https://console.firebase.google.com/)で新規プロジェクトを作成
2. 「Authentication」→「Sign-in method」で **Email/Password** を有効化し、`メールリンク（パスワードレス）` を選択
3. 「Firestore Database」でデータベースを作成（本番/テストどちらでも可）

## 2. クライアント用の設定値を取得

プロジェクト設定 → 「全般」タブ → 「マイアプリ」から Web App を追加し、以下の値をメモします。

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 3. サービスアカウントキーの発行（API用）

1. Firebase コンソールの「プロジェクトの設定」→「サービス アカウント」
2. 「新しい秘密鍵の生成」をクリックして JSON をダウンロード
3. JSON 内の以下を `.env.local` に設定  
   - `FIREBASE_PROJECT_ID`  
   - `FIREBASE_CLIENT_EMAIL`  
   - `FIREBASE_PRIVATE_KEY`（改行は `\n` に置き換えて一行で記述）

## 4. 環境変数の設定

`.env.local` をルートに作成し、少なくとも以下を設定してください（他のキーは README 参照）。

```bash
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Firebase client
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (サービスアカウント)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Admin email for dashboard access
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com
```

## 5. 動作確認

```bash
npm install   # firebase-admin を含む依存関係を取得
npm run dev
```

ブラウザで `http://localhost:3000/login` にアクセスし、メールリンク認証が動作するか確認してください。
