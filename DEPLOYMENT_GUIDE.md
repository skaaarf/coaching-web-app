# デプロイメントガイド（Firebase移行後）

## 1. データ保護ポリシー

- ユーザーデータは Firebase Authentication + Firestore に保存
- Firestore ルールで `request.auth.uid == owner_id` を必須にしてユーザー分離を担保（デフォルトのルール更新を忘れずに）
- すべてのドキュメントに `owner_id` とタイムスタンプ（ISO文字列）が入るように実装済み

## 2. 本番環境セットアップ手順

1. Firebase Console でプロジェクト作成
2. Authentication → Sign-in method で「Email/Password」を有効化し、メールリンクを使用
3. Firestore を作成し、ルールを以下のように設定（例）:
   ```rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{collection=**}/{docId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.owner_id;
       }
     }
   }
   ```
   ※ 管理者用の読み取りは必要に応じて条件付きで許可してください。
4. `.env.production` などに Firebase クライアント/サービスアカウントの値を設定（Setup Guide 参照）
5. `npm install` を実行して依存関係を同期

## 3. 環境分離

- 本番・開発で Firebase プロジェクトを分け、環境変数で切り替え
- `NEXT_PUBLIC_FIREBASE_*` と `FIREBASE_*` をそれぞれのプロジェクト値に更新

## 4. Vercel デプロイ

1. Vercel プロジェクトを作成し、GitHub リポジトリと接続
2. Vercel の Environment Variables に `.env.local` と同じキーを登録
3. ビルドコマンド: `npm run build` / 出力ディレクトリ: `.next`
4. デプロイ後、`/api/health` で環境変数が揃っているか確認

## 5. 障害対応のヒント

- 認証系の 401 は Firebase ID トークンが送られているか確認（`user.getIdToken()` をヘッダーに付与）
- Firestore ルールで拒否された場合はコンソールの「ルールテスト」か `allow read, write` への一時緩和で原因を切り分け
- 依存関係更新後にビルドが失敗する場合は `npm install firebase-admin` を再実行
