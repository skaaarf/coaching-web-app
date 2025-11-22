'use client';

import { useEffect, useMemo, useState } from 'react';
import { LifeReflectionData, EraData } from '@/types';
import { LifeReflectionQuestionContext } from '@/types/lifeReflection';
import { ERAS, getEraById } from '@/lib/lifeReflectionData';

interface Props {
  initialData?: LifeReflectionData;
  onComplete: (data: LifeReflectionData) => void;
  onStartDialogue?: (context: LifeReflectionQuestionContext) => void;
}

const EMPTY_DATA: LifeReflectionData = {
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
};

const createEmptyEraData = (eraId: string): EraData => ({
  eraId,
  questionResponses: [],
  satisfaction: null,
  completed: false,
});

const normalizeLifeData = (data?: LifeReflectionData): LifeReflectionData => {
  const base: LifeReflectionData = {
    ...EMPTY_DATA,
    ...(data || {}),
    eras: {
      ...EMPTY_DATA.eras,
      ...(data?.eras || {}),
    },
    dialogueSessions: data?.dialogueSessions || {},
  };

  ERAS.forEach((era) => {
    const eraKey = era.id as keyof typeof base.eras;
    const existing = base.eras[eraKey];
    if (!existing) {
      base.eras[eraKey] = createEmptyEraData(era.id);
    } else {
      const ensuredResponses = existing.questionResponses || [];
      const completed = ensuredResponses.length >= era.questions.length;
      base.eras[eraKey] = {
        ...existing,
        eraId: existing.eraId || era.id,
        questionResponses: ensuredResponses,
        completed,
      };
    }
  });

  return base;
};

const getResponseText = (eraData: EraData | null, questionId: string) => {
  if (!eraData) return '';
  const found = eraData.questionResponses.find((r) => r.questionId === questionId);
  return found?.response || '';
};

export default function LifeReflection({ initialData, onComplete, onStartDialogue }: Props) {
  const [lifeData, setLifeData] = useState<LifeReflectionData>(() => normalizeLifeData(initialData));
  const [openEras, setOpenEras] = useState<Set<string>>(new Set([ERAS[0].id]));

  useEffect(() => {
    setLifeData(normalizeLifeData(initialData));
  }, [initialData]);

  const overall = useMemo(() => {
    const totalQuestions = ERAS.reduce((sum, era) => sum + era.questions.length, 0);
    const answered = ERAS.reduce((sum, era) => {
      const eraKey = era.id as keyof typeof lifeData.eras;
      const responses = lifeData.eras[eraKey]?.questionResponses || [];
      return sum + Math.min(responses.length, era.questions.length);
    }, 0);
    return { totalQuestions, answered, ratio: totalQuestions ? answered / totalQuestions : 0 };
  }, [lifeData]);

  const toggleEra = (eraId: string) => {
    setOpenEras((prev) => {
      const next = new Set(prev);
      if (next.has(eraId)) {
        next.delete(eraId);
      } else {
        next.add(eraId);
      }
      return next;
    });
  };

  const renderQuestion = (
    eraData: EraData | null,
    questionId: string,
    questionText: string,
    placeholder?: string
  ) => {
    const answeredText = getResponseText(eraData, questionId);
    const isAnswered = answeredText.trim().length > 0;
    return (
      <div key={questionId} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              isAnswered ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {isAnswered ? '✓' : '●'}
          </span>
          <p className="text-sm font-semibold text-gray-900">{questionText}</p>
        </div>
        {placeholder && <p className="text-xs text-gray-500 whitespace-pre-wrap">{placeholder}</p>}
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 whitespace-pre-wrap min-h-[60px]">
          {isAnswered ? answeredText : 'まだ入力がありません'}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              onStartDialogue?.({
                questionId,
                questionText,
                answer: answeredText,
              })
            }
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            💬 この質問で対話する
          </button>
        </div>
      </div>
    );
  };

  const renderEra = (eraId: string) => {
    const era = getEraById(eraId);
    if (!era) return null;
    const eraData = lifeData.eras[eraId as keyof typeof lifeData.eras];
    const answeredCount = eraData?.questionResponses.length || 0;
    const total = era.questions.length;
    const isOpen = openEras.has(eraId);
    return (
      <div key={eraId} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleEra(eraId)}
          className="w-full px-4 py-4 flex items-center justify-between text-left"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{era.emoji}</span>
              <p className="text-sm font-bold text-gray-900">{era.name}</p>
              <span className="text-[11px] text-gray-500">{answeredCount}/{total}完了</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{era.catchphrase}</p>
          </div>
          <div className={`transform transition ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {isOpen && (
          <div className="px-4 pb-4 space-y-3">
            {era.questions.map((q) =>
              renderQuestion(eraData || null, q.id, q.text, q.placeholder)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧭</span>
          <div>
            <p className="text-sm text-gray-500">気になった問いからどうぞ</p>
            <h2 className="text-xl font-bold text-gray-900">サクッと振り返る</h2>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          書き足す必要はありません。気になる質問を選んで、AIと話しながら整理してください。
        </p>
        <div className="pt-2 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>全体の進捗</span>
            <span>{overall.answered}/{overall.totalQuestions} 完了</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all"
              style={{ width: `${overall.ratio * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {ERAS.map((era) => renderEra(era.id))}
      </div>
    </div>
  );
}
