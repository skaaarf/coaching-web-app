import { supabase } from './supabase';
import type { DBInteractiveModuleProgress, DBModuleProgress, StoredMessage } from './supabase';
import type { InteractiveState, Message } from '@/types';
import { ModuleProgress, UserInsights, InteractiveModuleProgress } from '@/types';
import { getVisitCount } from './anonymous-session';

const DEFAULT_SESSION_LIMIT = 10;
const SESSION_SUFFIX = '#session:';
const SESSION_FEATURE_ERROR_CODES = new Set(['42703', 'PGRST204']);
const envSessionHistory =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_SESSION_HISTORY === 'true';
let supabaseSupportsSessionHistory = envSessionHistory;
let hasLoggedSessionFallback = false;
type SupabaseErrorLike = { code?: string; message?: string };

const normalizeMessages = (rawMessages?: StoredMessage[] | null): Message[] => {
  if (!rawMessages) return [];
  return rawMessages.map((message) => ({
    ...message,
    timestamp: new Date(message.timestamp),
  }));
};

const serializeMessages = (messages: Message[]): StoredMessage[] =>
  messages.map((message) => ({
    ...message,
    timestamp:
      message.timestamp instanceof Date
        ? message.timestamp.toISOString()
        : new Date(message.timestamp).toISOString(),
  }));

const decodeModuleIdentifiers = (
  moduleIdValue: string,
  sessionIdValue?: string | null,
  fallbackSessionId?: string
) => {
  if (moduleIdValue.includes(SESSION_SUFFIX)) {
    const [baseId, suffix] = moduleIdValue.split(SESSION_SUFFIX);
    const decodedSessionId = suffix || sessionIdValue || fallbackSessionId || `session-${Date.now()}`;
    return { moduleId: baseId, sessionId: decodedSessionId };
  }
  return {
    moduleId: moduleIdValue,
    sessionId: sessionIdValue || fallbackSessionId || `session-${Date.now()}`,
  };
};

const encodeSessionModuleId = (moduleId: string, sessionId: string) =>
  `${moduleId}${SESSION_SUFFIX}${sessionId}`;

const mapModuleProgressRow = (item: DBModuleProgress): ModuleProgress => {
  const { moduleId, sessionId } = decodeModuleIdentifiers(item.module_id, item.session_id, item.id);
  return {
    moduleId,
    sessionId,
    messages: normalizeMessages(item.messages),
    createdAt: item.created_at ? new Date(item.created_at) : new Date(),
    lastUpdated: item.last_updated ? new Date(item.last_updated) : new Date(),
    completed: item.completed ?? false,
    insights: item.insights || [],
    userId: item.user_id,
    userEmail: item.user_email || undefined,
  };
};

const mapInteractiveProgressRow = (item: DBInteractiveModuleProgress): InteractiveModuleProgress => {
  const { moduleId, sessionId } = decodeModuleIdentifiers(item.module_id, item.session_id, item.id);
  return {
    moduleId,
    sessionId,
    data: (item.data as InteractiveState) || null,
    createdAt: item.created_at ? new Date(item.created_at) : new Date(),
    lastUpdated: item.last_updated ? new Date(item.last_updated) : new Date(),
    completed: item.completed ?? false,
    userId: item.user_id,
    userEmail: item.user_email || undefined,
  };
};

const isSessionFeatureError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;
  const err = error as SupabaseErrorLike;
  if (err.code && SESSION_FEATURE_ERROR_CODES.has(err.code)) return true;
  if (typeof err.message === 'string' && err.message.includes('session_id')) return true;
  return false;
};

async function withSessionSupport<T>(operation: () => Promise<T>, legacyOperation: () => Promise<T>): Promise<T> {
  if (!supabaseSupportsSessionHistory) {
    return legacyOperation();
  }

  try {
    return await operation();
  } catch (error: unknown) {
    if (isSessionFeatureError(error)) {
      supabaseSupportsSessionHistory = false;
      if (!hasLoggedSessionFallback) {
        console.warn('Supabase schema missing session_id columns. Falling back to single-session storage.');
        hasLoggedSessionFallback = true;
      }
      return legacyOperation();
    }
    throw error;
  }
}

async function legacyGetModuleProgress(userId: string, moduleId: string): Promise<ModuleProgress | null> {
  const { data, error } = await supabase
    .from('module_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  if (!data) return null;
  return mapModuleProgressRow(data as DBModuleProgress);
}

async function legacySaveModuleProgress(userId: string, moduleId: string, progress: ModuleProgress): Promise<void> {
  // Update latest snapshot
  const createdAtIso = progress.createdAt ? new Date(progress.createdAt).toISOString() : new Date().toISOString();
  const lastUpdatedIso = progress.lastUpdated ? new Date(progress.lastUpdated).toISOString() : new Date().toISOString();
  const visitCount = getVisitCount();

  const { error } = await supabase
    .from('module_progress')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        messages: serializeMessages(progress.messages),
        completed: progress.completed,
        insights: progress.insights || [],
        created_at: createdAtIso,
        last_updated: lastUpdatedIso,
        visit_count: visitCount,
      },
      {
        onConflict: 'user_id,module_id',
      }
    );

  if (error) throw error;

  // Store session history as separate rows using encoded module_id
  const sessionId = progress.sessionId || `session-${Date.now()}`;
  const encodedModuleId = encodeSessionModuleId(moduleId, sessionId);
  const { error: historyError } = await supabase
    .from('module_progress')
    .upsert(
      {
        user_id: userId,
        module_id: encodedModuleId,
        messages: serializeMessages(progress.messages),
        completed: progress.completed,
        insights: progress.insights || [],
        created_at: createdAtIso,
        last_updated: lastUpdatedIso,
        visit_count: visitCount,
      },
      {
        onConflict: 'user_id,module_id',
      }
    );

  if (historyError) throw historyError;
}

async function legacyGetModuleSessions(userId: string, moduleId: string, limit = DEFAULT_SESSION_LIMIT): Promise<ModuleProgress[]> {
  const { data, error } = await supabase
    .from('module_progress')
    .select('*')
    .eq('user_id', userId)
    .or(`module_id.eq.${moduleId},module_id.like.${moduleId}${SESSION_SUFFIX}%`)
    .order('last_updated', { ascending: false })
    .limit(limit);

  if (error) throw error;
  const typedData = (data || []) as DBModuleProgress[];
  return typedData
    .map(mapModuleProgressRow)
    .filter((item) => item.moduleId === moduleId);
}

async function legacyGetModuleSession(userId: string, moduleId: string, sessionId: string): Promise<ModuleProgress | null> {
  const encodedModuleId = encodeSessionModuleId(moduleId, sessionId);
  const { data, error } = await supabase
    .from('module_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', encodedModuleId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return legacyGetModuleProgress(userId, moduleId);
  return mapModuleProgressRow(data as DBModuleProgress);
}

async function legacyGetInteractiveModuleProgress(userId: string, moduleId: string): Promise<InteractiveModuleProgress | null> {
  const { data, error } = await supabase
    .from('interactive_module_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  if (!data) return null;
  return mapInteractiveProgressRow(data as DBInteractiveModuleProgress);
}

async function legacySaveInteractiveModuleProgress(userId: string, moduleId: string, progress: InteractiveModuleProgress): Promise<void> {
  const createdAtIso = progress.createdAt ? new Date(progress.createdAt).toISOString() : new Date().toISOString();
  const lastUpdatedIso = progress.lastUpdated ? new Date(progress.lastUpdated).toISOString() : new Date().toISOString();
  const visitCount = getVisitCount();

  const { error } = await supabase
    .from('interactive_module_progress')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        data: progress.data,
        completed: progress.completed,
        created_at: createdAtIso,
        last_updated: lastUpdatedIso,
        visit_count: visitCount,
      },
      {
        onConflict: 'user_id,module_id',
      }
    );

  if (error) throw error;

  const sessionId = progress.sessionId || `session-${Date.now()}`;
  const encodedModuleId = encodeSessionModuleId(moduleId, sessionId);
  const { error: historyError } = await supabase
    .from('interactive_module_progress')
    .upsert(
      {
        user_id: userId,
        module_id: encodedModuleId,
        data: progress.data,
        completed: progress.completed,
        created_at: createdAtIso,
        last_updated: lastUpdatedIso,
        visit_count: visitCount,
      },
      {
        onConflict: 'user_id,module_id',
      }
    );

  if (historyError) throw historyError;
}

async function legacyGetInteractiveModuleSessions(userId: string, moduleId: string, limit = DEFAULT_SESSION_LIMIT): Promise<InteractiveModuleProgress[]> {
  const { data, error } = await supabase
    .from('interactive_module_progress')
    .select('*')
    .eq('user_id', userId)
    .or(`module_id.eq.${moduleId},module_id.like.${moduleId}${SESSION_SUFFIX}%`)
    .order('last_updated', { ascending: false })
    .limit(limit);

  if (error) throw error;
  const typedData = (data || []) as DBInteractiveModuleProgress[];
  return typedData
    .map(mapInteractiveProgressRow)
    .filter((item) => item.moduleId === moduleId);
}

async function legacyGetInteractiveModuleSession(userId: string, moduleId: string, sessionId: string): Promise<InteractiveModuleProgress | null> {
  const encodedModuleId = encodeSessionModuleId(moduleId, sessionId);
  const { data, error } = await supabase
    .from('interactive_module_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', encodedModuleId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return legacyGetInteractiveModuleProgress(userId, moduleId);
  return mapInteractiveProgressRow(data as DBInteractiveModuleProgress);
}

// Module Progress functions
export async function getModuleProgress(userIdOrAnonymous: string, moduleId: string): Promise<ModuleProgress | null> {
  // 匿名セッションIDかユーザーIDかを判定
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  return withSessionSupport(
    async () => {
      let query = supabase
        .from('module_progress')
        .select('*');

      // ユーザーIDまたは匿名セッションIDでフィルタ
      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query
        .eq('module_id', moduleId)
        .order('last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapModuleProgressRow(data as DBModuleProgress);
    },
    () => legacyGetModuleProgress(userIdOrAnonymous, moduleId)
  );
}

export async function saveModuleProgress(userIdOrAnonymous: string, moduleId: string, progress: ModuleProgress): Promise<void> {
  const sessionId = progress.sessionId || `session-${Date.now()}`;
  const createdAt = progress.createdAt ? new Date(progress.createdAt) : new Date();
  const lastUpdated = progress.lastUpdated ? new Date(progress.lastUpdated) : new Date();
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');
  const visitCount = getVisitCount();

  return withSessionSupport(
    async () => {
      const { error } = await supabase
        .from('module_progress')
        .upsert(
          {
            user_id: isAnonymous ? null : userIdOrAnonymous,
            anonymous_session_id: isAnonymous ? userIdOrAnonymous : null,
            module_id: moduleId,
            session_id: sessionId,
            user_email: progress.userEmail || null,
            messages: serializeMessages(progress.messages),
            completed: progress.completed,
            insights: progress.insights || [],
            created_at: createdAt.toISOString(),
            last_updated: lastUpdated.toISOString(),
            visit_count: visitCount,
          },
          {
            onConflict: isAnonymous ? 'anonymous_session_id,module_id,session_id' : 'user_id,module_id,session_id',
          }
        );

      if (error) throw error;
    },
    () => legacySaveModuleProgress(userIdOrAnonymous, moduleId, progress)
  );
}

export async function getAllModuleProgress(userIdOrAnonymous: string): Promise<Record<string, ModuleProgress>> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  return withSessionSupport(
    async () => {
      let query = supabase
        .from('module_progress')
        .select('*');

      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query;

      if (error) throw error;

      const latestByModule: Record<string, ModuleProgress> = {};
      const typedData = (data || []) as DBModuleProgress[];

      typedData.forEach((item) => {
        const progress = mapModuleProgressRow(item);
        const existing = latestByModule[progress.moduleId];
        if (!existing || progress.lastUpdated > existing.lastUpdated) {
          latestByModule[progress.moduleId] = progress;
        }
      });

      return latestByModule;
    },
    async () => {
      let query = supabase
        .from('module_progress')
        .select('*');

      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query;

      if (error) throw error;
      const typedData = (data || []) as DBModuleProgress[];
      return typedData.reduce<Record<string, ModuleProgress>>((acc, item) => {
        if (item.module_id.includes(SESSION_SUFFIX)) {
          return acc;
        }
        const progress = mapModuleProgressRow(item);
        acc[progress.moduleId] = progress;
        return acc;
      }, {});
    }
  );
}

export async function getModuleSessions(userIdOrAnonymous: string, moduleId: string, limit = DEFAULT_SESSION_LIMIT): Promise<ModuleProgress[]> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  return withSessionSupport(
    async () => {
      let query = supabase
        .from('module_progress')
        .select('*');

      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query
        .eq('module_id', moduleId)
        .order('last_updated', { ascending: false })
        .limit(limit);

      if (error) throw error;
      const typedData = (data || []) as DBModuleProgress[];
      return typedData.map(mapModuleProgressRow);
    },
    () => legacyGetModuleSessions(userIdOrAnonymous, moduleId, limit)
  );
}

export async function getModuleSession(userIdOrAnonymous: string, moduleId: string, sessionId: string): Promise<ModuleProgress | null> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  return withSessionSupport(
    async () => {
      let query = supabase
        .from('module_progress')
        .select('*');

      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query
        .eq('module_id', moduleId)
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapModuleProgressRow(data as DBModuleProgress);
    },
    () => legacyGetModuleSession(userIdOrAnonymous, moduleId, sessionId)
  );
}

// Interactive Module Progress functions
export async function getInteractiveModuleProgress(userIdOrAnonymous: string, moduleId: string): Promise<InteractiveModuleProgress | null> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  return withSessionSupport(
    async () => {
      let query = supabase
        .from('interactive_module_progress')
        .select('*');

      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query
        .eq('module_id', moduleId)
        .order('last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapInteractiveProgressRow(data as DBInteractiveModuleProgress);
    },
    () => legacyGetInteractiveModuleProgress(userIdOrAnonymous, moduleId)
  );
}

export async function saveInteractiveModuleProgress(userIdOrAnonymous: string, moduleId: string, progress: InteractiveModuleProgress): Promise<void> {
  const sessionId = progress.sessionId || `session-${Date.now()}`;
  const createdAt = progress.createdAt ? new Date(progress.createdAt) : new Date();
  const lastUpdated = progress.lastUpdated ? new Date(progress.lastUpdated) : new Date();
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');
  const visitCount = getVisitCount();

  return withSessionSupport(
    async () => {
      const { error } = await supabase
        .from('interactive_module_progress')
        .upsert(
          {
            user_id: isAnonymous ? null : userIdOrAnonymous,
            anonymous_session_id: isAnonymous ? userIdOrAnonymous : null,
            module_id: moduleId,
            session_id: sessionId,
            user_email: progress.userEmail || null,
            data: progress.data,
            completed: progress.completed,
            created_at: createdAt.toISOString(),
            last_updated: lastUpdated.toISOString(),
            visit_count: visitCount,
          },
          {
            onConflict: isAnonymous ? 'anonymous_session_id,module_id,session_id' : 'user_id,module_id,session_id',
          }
        );

      if (error) throw error;
    },
    () => legacySaveInteractiveModuleProgress(userIdOrAnonymous, moduleId, progress)
  );
}

export async function getAllInteractiveModuleProgress(userIdOrAnonymous: string): Promise<Record<string, InteractiveModuleProgress>> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  return withSessionSupport(
    async () => {
      let query = supabase
        .from('interactive_module_progress')
        .select('*');

      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query;

      if (error) throw error;

      const latestByModule: Record<string, InteractiveModuleProgress> = {};
      const typedData = (data || []) as DBInteractiveModuleProgress[];

      typedData.forEach((item) => {
        const progress = mapInteractiveProgressRow(item);
        const existing = latestByModule[progress.moduleId];
        if (!existing || progress.lastUpdated > existing.lastUpdated) {
          latestByModule[progress.moduleId] = progress;
        }
      });

      return latestByModule;
    },
    async () => {
      let query = supabase
        .from('interactive_module_progress')
        .select('*');

      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query;

      if (error) throw error;
      const typedData = (data || []) as DBInteractiveModuleProgress[];
      return typedData.reduce<Record<string, InteractiveModuleProgress>>((acc, item) => {
        if (item.module_id.includes(SESSION_SUFFIX)) {
          return acc;
        }
        const progress = mapInteractiveProgressRow(item);
        acc[progress.moduleId] = progress;
        return acc;
      }, {});
    }
  );
}

export async function getInteractiveModuleSessions(userIdOrAnonymous: string, moduleId: string, limit = DEFAULT_SESSION_LIMIT): Promise<InteractiveModuleProgress[]> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  return withSessionSupport(
    async () => {
      let query = supabase
        .from('interactive_module_progress')
        .select('*');

      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query
        .eq('module_id', moduleId)
        .order('last_updated', { ascending: false })
        .limit(limit);

      if (error) throw error;
      const typedData = (data || []) as DBInteractiveModuleProgress[];
      return typedData.map(mapInteractiveProgressRow);
    },
    () => legacyGetInteractiveModuleSessions(userIdOrAnonymous, moduleId, limit)
  );
}

export async function getInteractiveModuleSession(userIdOrAnonymous: string, moduleId: string, sessionId: string): Promise<InteractiveModuleProgress | null> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  return withSessionSupport(
    async () => {
      let query = supabase
        .from('interactive_module_progress')
        .select('*');

      if (isAnonymous) {
        query = query.eq('anonymous_session_id', userIdOrAnonymous);
      } else {
        query = query.eq('user_id', userIdOrAnonymous);
      }

      const { data, error } = await query
        .eq('module_id', moduleId)
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapInteractiveProgressRow(data as DBInteractiveModuleProgress);
    },
    () => legacyGetInteractiveModuleSession(userIdOrAnonymous, moduleId, sessionId)
  );
}

// User Insights functions
export async function getUserInsights(userIdOrAnonymous: string): Promise<UserInsights | null> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  try {
    let query = supabase
      .from('user_insights')
      .select('*');

    if (isAnonymous) {
      query = query.eq('anonymous_session_id', userIdOrAnonymous);
    } else {
      query = query.eq('user_id', userIdOrAnonymous);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      careerThinking: data.career_thinking || [],
      currentConcerns: data.current_concerns || [],
      thoughtFlow: data.thought_flow || [],
      patterns: data.patterns || [],
      lastAnalyzed: new Date(data.last_analyzed)
    };
  } catch (error) {
    console.error('Error loading insights from Supabase:', error);
    return null;
  }
}

export async function saveUserInsights(userIdOrAnonymous: string, insights: UserInsights): Promise<void> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');
  const visitCount = getVisitCount();

  try {
    const { error } = await supabase
      .from('user_insights')
      .upsert({
        user_id: isAnonymous ? null : userIdOrAnonymous,
        anonymous_session_id: isAnonymous ? userIdOrAnonymous : null,
        career_thinking: insights.careerThinking,
        current_concerns: insights.currentConcerns,
        thought_flow: insights.thoughtFlow,
        patterns: insights.patterns,
        last_analyzed: new Date().toISOString(),
        visit_count: visitCount,
      }, {
        onConflict: isAnonymous ? 'anonymous_session_id' : 'user_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving insights to Supabase:', error);
    throw error;
  }
}

// Clear all user data
export async function clearAllData(userIdOrAnonymous: string): Promise<void> {
  const isAnonymous = userIdOrAnonymous.startsWith('anon_');

  try {
    if (isAnonymous) {
      await Promise.all([
        supabase.from('module_progress').delete().eq('anonymous_session_id', userIdOrAnonymous),
        supabase.from('interactive_module_progress').delete().eq('anonymous_session_id', userIdOrAnonymous),
        supabase.from('user_insights').delete().eq('anonymous_session_id', userIdOrAnonymous)
      ]);
    } else {
      await Promise.all([
        supabase.from('module_progress').delete().eq('user_id', userIdOrAnonymous),
        supabase.from('interactive_module_progress').delete().eq('user_id', userIdOrAnonymous),
        supabase.from('user_insights').delete().eq('user_id', userIdOrAnonymous)
      ]);
    }
  } catch (error) {
    console.error('Error clearing data from Supabase:', error);
    throw error;
  }
}
