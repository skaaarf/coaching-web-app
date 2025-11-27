import { useCallback, useEffect, useMemo, useState } from 'react';
import { Episode, InteractiveModuleProgress, ModuleProgress, SelfAnalysisResult } from '@/types';

type GenerateParams = {
  allProgress: Record<string, ModuleProgress>;
  allInteractiveProgress: Record<string, InteractiveModuleProgress>;
};

const CACHE_KEY = 'self-analysis-cache-v1';

function extractLifeReflectionEpisodes(progress: InteractiveModuleProgress | undefined): Episode[] {
  if (!progress?.data) return [];
  const state = progress.data as any;
  const activityData = state.phase === 'activity' ? state.activityData : state.data;
  const episodes = (activityData as { episodes?: Episode[] })?.episodes;
  if (!Array.isArray(episodes)) return [];
  return episodes;
}

export function useSelfAnalysis({ allProgress, allInteractiveProgress }: GenerateParams) {
  const [result, setResult] = useState<SelfAnalysisResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lifeReflectionProgress = allInteractiveProgress['life-reflection'];
  const episodes = useMemo(() => extractLifeReflectionEpisodes(lifeReflectionProgress), [lifeReflectionProgress]);

  const totalDialogues = useMemo(() => {
    const chatCount = Object.values(allProgress).reduce((sum, p) => sum + (p.messages?.length || 0), 0);
    const episodeCount = episodes.reduce((sum, ep) => sum + (ep.conversationHistory?.length || 0), 0);
    return chatCount + episodeCount;
  }, [allProgress, episodes]);

  // Load cache
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as SelfAnalysisResult;
        setResult(parsed);
      }
    } catch (err) {
      console.warn('Failed to read cached analysis', err);
    }
  }, []);

  const saveCache = useCallback((res: SelfAnalysisResult) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CACHE_KEY, JSON.stringify(res));
  }, []);

  const generate = useCallback(async () => {
    if (totalDialogues === 0) {
      setError('まだ対話データがありません。モジュールを1回試してください。');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const conversations = Object.values(allProgress)
        .filter(p => p.messages && p.messages.length > 0)
        .map(p => ({
          moduleId: p.moduleId,
          sessionId: p.sessionId,
          messages: p.messages,
        }));

      const completedEpisodes = episodes.filter(ep => ep.isCompleted || (ep.messageCount ?? 0) > 0);

      const payload = {
        conversations,
        episodes: completedEpisodes,
        completedEpisodeCount: completedEpisodes.length,
      };

      const res = await fetch('/api/self-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '分析に失敗しました');
      }

      const data = await res.json();
      const nextResult = data.result as SelfAnalysisResult;
      setResult(nextResult);
      saveCache(nextResult);
    } catch (err) {
      const message = err instanceof Error ? err.message : '分析に失敗しました';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  }, [allProgress, episodes, saveCache, totalDialogues]);

  // Auto-generate on first visit if data exists and未生成
  useEffect(() => {
    if (result || isGenerating || totalDialogues === 0) return;
    generate();
  }, [generate, isGenerating, result, totalDialogues]);

  const clearCache = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CACHE_KEY);
    setResult(null);
  }, []);

  return {
    result,
    isGenerating,
    error,
    generate,
    clearCache,
    totalDialogues,
  };
}
