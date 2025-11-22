'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getModuleById } from '@/lib/modules';
import { useStorage } from '@/hooks/useStorage';
import {
  Message,
  ModuleProgress,
  InteractiveModuleProgress,
  ValueSnapshot,
  InteractiveState,
  InteractiveActivityData,
  ValueBattleResult,
  LifeSimulatorSelections,
  ParentSelfScaleResponses,
  TimeMachineLetters,
  CareerProfile,
  LifeReflectionData,
} from '@/types';
import ValueBattle from '@/components/ValueBattle';
import ValueBattleResultView from '@/components/ValueBattleResult';
import LifeSimulator from '@/components/LifeSimulator';
import LifeSimulatorResult from '@/components/LifeSimulatorResult';
import ParentSelfScale from '@/components/ParentSelfScale';
import ParentSelfScaleResult from '@/components/ParentSelfScaleResult';
import TimeMachine from '@/components/TimeMachine';
import CareerDictionary, { CareerDictionaryHandle } from '@/components/CareerDictionary';
import LifeReflection from '@/components/LifeReflection';
import LifeReflectionResult from '@/components/LifeReflectionResult';
import ChatInterface from '@/components/ChatInterface';
import ModuleResultSidebar from '@/components/ModuleResultSidebar';
import DialogueHistorySidebar from '@/components/DialogueHistorySidebar';
import AnalyzingAnimation from '@/components/AnalyzingAnimation';
import { LifeReflectionQuestionContext } from '@/types/lifeReflection';
import { getEraById } from '@/lib/lifeReflectionData';

const emptyLifeData: LifeReflectionData = {
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

const getLifeDataFromState = (
  state: InteractiveState,
  activityData?: InteractiveActivityData
): LifeReflectionData => {
  const candidate =
    (state.phase === 'activity' && state.activityData) ||
    (state.phase !== 'activity' && state.data) ||
    activityData;

  if (candidate && typeof candidate === 'object' && 'eras' in (candidate as any)) {
    return candidate as LifeReflectionData;
  }
  const localFallback =
    typeof window !== 'undefined'
      ? (() => {
          try {
            const raw = localStorage.getItem('mikata-life-reflection');
            if (raw) return JSON.parse(raw) as LifeReflectionData;
          } catch {
            /* ignore */
          }
          return null;
        })()
      : null;
  return localFallback || emptyLifeData;
};

const readLocalLifeReflection = (): LifeReflectionData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('mikata-life-reflection');
    if (!raw) return null;
    return JSON.parse(raw) as LifeReflectionData;
  } catch (error) {
    console.warn('Failed to read local life reflection', error);
    return null;
  }
};

export default function InteractiveModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const storage = useStorage();

  // Get sessionId and dialogueSessionId from URL query params
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const sessionId = searchParams?.get('sessionId') || undefined;
  const urlDialogueSessionId = searchParams?.get('dialogueSessionId') || undefined;

  const moduleDefinition = useMemo(() => getModuleById(moduleId), [moduleId]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(sessionId || '');
  const [dialogueSessionId, setDialogueSessionId] = useState<string>(''); // Separate session for dialogue phase
  const [state, setState] = useState<InteractiveState>({ phase: 'activity' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResultSidebar, setShowResultSidebar] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [allProgress, setAllProgress] = useState<Record<string, InteractiveModuleProgress>>({});

  // Value analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [lastAnalyzedMessageCount, setLastAnalyzedMessageCount] = useState(0);
  const careerDictionaryRef = useRef<CareerDictionaryHandle | null>(null);
  const [lifeQuestionId, setLifeQuestionId] = useState<string | null>(null);
  const [lifeQuestionText, setLifeQuestionText] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleDefinition || moduleDefinition.moduleType !== 'interactive') {
      router.push('/');
      return;
    }

    // Load saved progress
    const loadProgress = async () => {
      let progress: InteractiveModuleProgress | null = null;

      console.log('Loading interactive module, sessionId from URL:', sessionId);
      console.log('dialogueSessionId from URL:', urlDialogueSessionId);

      // If dialogueSessionId is provided, load that specific dialogue session
      if (urlDialogueSessionId) {
        const dialogueModuleId = `${moduleId}-dialogue`;
        const dialogueProgress = await storage.getModuleSession(dialogueModuleId, urlDialogueSessionId);

        if (dialogueProgress && dialogueProgress.messages) {
          console.log('Loaded dialogue session:', dialogueProgress);
          setDialogueSessionId(urlDialogueSessionId);
          setState({
            phase: 'dialogue',
            data: {}, // We don't have the original activity data, but that's okay
            messages: dialogueProgress.messages,
          });
          const allInteractiveProgress = await storage.getAllInteractiveModuleProgress();
          setAllProgress(allInteractiveProgress);
          setIsLoading(false);
          return;
        }
      }

      if (sessionId) {
        // Load specific session
        progress = await storage.getInteractiveModuleSession(moduleId, sessionId);
        console.log('Loaded session:', progress);
        setCurrentSessionId(sessionId);
        if (progress && progress.sessionId !== sessionId) {
          progress = null;
        }

        if (!progress && moduleId === 'life-reflection') {
          const fallback = readLocalLifeReflection();
          if (fallback) {
            console.log('Using local fallback for life-reflection (sessionId path)');
            setState({
              phase: 'activity',
              activityData: fallback,
            });
            setIsLoading(false);
            return;
          }
        }

        // If progress exists and has data, load it
        if (progress && progress.data) {
          const savedState = progress.data as InteractiveState;
          console.log('Saved state phase:', savedState.phase);

          // Special handling for life-reflection: ALWAYS start in activity phase (stage selection)
          // This ensures we behave like a game save (Mario world map), not resuming mid-dialogue
          if (moduleId === 'life-reflection') {
            console.log('Forcing activity phase for life-reflection');
            console.log('Saved state full object:', savedState);

            // Extract data correctly based on the saved phase
            // Check both activityData and data properties
            let savedData: any = null;

            if ('activityData' in savedState) {
              savedData = (savedState as any).activityData;
              console.log('Found data in activityData:', savedData);
            } else if ('data' in savedState) {
              savedData = (savedState as any).data;
              console.log('Found data in data:', savedData);
            }

            if (!savedData) {
              const fallback = readLocalLifeReflection();
              if (fallback) {
                console.log('Loaded fallback life reflection from local storage (sessionId path)');
                savedData = fallback;
              }
            }

            console.log('Final extracted savedData:', savedData);

            setState({
              phase: 'activity',
              // Use saved data if available, otherwise initialize empty
              activityData: savedData || emptyLifeData
            });
          }
          // Normal handling for other modules
          else if (savedState.phase === 'dialogue') {
            // Resume existing dialogue
            console.log('Resuming existing dialogue');
            setState({
              phase: 'dialogue',
              data: savedState.data,
              messages: savedState.messages,
            });

            // Find the dialogue session ID from the saved progress
            const dialogueModuleId = `${moduleId}-dialogue`;
            const allSessions = await storage.getModuleSessions(dialogueModuleId);
            if (allSessions.length > 0) {
              // Find the most recent dialogue session for this game
              const recentDialogue = allSessions[0];
              setDialogueSessionId(recentDialogue.sessionId);
            }
          } else {
            console.log('Restoring saved state:', savedState.phase);
            setState(savedState);
          }
        } else {
          // New session - start fresh
          console.log('New session, starting fresh');

          if (moduleId === 'life-reflection') {
            setState({
              phase: 'activity',
              activityData: emptyLifeData
            });
          } else {
            setState({ phase: 'activity' });
          }
        }
      } else {
        // No sessionId in URL - load latest session
        progress = await storage.getInteractiveModuleProgress(moduleId);
        if (progress) {
          const resolvedSessionId =
            progress.sessionId && progress.sessionId.trim().length > 0
              ? progress.sessionId
              : `session-${Date.now()}`;
          setCurrentSessionId(resolvedSessionId);

          if (!progress.sessionId || progress.sessionId.trim().length === 0) {
            progress = { ...progress, sessionId: resolvedSessionId };
          }

          if (progress.data) {
            const savedState = progress.data as InteractiveState;

            // Force activity for life-reflection
            if (moduleId === 'life-reflection') {
              console.log('Forcing activity phase for life-reflection (latest session)');
              console.log('Saved state full object:', savedState);

              // Extract data correctly based on the saved phase
              let savedData: any = null;

              if ('activityData' in savedState) {
                savedData = (savedState as any).activityData;
                console.log('Found data in activityData:', savedData);
              } else if ('data' in savedState) {
                savedData = (savedState as any).data;
                console.log('Found data in data:', savedData);
              }

              if (!savedData) {
                const fallback = readLocalLifeReflection();
                if (fallback) {
                  console.log('Loaded fallback life reflection from local storage (latest session)');
                  savedData = fallback;
                }
              }

              console.log('Final extracted savedData:', savedData);

              setState({
                phase: 'activity',
                activityData: savedData || emptyLifeData
              });
            } else {
              setState(savedState);
            }
            } else if (moduleId === 'life-reflection') {
              // Session exists but no data
              setState({
                phase: 'activity',
                activityData: emptyLifeData
              });
            }
        } else {
          if (moduleId === 'life-reflection') {
            const fallback = readLocalLifeReflection();
            if (fallback) {
              console.log('Using local fallback for life-reflection (no session)');
              setState({
                phase: 'activity',
                activityData: fallback,
              });
              setIsLoading(false);
              return;
            }
          }

          // No existing progress
          const newSessionId = `session-${Date.now()}`;
          setCurrentSessionId(newSessionId);

          if (moduleId === 'life-reflection') {
            setState({
              phase: 'activity',
              activityData: { eras: {}, graphPoints: [], turningPoints: [] }
            });
          } else {
            setState({ phase: 'activity' });
          }
        }
      }

      // Load all progress for history sidebar
      const allInteractiveProgress = await storage.getAllInteractiveModuleProgress();
      setAllProgress(allInteractiveProgress);
      setIsLoading(false);
    };

    loadProgress();
  }, [moduleDefinition, router, moduleId, storage, sessionId, urlDialogueSessionId]);

  const resolveSessionId = () => {
    if (currentSessionId && currentSessionId.trim().length > 0) {
      return currentSessionId;
    }
    const generatedId = `session-${Date.now()}`;
    setCurrentSessionId(generatedId);
    return generatedId;
  };

  const saveProgress = async (newState: InteractiveState, completed: boolean = false) => {
    console.log('=== saveProgress (Interactive) ===');
    console.log('moduleId:', moduleId);
    console.log('currentSessionId:', currentSessionId);
    console.log('newState:', newState);
    console.log('completed:', completed);

    const sessionIdToUse = resolveSessionId();

    const progress: InteractiveModuleProgress = {
      moduleId,
      sessionId: sessionIdToUse,
      data: newState,
      createdAt: new Date(), // Will be ignored if session already exists
      lastUpdated: new Date(),
      completed,
      userId: storage.userId || undefined,
      userEmail: storage.userEmail || undefined,
    };

    console.log('Saving progress:', progress);
    await storage.saveInteractiveModuleProgress(moduleId, progress);
    console.log('Progress saved');
  };

  const handleActivityComplete = (data: InteractiveActivityData) => {
    // Special handling for life-reflection: stay in activity phase
    if (moduleId === 'life-reflection') {
      const newState = { phase: 'activity' as const, activityData: data };
      setState(newState);
      saveProgress(newState);
    } else {
      const newState = { phase: 'result' as const, data };
      setState(newState);
      saveProgress(newState);
    }
  };

  const handleStartDialogue = async (dataOrQuestion?: InteractiveActivityData | string | LifeReflectionQuestionContext) => {
    const isLifeReflectionContext = typeof dataOrQuestion === 'object' && dataOrQuestion !== null && 'questionId' in (dataOrQuestion as any);
    const isQuestion = typeof dataOrQuestion === 'string' || isLifeReflectionContext;
    const initialQuestion = typeof dataOrQuestion === 'string'
      ? dataOrQuestion
      : isLifeReflectionContext
        ? `【質問】${(dataOrQuestion as LifeReflectionQuestionContext).questionText}\n\nメモ: ${(dataOrQuestion as LifeReflectionQuestionContext).answer || '未入力'}` 
        : undefined;
    let activityData: InteractiveActivityData | undefined =
      state.phase === 'result' || state.phase === 'dialogue'
        ? state.data
        : state.phase === 'activity'
          ? state.activityData
          : undefined;

    if (!isQuestion && dataOrQuestion && typeof dataOrQuestion !== 'string') {
      activityData = dataOrQuestion;
    }

    const currentLifeData =
      moduleId === 'life-reflection'
        ? getLifeDataFromState(state, activityData)
        : null;

    if (moduleId === 'life-reflection' && isLifeReflectionContext) {
      const ctx = dataOrQuestion as LifeReflectionQuestionContext;
      setLifeQuestionId(ctx.questionId);
      setLifeQuestionText(ctx.questionText);

      // 既存対話の復元を最優先
      const lifeData = currentLifeData || emptyLifeData;
      const knownSessionId = lifeData.dialogueSessions?.[ctx.questionId];
      const dialogueModuleId = `${moduleId}-dialogue-${ctx.questionId}`;
      if (knownSessionId) {
        const savedChat = await storage.getModuleSession(dialogueModuleId, knownSessionId);
        if (savedChat?.messages?.length) {
          setDialogueSessionId(knownSessionId);
          setState({
            phase: 'dialogue',
            data: lifeData,
            messages: savedChat.messages,
          });
          return;
        }
      }

      // 既存セッションIDが無くても、最新の同質問セッションがあれば復元
      const sessions = await storage.getModuleSessions(dialogueModuleId);
      if (sessions.length > 0) {
        const latest = sessions[0];
        if (latest.messages?.length) {
          setDialogueSessionId(latest.sessionId);
          setState({
            phase: 'dialogue',
            data: lifeData,
            messages: latest.messages,
          });
          return;
        }
      }
    } else {
      setLifeQuestionId(null);
      setLifeQuestionText(null);
    }

    // If a question is provided, always start a new dialogue
    if (!initialQuestion) {
      // Check if there's already a dialogue session for this game session
      const sessionIdToUse = resolveSessionId();
      const currentProgress = await storage.getInteractiveModuleSession(moduleId, sessionIdToUse);
      if (currentProgress && currentProgress.data) {
        const savedState = currentProgress.data as InteractiveState;
        if (savedState.phase === 'dialogue' && savedState.messages && savedState.messages.length > 0) {
          // Resume existing dialogue
          console.log('Resuming existing dialogue');
          setState({
            phase: 'dialogue',
            data: savedState.data,
            messages: savedState.messages,
          });

          // Find the dialogue session ID from the saved progress
          const dialogueModuleId = moduleId === 'life-reflection' && lifeQuestionId
            ? `${moduleId}-dialogue-${lifeQuestionId}`
            : `${moduleId}-dialogue`;
          const allSessions = await storage.getModuleSessions(dialogueModuleId);
          if (allSessions.length > 0) {
            // Find the most recent dialogue session for this game
            const recentDialogue = allSessions[0];
            setDialogueSessionId(recentDialogue.sessionId);
          }

          return;
        }
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate context message based on module or use initial question
      let contextMessage = '';
      if (initialQuestion) {
        // User selected a specific question from the result page
        contextMessage = initialQuestion;
      } else if (moduleId === 'value-battle') {
        const results = (activityData as ValueBattleResult) || {};
        const sortedResults = Object.entries(results)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);
        contextMessage = `価値観バトルの結果：\n${sortedResults
          .map(([value, count], i) => `${i + 1}位: ${value} (${count}回選択)`)
          .join('\n')}`;
      } else if (moduleId === 'life-simulator') {
        const selections = (activityData as LifeSimulatorSelections) || {};
        contextMessage = `人生シミュレーターの選択：\n${Object.entries(selections)
          .map(([path, aspects]) => `${path}の人生: ${aspects.join(', ')}`)
          .join('\n')}`;
      } else if (moduleId === 'parent-self-scale') {
        const responses = (activityData as ParentSelfScaleResponses) || {};
        const average =
          Object.values(responses).reduce((sum, val) => sum + val, 0) /
          Object.values(responses).length;
        contextMessage = `天秤ゲームの結果：\n平均: ${Math.round(
          average
        )}% (0%=親の期待, 100%=自分の気持ち)`;
      } else if (moduleId === 'time-machine') {
        const { pastLetter, futureLetter } = (activityData as TimeMachineLetters) || {
          pastLetter: '',
          futureLetter: '',
        };
        contextMessage = `タイムマシンで書いた手紙：\n\n[1年前の自分へ]\n${pastLetter}\n\n[10年後の自分から]\n${futureLetter}`;
      } else if (moduleId === 'life-reflection') {
        const lifeData = currentLifeData || emptyLifeData;
        const eraGuess =
          (lifeQuestionId && lifeQuestionId.split('_')[0]) ||
          (lifeData.eras.elementary ? 'elementary' : lifeData.eras.middleschool ? 'middleschool' : 'elementary');
        const eraName = getEraById(eraGuess)?.name || 'この時期';
        const answerText =
          isLifeReflectionContext && typeof dataOrQuestion === 'object'
            ? ((dataOrQuestion as LifeReflectionQuestionContext).answer || '').trim()
            : '';
        if (isLifeReflectionContext && lifeQuestionText) {
          contextMessage = `【時代】${eraName}
【質問】${lifeQuestionText}
あなたの経験や気持ちを一緒に整理したいです。自由に教えてください。`;
          if (answerText) {
            contextMessage += `\n\n参考メモ: ${answerText}`;
          }
        } else {
          contextMessage = `人生を振り返る質問に取り組みます。
印象に残っている出来事や気持ちを自由に教えてください。`;
        }
      } else if (moduleId === 'career-dictionary') {
        const career = (activityData as CareerProfile) || {
          name: '',
          headline: '',
          summary: '',
          timeline: [],
          interview: [],
          tags: [],
          quote: '',
          introduction: '',
          score: 0,
          kana: '',
          avatar: '',
          keywords: [],
          updatedAt: '',
          lessons: [],
          id: ''
        };
        const timelineSnippet = (career.timeline || [])
          .map(entry => `${entry.label}: ${entry.description}`)
          .join('\n');
        const interviewSnippet = (career.interview || [])
          .slice(0, 2)
          .map(item => `${item.question}\n${item.answer}`)
          .join('\n\n');
        contextMessage = `進路図鑑で「${career.name}（${career.headline}）」のストーリーを読みました。

【紹介文】
${career.summary}

【感じたこと】
${career.introduction}

【人生年表】
${timelineSnippet}

【印象に残ったQ&A】
${interviewSnippet}

このストーリーについて、一緒に振り返りましょう。`;
      }

      // Call API for initial message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: contextMessage,
            },
          ],
          systemPrompt: moduleDefinition?.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const responseData = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: responseData.message,
        timestamp: new Date(),
      };

      // Create a new dialogue session ID
      let newDialogueSessionId = `session-${Date.now()}`;
      // life-reflection: reuse per-question session if exists
      if (moduleId === 'life-reflection' && isLifeReflectionContext && lifeQuestionId) {
        const lifeData = (activityData as LifeReflectionData) || { dialogueSessions: {} };
        const existingSession = lifeData.dialogueSessions?.[lifeQuestionId];
        if (existingSession) {
          newDialogueSessionId = existingSession;
        }
      }
      setDialogueSessionId(newDialogueSessionId);

      const dialogueData: InteractiveActivityData = activityData
        ?? (state.phase !== 'activity' && state.data ? state.data : ({} as InteractiveActivityData));
      // persist dialogue session mapping for life-reflection
      if (moduleId === 'life-reflection' && isLifeReflectionContext && lifeQuestionId) {
        const existingLifeData =
          (dialogueData as LifeReflectionData) || currentLifeData || emptyLifeData;
        const updatedLifeData: LifeReflectionData = {
          ...existingLifeData,
          dialogueSessions: {
            ...(existingLifeData.dialogueSessions || {}),
            [lifeQuestionId]: newDialogueSessionId,
          },
        };
        // avoid mutating const; create a new object for dialogue data
        const mergedDialogueData: InteractiveActivityData = {
          ...(dialogueData as Record<string, unknown>),
          ...updatedLifeData,
        };
        const newState = {
          phase: 'dialogue' as const,
          data: mergedDialogueData,
          messages: [assistantMessage],
        };
        setState(newState);
        saveProgress(newState);

        if (!(moduleId === 'life-reflection' && isLifeReflectionContext && !lifeQuestionId)) {
          const dialogueModuleId =
            moduleId === 'life-reflection' && lifeQuestionId
              ? `${moduleId}-dialogue-${lifeQuestionId}`
              : `${moduleId}-dialogue`;
          const chatProgress: ModuleProgress = {
            moduleId: dialogueModuleId,
            sessionId: newDialogueSessionId,
            messages: [assistantMessage],
            createdAt: new Date(),
            lastUpdated: new Date(),
            completed: false,
            userId: storage.userId || undefined,
            userEmail: storage.userEmail || undefined,
          };
          await storage.saveModuleProgress(dialogueModuleId, chatProgress);
        }
        setIsLoading(false);
        return;
      }
      const newState = {
        phase: 'dialogue' as const,
        data: dialogueData,
        messages: [assistantMessage],
      };
      setState(newState);
      saveProgress(newState);

      // Save dialogue as a regular chat module session
      if (!(moduleId === 'life-reflection' && isLifeReflectionContext && !lifeQuestionId)) {
        const dialogueModuleId =
          moduleId === 'life-reflection' && lifeQuestionId
            ? `${moduleId}-dialogue-${lifeQuestionId}`
            : `${moduleId}-dialogue`;
        const chatProgress: ModuleProgress = {
          moduleId: dialogueModuleId,
          sessionId: newDialogueSessionId,
          messages: [assistantMessage],
          createdAt: new Date(),
          lastUpdated: new Date(),
          completed: false,
          userId: storage.userId || undefined,
          userEmail: storage.userEmail || undefined,
        };
        await storage.saveModuleProgress(dialogueModuleId, chatProgress);
      }
    } catch (error) {
      console.error('Error starting dialogue:', error);
      setError('対話を開始できませんでした。もう一度お試しください。');

      // Fallback message
      const fallbackMessage: Message = {
        role: 'assistant',
        content: 'こんにちは。一緒に考えていきましょう。',
        timestamp: new Date(),
      };
      const dialogueData: InteractiveActivityData = activityData
        ?? (state.phase !== 'activity' && state.data ? state.data : ({} as InteractiveActivityData));
      const newState = {
        phase: 'dialogue' as const,
        data: dialogueData,
        messages: [fallbackMessage],
      };
      setState(newState);
      saveProgress(newState);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (state.phase !== 'dialogue') return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...state.messages, userMessage];
    const tempState = { ...state, messages: updatedMessages };
    setState(tempState);
    saveProgress(tempState);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt: moduleDefinition?.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const newState = {
        ...state,
        messages: finalMessages,
      };
      setState(newState);
      saveProgress(newState);

      // Also save to chat module session for dialogue history
      if (dialogueSessionId) {
        const dialogueModuleId =
          moduleId === 'life-reflection' && lifeQuestionId
            ? `${moduleId}-dialogue-${lifeQuestionId}`
            : `${moduleId}-dialogue`;
        const chatProgress: ModuleProgress = {
          moduleId: dialogueModuleId,
          sessionId: dialogueSessionId,
          messages: finalMessages,
          createdAt: new Date(),
          lastUpdated: new Date(),
          completed: false,
          userId: storage.userId || undefined,
          userEmail: storage.userEmail || undefined,
        };
        await storage.saveModuleProgress(dialogueModuleId, chatProgress);
      }

      if (moduleId === 'life-reflection' && lifeQuestionId && lifeQuestionText) {
        // Mark question as "実施済み" with latest user message
        const lifeData = getLifeDataFromState(state);
        const era =
          lifeData.eras?.elementary ||
          lifeData.eras?.middleschool ||
          lifeData.eras?.highschool ||
          lifeData.eras?.college ||
          lifeData.eras?.working || { eraId: 'overall', questionResponses: [], satisfaction: null, completed: false };

        const lastUser = [...finalMessages].reverse().find(m => m.role === 'user');
        const updatedResponses = [
          ...(era.questionResponses || []).filter(r => r.questionId !== lifeQuestionId),
          {
            questionId: lifeQuestionId,
            response: lastUser?.content || lifeQuestionText,
            timestamp: new Date(),
          },
        ];

        const updatedEra = {
          ...era,
          questionResponses: updatedResponses,
        };

        const updatedLifeData: LifeReflectionData = {
          ...lifeData,
          eras: {
            ...lifeData.eras,
            elementary: updatedEra,
          },
          dialogueSessions: {
            ...(lifeData.dialogueSessions || {}),
            [lifeQuestionId]: dialogueSessionId || `session-${Date.now()}`,
          },
        };

        const newStateWithLife: InteractiveState = { ...newState, data: updatedLifeData };
        setState(newStateWithLife);
        saveProgress(newStateWithLife);
      }

      // Trigger value analysis after every message exchange (minimum 2 messages)
      if (finalMessages.length >= 2 && !isAnalyzing && (finalMessages.length - lastAnalyzedMessageCount >= 2)) {
        triggerValueAnalysis(finalMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('メッセージを送信できませんでした。もう一度お試しください。');

      const errorMessage: Message = {
        role: 'assistant',
        content: 'ごめんね、うまく応答できなかった。もう一度試してみてくれる？',
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      const newState = {
        ...state,
        messages: finalMessages,
      };
      setState(newState);
      saveProgress(newState);

      // Also save to chat module session for dialogue history
      if (dialogueSessionId) {
        const dialogueModuleId =
          moduleId === 'life-reflection' && lifeQuestionId
            ? `${moduleId}-dialogue-${lifeQuestionId}`
            : `${moduleId}-dialogue`;
        const chatProgress: ModuleProgress = {
          moduleId: dialogueModuleId,
          sessionId: dialogueSessionId,
          messages: finalMessages,
          createdAt: new Date(),
          lastUpdated: new Date(),
          completed: false,
          userId: storage.userId || undefined,
          userEmail: storage.userEmail || undefined,
        };
        await storage.saveModuleProgress(dialogueModuleId, chatProgress);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerValueAnalysis = async (messagesToAnalyze: Message[]) => {
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/extract-values', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          messages: messagesToAnalyze,
          moduleId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Value analysis failed:', response.status, errorData);
        throw new Error('Failed to analyze values');
      }

      const data = await response.json();
      const snapshot = data.snapshot as ValueSnapshot;

      // Save to localStorage
      await storage.saveValueSnapshot({
        ...snapshot,
        user_id: storage.userId || 'local-user',
        created_at: new Date(snapshot.created_at),
        last_updated: new Date(),
      });

      // Analysis successful - update the count and show notification
      setLastAnalyzedMessageCount(messagesToAnalyze.length);
      setAnalysisComplete(true);

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setAnalysisComplete(false);
      }, 5000);
    } catch (error) {
      console.error('Error analyzing values:', error);
      // Don't update count on error, so we can retry later
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBackToResult = () => {
    if (state.phase === 'dialogue') {
      // For life-reflection, go back to activity (edit mode)
      if (moduleId === 'life-reflection') {
        setState({ phase: 'activity', activityData: state.data });
      } else {
        setState({ phase: 'result', data: state.data });
      }
    }
  };

  if (!moduleDefinition) {
    return null;
  }

  const handleHeaderBack = () => {
    if (moduleId === 'career-dictionary' && careerDictionaryRef.current?.canGoBack()) {
      careerDictionaryRef.current.goBack();
      return;
    }
    // ライフ振り返りの対話中はホームに戻さず質問一覧へ戻す
    if (moduleId === 'life-reflection' && state.phase === 'dialogue') {
      setState({ phase: 'activity', activityData: state.data });
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <button
                onClick={handleHeaderBack}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="1つ前に戻る"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-semibold hidden sm:inline">戻る</span>
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xl flex-shrink-0">{moduleDefinition.icon}</span>
                  <h1 className="text-base font-semibold text-gray-900 truncate">
                    {moduleDefinition.title}
                  </h1>
                </div>
                <p className="text-xs text-gray-500 block truncate">{moduleDefinition.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                title="ホームへ戻る"
                aria-label="ホームへ戻る"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4a2 2 0 01-2-2V13H9v7a2 2 0 01-2 2H3z" />
                </svg>
                <span className="text-sm font-semibold hidden sm:inline">ホーム</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-grow">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 ml-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className={state.phase === 'dialogue' ? '' : 'py-8'}>
        <div className="animate-fade-in">
          {state.phase === 'activity' && (
            <>
              {moduleId === 'value-battle' && (
                <ValueBattle onComplete={handleActivityComplete} />
              )}
              {moduleId === 'life-simulator' && (
                <LifeSimulator onComplete={handleActivityComplete} />
              )}
              {moduleId === 'parent-self-scale' && (
                <ParentSelfScale onComplete={handleActivityComplete} />
              )}
              {moduleId === 'time-machine' && (
                <TimeMachine
                  onComplete={(pastLetter, futureLetter) =>
                    handleStartDialogue({ pastLetter, futureLetter })
                  }
                />
              )}
              {moduleId === 'career-dictionary' && (
                <CareerDictionary
                  ref={careerDictionaryRef}
                  onSelectCareer={(career) => handleActivityComplete(career)}
                />
              )}
              {moduleId === 'life-reflection' && (
                <LifeReflection
                  initialData={state.activityData as LifeReflectionData | undefined}
                  onComplete={(data) => handleActivityComplete(data)}
                  onStartDialogue={(questionContext) => handleStartDialogue(questionContext)}
                />
              )}
            </>
          )}

          {state.phase === 'result' && (
            <>
              {moduleId === 'value-battle' && state.data && (
                <ValueBattleResultView
                  results={state.data as ValueBattleResult}
                  onStartDialogue={() => handleStartDialogue()}
                />
              )}
              {moduleId === 'life-simulator' && state.data && (
                <LifeSimulatorResult
                  selections={state.data as LifeSimulatorSelections}
                  onStartDialogue={() => handleStartDialogue()}
                />
              )}
              {moduleId === 'parent-self-scale' && state.data && (
                <ParentSelfScaleResult
                  responses={state.data as ParentSelfScaleResponses}
                  onStartDialogue={() => handleStartDialogue()}
                />
              )}
              {moduleId === 'career-dictionary' && state.data && (
                <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-xs text-gray-500 mb-2">選んだストーリー</p>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{(state.data as CareerProfile).name}</h2>
                      <p className="text-sm text-gray-600">{(state.data as CareerProfile).headline}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(state.data as CareerProfile).tags.map(tag => (
                          <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">自己採点</p>
                      <p className="text-3xl font-bold text-blue-600">{(state.data as CareerProfile).score}点</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">紹介文</p>
                    <p className="text-sm text-gray-700">{(state.data as CareerProfile).summary}</p>
                  </div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">人生年表</p>
                  <div className="space-y-3 mb-6">
                    {(state.data as CareerProfile).timeline.map(entry => (
                      <div key={entry.label} className="flex gap-3">
                        <span className="text-xs font-bold text-blue-600 w-16 flex-shrink-0">{entry.label}</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{entry.description}</p>
                          <p className="text-xs text-gray-500 mt-1">選んだ理由：{entry.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => handleStartDialogue()}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      このストーリーについて話してみる
                    </button>
                    <button
                      onClick={() => setState({ phase: 'activity' })}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                    >
                      他のストーリーを見る
                    </button>
                  </div>
                </div>
              )}
              {moduleId === 'life-reflection' && state.data && (
                <LifeReflectionResult
                  data={state.data as LifeReflectionData}
                  onStartDialogue={() => handleStartDialogue()}
                />
              )}
            </>
          )}

          {state.phase === 'dialogue' && (
            <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] relative">
              {/* History Sidebar - Left (Desktop only) */}
              {showHistorySidebar && (
                <>
                  {/* Mobile Overlay */}
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setShowHistorySidebar(false)}
                  />
                  {/* Sidebar */}
                  <div className={`${showHistorySidebar
                    ? 'fixed lg:relative left-0 top-0 bottom-0 z-50 lg:z-0'
                    : 'hidden'
                    } w-80 lg:w-80 flex-shrink-0`}>
                    <DialogueHistorySidebar
                      allProgress={allProgress}
                      currentModuleId={moduleId}
                      onClose={() => setShowHistorySidebar(false)}
                    />
                  </div>
                </>
              )}

              {/* Main Content Area */}
              <div className="flex-1 min-w-0 max-w-5xl mx-auto w-full flex flex-col">
                {/* Mobile Result Section - Top (Mobile only) */}
                <div className="lg:hidden">
                  {showResultSidebar && (
                    <div className="border-b border-gray-200 bg-white">
                      <div className="max-h-[40vh] overflow-y-auto">
                        <ModuleResultSidebar
                          moduleId={moduleId}
                          data={state.data}
                          onClose={() => setShowResultSidebar(false)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Interface */}
                <div className="flex-1 min-h-0">
                  <ChatInterface
                    messages={state.messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    placeholder="メッセージを入力..."
                    moduleContext={{
                      moduleId: moduleDefinition.id,
                      moduleTitle: moduleDefinition.title,
                      gameResults: JSON.stringify(state.data, null, 2)
                    }}
                  />
                </div>
              </div>

              {/* Result Sidebar - Right (Desktop only) */}
              <div className="hidden lg:block">
                {showResultSidebar && (
                  <div className="w-96 flex-shrink-0">
                    <ModuleResultSidebar
                      moduleId={moduleId}
                      data={state.data}
                      onClose={() => setShowResultSidebar(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Analyzing animation */}
      {isAnalyzing && <AnalyzingAnimation />}

      {/* Analysis complete notification */}
      {analysisComplete && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-2xl border border-blue-200 p-4 max-w-sm w-full mx-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✨</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                価値観を更新しました!
              </p>
              <p className="text-xs text-gray-600">
                ホーム画面で確認できます
              </p>
            </div>
            <button
              onClick={() => setAnalysisComplete(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
