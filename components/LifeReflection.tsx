'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { LifeReflectionData, Episode } from '@/types';

interface Props {
  initialData?: LifeReflectionData;
  onComplete: (data: LifeReflectionData) => void;
  onStartDialogue?: (context: { episodeId: string; title: string; age: string }) => void;
  isLoading?: boolean;
  onViewAnalysis?: () => void;
}

const EMPTY_BASE: LifeReflectionData = {
  userAge: 0,
  eras: {
    elementary: null,
    middleschool: null,
    highschool: null,
    college: null,
    working: null,
  },
  turningPoints: [],
  dialogueSessions: {},
  episodes: [],
  overallProgress: 0,
};

const createEpisode = (partial?: Partial<Episode>): Episode => ({
  id: `episode-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`,
  title: '',
  age: '',
  isCompleted: false,
  messageCount: 0,
  conversationHistory: [],
  ...partial,
});

const pickEpisodeIcon = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('文化祭') || t.includes('演劇') || t.includes('動画') || t.includes('漫才') || t.includes('映画')) return '🎬';
  if (t.includes('受験') || t.includes('試験') || t.includes('模試')) return '📚';
  if (t.includes('部活') || t.includes('サッカー') || t.includes('野球') || t.includes('バスケ') || t.includes('テニス')) return '⚽';
  if (t.includes('旅行') || t.includes('旅') || t.includes('留学')) return '✈️';
  if (t.includes('起業') || t.includes('ビジネス') || t.includes('スタートアップ')) return '💡';
  if (t.includes('インターン') || t.includes('アルバイト')) return '💼';
  if (t.includes('研究') || t.includes('論文')) return '🧪';
  return '⭐';
};

const describeDiscovery = (tag: string): string => {
  switch (tag) {
    case '創造性':
      return '創造性: 新しい表現やアイデアを形にする力';
    case 'リーダーシップ':
      return 'リーダーシップ: 人をまとめて進める力';
    case '継続力':
      return '継続力: 地道な努力を続ける粘り';
    case '挑戦心':
      return '挑戦心: 新しいことに踏み出す姿勢';
    case 'チームワーク':
      return 'チームワーク: 周りと協力して成果を出す力';
    case '粘り強さ':
      return '粘り強さ: 困難でも諦めずにやり切る力';
    case '表現力':
      return '表現力: 相手に伝わる形でアウトプットする力';
    default:
      return `${tag}: あなたらしさが出ています`;
  }
};

export default function LifeReflection({ initialData, onComplete, onStartDialogue, isLoading, onViewAnalysis }: Props) {
  const [step, setStep] = useState<'collect' | 'list'>('collect');
  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    if (initialData?.episodes && initialData.episodes.length > 0) return initialData.episodes;
    return [createEpisode(), createEpisode(), createEpisode()];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAge, setNewAge] = useState('');
  const [error, setError] = useState<string | null>(null);
  const hasMountedRef = useRef(false);
  const lastPersistedRef = useRef<string | null>(null);
  const prevCompletedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (initialData?.episodes && initialData.episodes.length > 0) {
      setEpisodes(initialData.episodes);
      setStep('list');
    }
  }, [initialData]);

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  const progress = useMemo(() => {
    const total = episodes.length;
    const completed = episodes.filter(e => e.isCompleted).length;
    return { total, completed, ratio: total ? completed / total : 0 };
  }, [episodes]);

  const sortedEpisodes = useMemo(
    () => [...episodes].sort((a, b) => Number(a.age || 0) - Number(b.age || 0)),
    [episodes]
  );

  const aggregateDiscoveries = useMemo(() => {
    const tags = new Set<string>();
    sortedEpisodes.forEach(ep => {
      if (ep.isCompleted && ep.discoveries) {
        ep.discoveries.forEach(tag => {
          if (tags.size < 5) tags.add(tag);
        });
      }
    });
    return Array.from(tags);
  }, [sortedEpisodes]);

  useEffect(() => {
    if (step !== 'list') return;
    const completedNow = new Set(sortedEpisodes.filter(e => e.isCompleted).map(e => e.id));
    prevCompletedRef.current = completedNow;
  }, [sortedEpisodes, step]);

  const updateEpisode = (id: string, patch: Partial<Episode>, _forcePersist?: boolean) => {
    setEpisodes(prev => prev.map(ep => (ep.id === id ? { ...ep, ...patch } : ep)));
  };

  const addEpisode = () => {
    setEpisodes(prev => [...prev, createEpisode()]);
  };

  const removeEpisode = (id: string) => {
    setEpisodes(prev => prev.filter(ep => ep.id !== id));
  };

  const canProceed = useMemo(() => {
    if (episodes.length < 3) return false;
    return episodes.every(ep => ep.title.trim().length > 0 && /^\d+$/.test(ep.age.trim()));
  }, [episodes]);

  const handleNext = () => {
    if (!canProceed) {
      setError('タイトルと年齢（半角数字）は必須です。');
      return;
    }
    setError(null);
    setStep('list');
  };

  const handleAddFromList = () => {
    const trimmedTitle = newTitle.trim();
    const trimmedAge = newAge.trim();
    if (!trimmedTitle || !trimmedAge) {
      setError('タイトルと年齢（半角数字）は必須です。');
      return;
    }
    if (!/^\d+$/.test(trimmedAge)) {
      setError('年齢/時期は半角数字で入力してください。');
      return;
    }
    setError(null);
    const next = [...episodes, createEpisode({ title: trimmedTitle, age: trimmedAge })];
    setEpisodes(next);
    setIsAdding(false);
    setNewTitle('');
    setNewAge('');
  };

  // Persist episodes to parent when in list step
  useEffect(() => {
    if (step !== 'list') return;
    if (!hasMountedRef.current) return;
    const snapshot = JSON.stringify(episodes);
    if (snapshot === lastPersistedRef.current) return;
    lastPersistedRef.current = snapshot;
    const data: LifeReflectionData = {
      ...EMPTY_BASE,
      episodes,
      overallProgress: episodes.length ? episodes.filter(e => e.isCompleted).length / episodes.length : 0,
    };
    onComplete(data);
  }, [episodes, step, onComplete]);

  const renderCollect = () => (
      <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧭</span>
          <div>
            <p className="text-sm text-gray-500">人生を振り返る</p>
            <h2 className="text-xl font-bold text-gray-900">重要なエピソードを集める</h2>
            <p className="text-sm text-gray-600 mt-2">
              あなたの人生を形作った3〜5個のエピソードを教えてください。タイトルと年齢/時期だけでOKです。
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {episodes.map((ep, index) => (
          <div key={ep.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">質問{index + 1}</span>
                {index < 3 && <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full">必須</span>}
              </div>
              {index >= 3 && (
                <button
                  type="button"
                  onClick={() => removeEpisode(ep.id)}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  削除
                </button>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">タイトル</label>
              <input
                value={ep.title}
                maxLength={50}
                onChange={(e) => updateEpisode(ep.id, { title: e.target.value })}
                placeholder={index === 0 ? '人生で一番本気で取り組んだことは？' : index === 1 ? '人生の転換点となった出来事は？' : '今のあなたを形作った経験は？'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">年齢/時期</label>
              <input
                value={ep.age}
                onChange={(e) => updateEpisode(ep.id, { age: e.target.value.replace(/\D/g, '') })}
                placeholder="例: 18"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addEpisode}
          disabled={episodes.length >= 5}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          ＋ エピソードを追加
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow hover:bg-blue-700 disabled:opacity-60"
        >
          次へ進む
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );

  const renderList = () => (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100 rounded-2xl shadow-sm p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎯</span>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-blue-500">人生を振り返ろう</p>
              <h2 className="text-xl font-bold text-gray-900">エピソードを深掘りして、強みを見つける</h2>
              <p className="text-sm text-gray-700 mt-2">
                エピソードを振り返ると、あなたの強み・価値観・可能性が見えてきます。完了すると詳しい自己分析結果を確認できます。
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-700">
                <span className="flex items-center gap-1">
                  <span className="text-lg">📊</span> 今すぐ分析結果を見る
                </span>
                {onViewAnalysis && (
                  <button
                    type="button"
                    onClick={onViewAnalysis}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-600 text-white px-3 py-1 font-semibold shadow hover:bg-blue-700 text-xs"
                  >
                    プレビュー
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="pt-1 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-700">
              <span>全体の進捗</span>
              <span>{progress.completed}/{progress.total} 完了</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all"
                style={{ width: `${progress.ratio * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <span className="tracking-[0.2em]">
                {'●'.repeat(progress.completed)}{'○'.repeat(Math.max(progress.total - progress.completed, 0))}
              </span>
              <span>あと{Math.max(progress.total - progress.completed, 0)}件で詳細分析</span>
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-white shadow-sm p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.25em] text-indigo-500">あなたについて分かってきたこと</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {aggregateDiscoveries.length > 0 ? (
                  aggregateDiscoveries.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                      ✨ {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">まだ発見はありません。最初のエピソードを振り返ってみよう。</span>
                )}
              </div>
              <p className="text-xs text-gray-700 mt-3">
                {progress.completed === 0 && `最初の発見をつかむには、エピソードを1つ振り返ってみましょう。`}
                {progress.completed === 1 && `最初の発見です！あと${Math.max(sortedEpisodes.length - progress.completed, 0)}つのエピソードを振り返りましょう。`}
                {progress.completed >= 2 && progress.completed <= 3 && `発見が集まってきました。あと${Math.max(sortedEpisodes.length - progress.completed, 0)}つで全体像が見えます。`}
                {progress.completed === 4 && 'もう少しです！最後の1つを振り返りましょう。'}
                {progress.completed >= 5 && 'あなたの全体像が見えました！🎉'}
              </p>
            </div>
          </div>
        </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600">
          エピソードは最大5件まで追加できます
        </div>

        <div className="flex items-center gap-2">
          {isAdding && (
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTitle('');
                setNewAge('');
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              キャンセル
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            disabled={episodes.length >= 5 || isAdding}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            ＋ エピソードを追加
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">新規</span>
            <p className="text-sm font-semibold text-gray-900">エピソードを追加</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">タイトル</label>
            <input
              value={newTitle}
              maxLength={50}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="例: インターンで新規企画をやりきった"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">年齢/時期</label>
            <input
              value={newAge}
              onChange={(e) => setNewAge(e.target.value.replace(/\D/g, ''))}
              placeholder="例: 18"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddFromList}
              disabled={!newTitle.trim() || !newAge.trim()}
              className="rounded-lg bg-blue-600 text-white text-sm font-semibold px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
            >
              追加する
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sortedEpisodes.map((ep) => {
          const icon = pickEpisodeIcon(ep.title || '');
          const ageLabel = ep.age ? `${ep.age}歳` : '年齢未入力';
          const fill = ep.isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200';
          const accent = ep.isCompleted ? 'text-emerald-700' : 'text-blue-600';
          const progressPct = Math.min(100, Math.max(0, Math.round((ep.messageCount || 0) / 10 * 100)));
          return (
            <div
              key={ep.id}
              className={`rounded-2xl border p-4 shadow-sm ${fill}`}
            >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                  <input
                    value={ep.title}
                    onChange={(e) => updateEpisode(ep.id, { title: e.target.value }, true)}
                    placeholder="タイトル未入力"
                    className="text-lg font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    value={ep.age}
                    onChange={(e) => updateEpisode(ep.id, { age: e.target.value.replace(/\D/g, '') }, true)}
                    placeholder="年齢（半角数字）"
                    className="text-xs font-semibold text-gray-600 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 w-32"
                  />
                </div>
                <div className="text-xs text-gray-600 mt-2 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl">{icon}</span>
                    <span className="font-semibold text-gray-800">{ageLabel}</span>
                    <span className={`${accent} font-semibold`}>{ep.isCompleted ? '完了 ✓' : '進行中'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 flex-wrap">
                    <span>💬 対話: {ep.messageCount || 0}往復</span>
                    <span>📝 振り返り度: {progressPct}%</span>
                  </div>
                  <div className="flex items-start gap-1 text-gray-700">
                    <span>✨</span>
                    <span className="text-xs">
                      {ep.isCompleted && ep.discoveries && ep.discoveries.length > 0
                        ? ep.discoveries.slice(0, 3).map(describeDiscovery).join(' / ')
                        : '---'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full ${ep.isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onStartDialogue?.({
                      episodeId: ep.id,
                      questionId: ep.id, // episodeベースの対話ではidを流用
                      questionText: ep.title || 'エピソード',
                      episodeTitle: ep.title || 'エピソード',
                      episodeAge: ep.age || '',
                      age: ep.age || '',
                      title: ep.title || 'エピソード',
                    } as any)
                  }
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow whitespace-nowrap ${ep.isCompleted ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <span>{ep.isCompleted ? '👀' : '💬'}</span>
                  <span>{ep.isCompleted ? '振り返りを見る' : '続きを振り返る'}</span>
                  <span aria-hidden className="text-xs">→</span>
                </button>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {step === 'collect' ? renderCollect() : renderList()}
    </div>
  );
}
