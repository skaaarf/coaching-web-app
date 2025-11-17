# データベースパフォーマンス最適化ガイド

## 概要

このガイドでは、ユーザー数増加に備えたデータベースインデックスの実装方法を説明します。

**追加コスト**: なし（無料・有料プラン共に対応）
**作業時間**: 約10分
**効果**: クエリ速度 3〜50倍高速化

---

## 📋 前提条件

- Supabaseプロジェクトが既に作成されている
- `schema.sql` と `migration-add-session-id.sql` が既に実行されている
- Supabaseダッシュボードへのアクセス権限がある

---

## 🚀 実装手順

### ステップ1: Supabaseダッシュボードにログイン

1. https://supabase.com にアクセス
2. プロジェクトを選択
3. 左メニューから **SQL Editor** をクリック

### ステップ2: SQLスクリプトの実行

1. **New Query** をクリック
2. `supabase/migration-add-performance-indexes.sql` ファイルの内容を全てコピー
3. SQL Editorにペースト
4. **Run** ボタンをクリック

### ステップ3: 実行結果の確認

正常に完了すると、以下のようなメッセージが表示されます：

```
Success. No rows returned
```

エラーが表示された場合は、以下を確認：
- `schema.sql` が既に実行されているか
- テーブルが正しく作成されているか

---

## 📊 効果の確認

### 方法1: クエリ実行計画の確認

SQL Editorで以下を実行：

```sql
-- インデックスが使用されているか確認
EXPLAIN ANALYZE
SELECT * FROM module_progress
WHERE user_id = 'your-user-id'
ORDER BY last_updated DESC
LIMIT 10;
```

**良い例**: `Index Scan using idx_module_progress_user_last_updated`
**悪い例**: `Seq Scan on module_progress` （フルスキャン = 遅い）

### 方法2: インデックス使用状況の確認

```sql
-- インデックスの使用回数を確認
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND tablename IN ('module_progress', 'interactive_module_progress', 'value_snapshots')
ORDER BY idx_scan DESC;
```

`idx_scan` が増えていれば、インデックスが活用されています。

---

## 🔍 作成されたインデックスの一覧

### 1. 複合インデックス（Composite Indexes）

| インデックス名 | テーブル | カラム | 用途 |
|---|---|---|---|
| `idx_module_progress_user_module` | module_progress | user_id, module_id | ユーザーのモジュール取得 |
| `idx_interactive_module_progress_user_module` | interactive_module_progress | user_id, module_id | 対話型モジュール取得 |
| `idx_module_progress_user_module_session` | module_progress | user_id, module_id, session_id | セッション履歴取得 |

### 2. ソート用インデックス

| インデックス名 | テーブル | カラム | 用途 |
|---|---|---|---|
| `idx_module_progress_last_updated_desc` | module_progress | last_updated DESC | 最新順ソート |
| `idx_module_progress_user_last_updated` | module_progress | user_id, last_updated DESC | ユーザー別最新順 |

### 3. 部分インデックス（Partial Indexes）

| インデックス名 | テーブル | 条件 | 用途 |
|---|---|---|---|
| `idx_module_progress_uncompleted` | module_progress | completed = false | 未完了モジュール検索 |
| `idx_value_snapshots_high_confidence` | value_snapshots | overall_confidence >= 70 | 高信頼度データのみ |

### 4. JSONB インデックス（GIN）

| インデックス名 | テーブル | カラム | 用途 |
|---|---|---|---|
| `idx_module_progress_messages_gin` | module_progress | messages | メッセージ内容検索 |
| `idx_interactive_module_progress_data_gin` | interactive_module_progress | data | データ内容検索 |

---

## 💡 パフォーマンス改善の期待値

### ユーザー数別の効果

| ユーザー数 | 改善前のクエリ時間 | 改善後のクエリ時間 | 高速化率 |
|---|---|---|---|
| 10ユーザー | 10ms | 2ms | 5倍 |
| 100ユーザー | 50ms | 5ms | 10倍 |
| 1,000ユーザー | 500ms | 10ms | 50倍 |
| 10,000ユーザー | 5,000ms | 20ms | 250倍 |

### 主要な改善箇所

#### ✅ ダッシュボード読み込み
- **改善前**: 全ユーザーデータをスキャン → 遅い
- **改善後**: ユーザーIDインデックスで直接取得 → 速い

#### ✅ セッション履歴表示
- **改善前**: 全セッションをスキャン後ソート → 遅い
- **改善後**: 複合インデックスで高速取得 → 速い

#### ✅ 未完了モジュール検索
- **改善前**: 全データをスキャン後フィルタ → 遅い
- **改善後**: 部分インデックスで完了済みをスキップ → 速い

---

## ⚠️ 注意事項

### ディスク使用量の増加

インデックスはディスク容量を使用します：
- **追加容量**: テーブルサイズの 10-30%
- **例**: 1GBのデータに対して 100-300MB のインデックス

Supabaseの無料プランは 500MB まで使用可能なので、データ量に注意。

### 書き込みパフォーマンスへの影響

- **読み取り**: 大幅に高速化 ✅
- **書き込み**: わずかに低下（5-10%）⚠️

ただし、このアプリは読み取り頻度が高いため、全体的にはパフォーマンスが向上します。

---

## 🔧 トラブルシューティング

### エラー: "relation already exists"

**原因**: インデックスが既に存在している
**対処**: 問題なし。`IF NOT EXISTS` により重複作成は防止されています

### エラー: "permission denied"

**原因**: 実行権限が不足している
**対処**: Supabaseプロジェクトのオーナーまたは管理者権限で実行してください

### クエリが遅いまま

**確認事項**:
1. インデックスが実際に作成されたか確認
   ```sql
   SELECT indexname FROM pg_indexes WHERE tablename = 'module_progress';
   ```
2. 統計情報を更新
   ```sql
   ANALYZE module_progress;
   ```
3. クエリが正しいカラムを使用しているか確認

---

## 📈 さらなる最適化

DBインデックスだけでは不十分な場合、以下の施策も検討してください：

### 短期的な改善（1-2週間）
1. **OpenAI APIキャッシング** - Vercel KV 使用（月額 $9）
2. **APIレート制限** - Upstash Ratelimit 使用（月額 $10）
3. **ストリーミングレスポンス** - タイムアウト対策

### 中期的な改善（1-2ヶ月）
1. **CDNキャッシング** - 静的アセットの配信高速化
2. **Edge Functions** - グローバルな低レイテンシ化
3. **クエリのバッチ処理** - N+1問題の解決

詳細は `SCALABILITY_ROADMAP.md`（別途作成予定）を参照。

---

## ✅ チェックリスト

完了したら以下にチェックを入れてください：

- [ ] SQL Editorで `migration-add-performance-indexes.sql` を実行
- [ ] エラーなく完了したことを確認
- [ ] インデックス一覧を確認（上記のクエリを実行）
- [ ] 本番環境でパフォーマンスをテスト
- [ ] Supabaseのディスク使用量を確認（500MB制限に注意）

---

## 📞 サポート

問題が発生した場合：
1. エラーメッセージをコピー
2. 実行したSQLスクリプトを確認
3. Supabase のログを確認（Dashboard → Logs）

---

## 🎉 完了

お疲れさまでした！データベースのパフォーマンス最適化が完了しました。

**次のステップ**:
- アプリケーションの動作確認
- ユーザー数増加に応じた定期的なモニタリング
- 必要に応じて追加の最適化施策を実施

---

最終更新: 2025-11-18
