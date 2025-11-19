/**
 * storage-supabase.ts の匿名ユーザー対応版
 * 既存のコードを置き換えるためのヘルパー関数
 */

type EqCapableQuery = {
  eq(column: string, value: unknown): EqCapableQuery;
};

/**
 * user_id または anonymous_session_id でフィルタするクエリビルダー
 */
export function filterByUserOrAnonymous(
  query: EqCapableQuery,
  userIdOrAnonymous: string
): EqCapableQuery {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  if (isAnonymous) {
    return query.eq('anonymous_session_id', userIdOrAnonymous);
  } else {
    return query.eq('user_id', userIdOrAnonymous);
  }
}

/**
 * upsert用のデータオブジェクトを生成
 */
export function createUpsertData<T extends Record<string, unknown>>(
  userIdOrAnonymous: string,
  baseData: T
): T & { user_id: string | null; anonymous_session_id: string | null } {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  return {
    ...baseData,
    user_id: isAnonymous ? null : userIdOrAnonymous,
    anonymous_session_id: isAnonymous ? userIdOrAnonymous : null,
  };
}

/**
 * onConflict文字列を生成
 */
export function getConflictConstraint(
  userIdOrAnonymous: string,
  additionalColumns: string[] = []
): string {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');
  const userColumn = isAnonymous ? 'anonymous_session_id' : 'user_id';

  return [userColumn, ...additionalColumns].join(',');
}
