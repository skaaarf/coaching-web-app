'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getModuleById } from '@/lib/modules';
import { Message } from '@/types';
import ValueBattle from '@/components/ValueBattle';
import ValueBattleResultView from '@/components/ValueBattleResult';
import LifeSimulator from '@/components/LifeSimulator';
import LifeSimulatorResult from '@/components/LifeSimulatorResult';
import ParentSelfScale from '@/components/ParentSelfScale';
import ParentSelfScaleResult from '@/components/ParentSelfScaleResult';
import TimeMachine from '@/components/TimeMachine';
import BranchMap from '@/components/BranchMap';
import ChatInterface from '@/components/ChatInterface';

type InteractiveState =
  | { phase: 'activity' }
  | { phase: 'result'; data: any }
  | { phase: 'dialogue'; data: any; messages: Message[] };

export default function InteractiveModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  const [module, setModule] = useState(() => getModuleById(moduleId));
  const [state, setState] = useState<InteractiveState>({ phase: 'activity' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!module || module.moduleType !== 'interactive') {
      router.push('/');
    }
  }, [module, router]);

  const handleActivityComplete = (data: any) => {
    setState({ phase: 'result', data });
  };

  const handleStartDialogue = async (data?: any) => {
    const activityData = state.phase === 'result' ? state.data : data;

    setIsLoading(true);
    try {
      // Generate context message based on module
      let contextMessage = '';
      if (moduleId === 'value-battle') {
        const results = activityData as Record<string, number>;
        const sortedResults = Object.entries(results)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);
        contextMessage = `価値観バトルの結果：\n${sortedResults
          .map(([value, count], i) => `${i + 1}位: ${value} (${count}回選択)`)
          .join('\n')}`;
      } else if (moduleId === 'life-simulator') {
        const selections = activityData as Record<string, string[]>;
        contextMessage = `人生シミュレーターの選択：\n${Object.entries(selections)
          .map(([path, aspects]) => `${path}の人生: ${aspects.join(', ')}`)
          .join('\n')}`;
      } else if (moduleId === 'parent-self-scale') {
        const responses = activityData as Record<number, number>;
        const average =
          Object.values(responses).reduce((sum, val) => sum + val, 0) /
          Object.values(responses).length;
        contextMessage = `天秤ゲームの結果：\n平均: ${Math.round(
          average
        )}% (0%=親の期待, 100%=自分の気持ち)`;
      } else if (moduleId === 'time-machine') {
        const { pastLetter, futureLetter } = activityData as {
          pastLetter: string;
          futureLetter: string;
        };
        contextMessage = `タイムマシンで書いた手紙：\n\n[1年前の自分へ]\n${pastLetter}\n\n[10年後の自分から]\n${futureLetter}`;
      } else if (moduleId === 'branch-map') {
        const path = activityData as Array<{ label: string }>;
        contextMessage = `IF分岐マップで選んだ道：\n${path
          .map((b) => b.label)
          .join(' → ')}`;
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
          systemPrompt: module?.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start dialogue');
      }

      const responseData = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: responseData.message,
        timestamp: new Date(),
      };

      setState({
        phase: 'dialogue',
        data: activityData,
        messages: [assistantMessage],
      });
    } catch (error) {
      console.error('Error starting dialogue:', error);
      // Fallback message
      const fallbackMessage: Message = {
        role: 'assistant',
        content: 'こんにちは。一緒に考えていきましょう。',
        timestamp: new Date(),
      };
      setState({
        phase: 'dialogue',
        data: activityData,
        messages: [fallbackMessage],
      });
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
    setState({ ...state, messages: updatedMessages });

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt: module?.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setState({
        ...state,
        messages: [...updatedMessages, assistantMessage],
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'ごめんね、うまく応答できなかった。もう一度試してみてくれる？',
        timestamp: new Date(),
      };
      setState({
        ...state,
        messages: [...updatedMessages, errorMessage],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!module) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{module.icon}</span>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {module.title}
                  </h1>
                </div>
                <p className="text-sm text-gray-500">{module.description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-8">
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
            {moduleId === 'branch-map' && (
              <BranchMap onComplete={handleActivityComplete} />
            )}
          </>
        )}

        {state.phase === 'result' && (
          <>
            {moduleId === 'value-battle' && (
              <ValueBattleResultView
                results={state.data}
                onStartDialogue={() => handleStartDialogue()}
              />
            )}
            {moduleId === 'life-simulator' && (
              <LifeSimulatorResult
                selections={state.data}
                onStartDialogue={() => handleStartDialogue()}
              />
            )}
            {moduleId === 'parent-self-scale' && (
              <ParentSelfScaleResult
                responses={state.data}
                onStartDialogue={() => handleStartDialogue()}
              />
            )}
          </>
        )}

        {state.phase === 'dialogue' && (
          <div className="max-w-5xl mx-auto h-[calc(100vh-180px)]">
            <ChatInterface
              messages={state.messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="メッセージを入力... (Enterで送信、Shift+Enterで改行)"
            />
          </div>
        )}
      </main>
    </div>
  );
}
