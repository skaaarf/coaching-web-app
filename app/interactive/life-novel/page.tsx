'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { ModuleProgress } from '@/types';
import { NOVEL_SCENES, NovelScene, PlayerStatus, getSceneById } from '@/lib/life-novel-data';

export default function LifeNovelPage() {
  const router = useRouter();
  const storage = useStorage();
  const [currentSceneId, setCurrentSceneId] = useState<string>('start');
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({
    age: 16,
    money: 50,
    stress: 30,
    happiness: 60,
    skills: [],
    path: '',
    education: '高校2年生',
  });
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const sessions = await storage.getModuleSessions('life-novel');
      if (sessions.length > 0) {
        const latestSession = sessions[sessions.length - 1];
        if (latestSession.metadata) {
          setCurrentSceneId(latestSession.metadata.currentSceneId || 'start');
          setPlayerStatus(latestSession.metadata.playerStatus || playerStatus);
          setHistory(latestSession.metadata.history || []);
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (sceneId: string, status: PlayerStatus, historyData: string[]) => {
    try {
      const progressData: ModuleProgress = {
        moduleId: 'life-novel',
        sessionId: `life-novel-${Date.now()}`,
        messages: [],
        createdAt: new Date(),
        lastUpdated: new Date(),
        completed: false,
        metadata: {
          currentSceneId: sceneId,
          playerStatus: status,
          history: historyData,
        }
      };
      await storage.saveModuleProgress('life-novel', progressData);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleChoice = async (choiceId: string) => {
    const currentScene = getSceneById(currentSceneId);
    if (!currentScene) return;

    const choice = currentScene.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Update player status based on choice effects
    const newStatus = { ...playerStatus };
    if (choice.effects) {
      newStatus.money = Math.max(0, Math.min(100, newStatus.money + (choice.effects.money || 0)));
      newStatus.stress = Math.max(0, Math.min(100, newStatus.stress + (choice.effects.stress || 0)));
      newStatus.happiness = Math.max(0, Math.min(100, newStatus.happiness + (choice.effects.happiness || 0)));

      if (choice.effects.skills) {
        newStatus.skills = [...new Set([...newStatus.skills, ...choice.effects.skills])];
      }
      if (choice.effects.path) {
        newStatus.path = choice.effects.path;
      }
      if (choice.effects.education) {
        newStatus.education = choice.effects.education;
      }
      if (choice.effects.job) {
        newStatus.job = choice.effects.job;
      }
    }

    // Update age for next scene
    const nextScene = getSceneById(choice.nextSceneId);
    if (nextScene) {
      newStatus.age = nextScene.age;
    }

    // Add to history
    const newHistory = [...history, `${currentScene.title}: ${choice.text}`];

    setPlayerStatus(newStatus);
    setCurrentSceneId(choice.nextSceneId);
    setHistory(newHistory);

    // Save progress
    await saveProgress(choice.nextSceneId, newStatus, newHistory);
  };

  const handleRestart = () => {
    setCurrentSceneId('start');
    setPlayerStatus({
      age: 16,
      money: 50,
      stress: 30,
      happiness: 60,
      skills: [],
      path: '',
      education: '高校2年生',
    });
    setHistory([]);
    saveProgress('start', {
      age: 16,
      money: 50,
      stress: 30,
      happiness: 60,
      skills: [],
      path: '',
      education: '高校2年生',
    }, []);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  const currentScene = getSceneById(currentSceneId);

  if (!currentScene) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-gray-600 mb-4">シーンが見つかりませんでした</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <h1 className="text-lg font-bold text-gray-900">人生ノベル</h1>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
            >
              ← ホーム
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Player Status */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">年齢</p>
              <p className="text-lg font-bold text-gray-900">{playerStatus.age}歳</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">学歴・職業</p>
              <p className="text-sm font-medium text-gray-900">{playerStatus.job || playerStatus.education}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">経済状況</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${playerStatus.money}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{playerStatus.money}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">ストレス</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${playerStatus.stress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{playerStatus.stress}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">幸福度</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${playerStatus.happiness}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{playerStatus.happiness}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">習得スキル</p>
              <div className="flex flex-wrap gap-1">
                {playerStatus.skills.length > 0 ? (
                  playerStatus.skills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">なし</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Story Scene */}
        <div className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-200">
          <div className="mb-4">
            <div className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-3">
              {playerStatus.age}歳
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentScene.title}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentScene.description}</p>
          </div>

          {/* Choices or Ending */}
          {currentScene.isEnding ? (
            <div className="mt-6 space-y-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-6 text-center">
                <p className="text-white text-xl font-bold mb-2">🎉 エンディング</p>
                <p className="text-white/90 text-sm">あなたの物語はここで一区切りです</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold transition-colors"
                >
                  最初からやり直す
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors"
                >
                  ホームに戻る
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {currentScene.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-2 border-pink-200 hover:border-pink-400 rounded-lg text-left transition-all"
                >
                  <p className="font-medium text-gray-900">{choice.text}</p>
                  {choice.effects && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {choice.effects.money && (
                        <span className={`px-2 py-0.5 rounded ${choice.effects.money > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          経済 {choice.effects.money > 0 ? '+' : ''}{choice.effects.money}
                        </span>
                      )}
                      {choice.effects.stress && (
                        <span className={`px-2 py-0.5 rounded ${choice.effects.stress > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          ストレス {choice.effects.stress > 0 ? '+' : ''}{choice.effects.stress}
                        </span>
                      )}
                      {choice.effects.happiness && (
                        <span className={`px-2 py-0.5 rounded ${choice.effects.happiness > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                          幸福度 {choice.effects.happiness > 0 ? '+' : ''}{choice.effects.happiness}
                        </span>
                      )}
                      {choice.effects.skills && choice.effects.skills.length > 0 && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                          スキル: {choice.effects.skills.join(', ')}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-3">これまでの選択</h3>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="text-xs text-gray-600 pl-3 border-l-2 border-gray-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
