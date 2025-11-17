/**
 * storage-supabase.ts の匿名ユーザー対応版
 * 既存のコードを置き換えるためのヘルパー関数
 */

/**
 * user_id または anonymous_session_id でフィルタするクエリビルダー
 */
export function filterByUserOrAnonymous(
  query: any,
  userIdOrAnonymous: string
): any {
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
export function createUpsertData(
  userIdOrAnonymous: string,
  baseData: Record<string, any>
): Record<string, any> {
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
