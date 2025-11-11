import { supabase } from './supabase';
import { ModuleProgress, UserInsights, InteractiveModuleProgress } from '@/types';

// Module Progress functions
export async function getModuleProgress(userId: string, moduleId: string): Promise<ModuleProgress | null> {
  try {
    const { data, error } = await supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }

    return {
      moduleId: data.module_id,
      sessionId: data.session_id || `session-${Date.now()}`,
      messages: data.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })),
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      lastUpdated: new Date(data.last_updated),
      completed: data.completed,
      insights: data.insights || []
    };
  } catch (error) {
    console.error('Error loading module progress from Supabase:', error);
    return null;
  }
}

export async function saveModuleProgress(userId: string, moduleId: string, progress: ModuleProgress): Promise<void> {
  try {
    const { error } = await supabase
      .from('module_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        messages: progress.messages,
        completed: progress.completed,
        insights: progress.insights || [],
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving module progress to Supabase:', error);
    throw error;
  }
}

export async function getAllModuleProgress(userId: string): Promise<Record<string, ModuleProgress>> {
  try {
    const { data, error } = await supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const progressMap: Record<string, ModuleProgress> = {};

    data.forEach((item: any) => {
      progressMap[item.module_id] = {
        moduleId: item.module_id,
        sessionId: item.session_id || `session-${Date.now()}`,
        messages: item.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })),
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        lastUpdated: new Date(item.last_updated),
        completed: item.completed,
        insights: item.insights || []
      };
    });

    return progressMap;
  } catch (error) {
    console.error('Error loading all module progress from Supabase:', error);
    return {};
  }
}

// Interactive Module Progress functions
export async function getInteractiveModuleProgress(userId: string, moduleId: string): Promise<InteractiveModuleProgress | null> {
  try {
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

    return {
      moduleId: data.module_id,
      sessionId: data.session_id || `session-${Date.now()}`,
      data: data.data,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      lastUpdated: new Date(data.last_updated),
      completed: data.completed
    };
  } catch (error) {
    console.error('Error loading interactive module progress from Supabase:', error);
    return null;
  }
}

export async function saveInteractiveModuleProgress(userId: string, moduleId: string, progress: InteractiveModuleProgress): Promise<void> {
  try {
    const { error } = await supabase
      .from('interactive_module_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        data: progress.data,
        completed: progress.completed,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving interactive module progress to Supabase:', error);
    throw error;
  }
}

export async function getAllInteractiveModuleProgress(userId: string): Promise<Record<string, InteractiveModuleProgress>> {
  try {
    const { data, error } = await supabase
      .from('interactive_module_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const progressMap: Record<string, InteractiveModuleProgress> = {};

    data.forEach((item: any) => {
      progressMap[item.module_id] = {
        moduleId: item.module_id,
        sessionId: item.session_id || `session-${Date.now()}`,
        data: item.data,
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        lastUpdated: new Date(item.last_updated),
        completed: item.completed
      };
    });

    return progressMap;
  } catch (error) {
    console.error('Error loading all interactive module progress from Supabase:', error);
    return {};
  }
}

// User Insights functions
export async function getUserInsights(userId: string): Promise<UserInsights | null> {
  try {
    const { data, error } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', userId)
      .single();

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

export async function saveUserInsights(userId: string, insights: UserInsights): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_insights')
      .upsert({
        user_id: userId,
        career_thinking: insights.careerThinking,
        current_concerns: insights.currentConcerns,
        thought_flow: insights.thoughtFlow,
        patterns: insights.patterns,
        last_analyzed: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving insights to Supabase:', error);
    throw error;
  }
}

// Clear all user data
export async function clearAllData(userId: string): Promise<void> {
  try {
    await Promise.all([
      supabase.from('module_progress').delete().eq('user_id', userId),
      supabase.from('interactive_module_progress').delete().eq('user_id', userId),
      supabase.from('user_insights').delete().eq('user_id', userId)
    ]);
  } catch (error) {
    console.error('Error clearing data from Supabase:', error);
    throw error;
  }
}
