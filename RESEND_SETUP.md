# Resendを使ったメール送信設定

マジックリンク認証のメール送信を、SupabaseのデフォルトからResendに変更する方法です。

## 📌 なぜResendを使うのか？

- ✅ **無料枠が大きい**: 月3,000通まで無料（Supabaseは1時間4通）
- ✅ **設定が簡単**: 5分で完了
- ✅ **信頼性が高い**: メールが確実に届く
- ✅ **開発者フレンドリー**: ダッシュボードで送信状況を確認できる

---

## 🚀 セットアップ手順

### 1. Resendアカウントの作成

1. [Resend](https://resend.com)にアクセス
2. 「Sign Up」をクリック
3. GitHubまたはGoogleアカウントで登録
4. 無料プラン（Free）を選択

### 2. APIキーの取得

1. Resendダッシュボードにログイン
2. **API Keys** をクリック
3. 「Create API Key」をクリック
4. 名前を入力（例: `coaching-app`）
5. **Full Access** を選択
6. 生成されたAPIキーをコピー（後で使う）

### 3. ドメインの設定（オプション）

**開発環境**: スキップしてOK（Resendのデフォルトドメインを使用）

**本番環境**: 独自ドメインを使う場合
1. Resend Dashboard → **Domains** → **Add Domain**
2. ドメイン名を入力（例: `yourdomain.com`）
3. DNSレコードを追加（Resendが表示する手順に従う）
4. 認証完了を待つ（通常数分）

---

## 🔧 Supabaseでの設定

### 1. Supabase DashboardでSMTP設定

1. [Supabase Dashboard](https://supabase.com)にログイン
2. プロジェクトを選択
3. **Project Settings** → **Auth** をクリック
4. **SMTP Settings** セクションまでスクロール
5. 以下を入力：

```
Enable Custom SMTP: ON

Sender email: noreply@yourdomain.com
（開発環境では onboarding@resend.dev でもOK）

Sender name: AI進路くん

Host: smtp.resend.com
Port: 465
Username: resend
Password: re_xxxxxxxxxxxxxxxxxx（ResendのAPIキー）

Encryption: SSL/TLS
```

6. **Save** をクリック

### 2. メールテンプレートのカスタマイズ（オプション）

1. Supabase Dashboard → **Authentication** → **Email Templates**
2. **Magic Link** を選択
3. テンプレートを編集（日本語化など）

例:
```html
<h2>ログインリンク</h2>
<p>以下のリンクをクリックしてログインしてください：</p>
<p><a href="{{ .ConfirmationURL }}">ログイン</a></p>
<p>このリンクは1時間有効です。</p>
```

4. **Save** をクリック

---

## ✅ 動作確認

### 1. ローカル環境でテスト

```bash
npm run dev
```

1. http://localhost:3000/login にアクセス
2. メールアドレスを入力
3. メールが届くか確認（Resendダッシュボードでも確認可能）
4. マジックリンクをクリックしてログイン

### 2. Resendダッシュボードで確認

1. Resend Dashboard → **Emails** をクリック
2. 送信されたメールの一覧が表示される
3. ステータスが「Delivered」になっていればOK

---

## 💰 料金プラン

### 開発・小規模運用（無料プラン）

```
月3,000通まで無料
↓
1日100通 = 1日100ユーザーがログインできる
↓
十分な容量
```

### 本番運用（Proプラン: $20/月 ≈ 3,000円）

```
月50,000通
↓
1日1,666通 = 1日1,666ユーザーがログインできる
↓
かなり余裕
```

**参考**:
- ユーザーは7日間ログイン状態が保持されるため、実際のメール送信は週1回程度
- 100人のアクティブユーザー = 月400通程度

---

## 🔒 セキュリティ

### APIキーの管理

**❌ やってはいけないこと**:
```bash
# .env.local をGitにコミット
git add .env.local  # 絶対ダメ！
```

**✅ 正しい方法**:
```bash
# .env.local に保存（.gitignoreに含まれている）
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Vercelの環境変数に設定
Vercel Dashboard → Settings → Environment Variables
```

---

## 📊 モニタリング

### Resendダッシュボードで確認できること

1. **送信状況**: 成功/失敗の数
2. **配信率**: メールが届いた割合
3. **エラーログ**: 失敗した理由
4. **送信履歴**: 誰に、いつ送ったか

---

## 🆚 Resend vs AWS SES 比較

| 項目 | Resend | AWS SES |
|------|--------|---------|
| **無料枠** | 3,000通/月 | 1,000通/月（EC2経由）|
| **料金** | $20/月で50,000通 | $0.10/1,000通 |
| **設定難易度** | 簡単（5分） | やや複雑（15分） |
| **ダッシュボード** | 使いやすい | 情報量多いが複雑 |
| **信頼性** | 高い | 非常に高い |
| **おすすめ** | スタートアップ向け | 大規模運用向け |

---

## ❓ FAQ

### Q: 無料プランでずっと使える？
**A**: はい。月3,000通以内なら永久無料です。

### Q: メールが届かない場合は？
**A**:
1. Resendダッシュボードでステータスを確認
2. スパムフォルダを確認
3. Supabase の SMTP設定が正しいか確認

### Q: ドメイン認証は必須？
**A**: 開発環境では不要。本番環境では推奨（信頼性向上）。

### Q: 複数のプロジェクトで使える？
**A**: はい。APIキーを分けて管理できます。

---

## 🎯 まとめ

✅ **Resendを使えば**:
- マジックリンクが確実に届く
- 月3,000通まで無料
- 設定が簡単（5分で完了）
- ダッシュボードで送信状況を確認できる

✅ **ユーザー体験**:
- ログイン後は7日間有効
- チャット・履歴保存は無制限
- メールが確実に届く

これで**安心して開発・運用**できます！
