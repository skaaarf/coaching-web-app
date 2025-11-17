/**
 * Anonymous Session Management
 * 未ログインユーザーのための匿名セッションID管理
 */

const ANONYMOUS_SESSION_KEY = 'coaching_anonymous_session_id';
const VISIT_COUNT_KEY = 'coaching_visit_count';

/**
 * 匿名セッションIDを生成
 * UUIDv4形式のランダムID
 */
function generateAnonymousSessionId(): string {
  return 'anon_' + crypto.randomUUID();
}

/**
 * 匿名セッションIDを取得または生成
 * ブラウザのlocalStorageに永続化
 */
export function getOrCreateAnonymousSessionId(): string {
  if (typeof window === 'undefined') {
    // サーバーサイドでは一時的なIDを返す
    return generateAnonymousSessionId();
  }

  try {
    // 既存のIDをチェック
    let sessionId = localStorage.getItem(ANONYMOUS_SESSION_KEY);

    if (!sessionId) {
      // 新規IDを生成して保存
      sessionId = generateAnonymousSessionId();
      localStorage.setItem(ANONYMOUS_SESSION_KEY, sessionId);
      console.log('✨ 新しい匿名セッションIDを生成:', sessionId);
    }

    return sessionId;
  } catch (error) {
    console.error('Failed to get/create anonymous session ID:', error);
    // エラー時は一時的なIDを返す
    return generateAnonymousSessionId();
  }
}

/**
 * 匿名セッションIDを取得（存在しない場合はnull）
 */
export function getAnonymousSessionId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(ANONYMOUS_SESSION_KEY);
  } catch (error) {
    console.error('Failed to get anonymous session ID:', error);
    return null;
  }
}

/**
 * 匿名セッションIDをクリア
 * ログイン後などに使用
 */
export function clearAnonymousSessionId(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(ANONYMOUS_SESSION_KEY);
    console.log('🗑️ 匿名セッションIDをクリア');
  } catch (error) {
    console.error('Failed to clear anonymous session ID:', error);
  }
}

/**
 * ユーザーIDまたは匿名セッションIDを取得
 * 優先順位: userId > anonymousSessionId
 */
export function getUserOrAnonymousId(userId?: string | null): string {
  if (userId) {
    return userId;
  }

  return getOrCreateAnonymousSessionId();
}

/**
 * IDが匿名セッションIDかどうかを判定
 */
export function isAnonymousSessionId(id: string): boolean {
  return id.startsWith('anon_');
}

/**
 * 訪問回数を取得
 */
export function getVisitCount(): number {
  if (typeof window === 'undefined') {
    return 1;
  }

  try {
    const count = localStorage.getItem(VISIT_COUNT_KEY);
    return count ? parseInt(count, 10) : 1;
  } catch (error) {
    console.error('Failed to get visit count:', error);
    return 1;
  }
}

/**
 * 訪問回数をインクリメント
 */
export function incrementVisitCount(): number {
  if (typeof window === 'undefined') {
    return 1;
  }

  try {
    const currentCount = getVisitCount();
    const newCount = currentCount + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(newCount));
    console.log('📊 訪問回数をインクリメント:', newCount);
    return newCount;
  } catch (error) {
    console.error('Failed to increment visit count:', error);
    return 1;
  }
}

/**
 * 訪問回数をリセット（ログイン後など）
 */
export function resetVisitCount(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(VISIT_COUNT_KEY);
    console.log('🗑️ 訪問回数をリセット');
  } catch (error) {
    console.error('Failed to reset visit count:', error);
  }
}
