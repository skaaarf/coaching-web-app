'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { useStorage } from '@/hooks/useStorage';
import { Message, ModuleProgress } from '@/types';
import { getRoleModelById } from '@/lib/role-models';
import Link from 'next/link';

function RoleModelInterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storage = useStorage();
  const roleModelId = searchParams.get('roleModelId');
  const sessionId = searchParams.get('sessionId');

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const roleModel = roleModelId ? getRoleModelById(roleModelId) : null;

  useEffect(() => {
    if (!roleModelId || !sessionId || !roleModel) {
      setIsLoading(false);
      return;
    }

    loadSession();
  }, [roleModelId, sessionId, storage]);

  const loadSession = async () => {
    if (!sessionId || !roleModelId) return;

    try {
      const sessions = await storage.getModuleSessions('role-model-interview');
      const session = sessions.find(s => s.sessionId === sessionId);

      if (session && session.messages.length > 0) {
        setMessages(session.messages);
      } else {
        // First message from role model
        const welcomeMessage: Message = {
          role: 'assistant',
          content: `こんにちは！${roleModel?.name}です。私のキャリアについて何か聞きたいことはありますか？どんなことでも気軽に聞いてくださいね。`,
          timestamp: new Date()
        };
        const initialMessages = [welcomeMessage];
        setMessages(initialMessages);

        // Save initial session
        const initialProgress: ModuleProgress = {
          moduleId: 'role-model-interview',
          sessionId,
          messages: initialMessages,
          createdAt: new Date(),
          lastUpdated: new Date(),
          completed: false
        };
        await storage.saveModuleProgress('role-model-interview', initialProgress);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!sessionId || !roleModelId || !roleModel) return;

    setIsSendingMessage(true);

    const newMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Save to storage
    const progressData: ModuleProgress = {
      moduleId: 'role-model-interview',
      sessionId,
      messages: updatedMessages,
      createdAt: new Date(),
      lastUpdated: new Date(),
      completed: false
    };
    await storage.saveModuleProgress('role-model-interview', progressData);

    // Generate AI response
    try {
      const systemPrompt = `あなたは${roleModel.name}（${roleModel.furigana}）というロールモデルです。

【あなたのプロフィール】
キャッチフレーズ: ${roleModel.catchphrase}
タグ: ${roleModel.tags.join('、')}

【自己紹介】
${roleModel.introduction}

【人生年表】
${roleModel.timeline.map(t => `${t.age}歳: ${t.event}`).join('\n')}

【あなたの価値観（インタビューからの抜粋）】
Q1: どんな進路を選択して今なにしてる？
A1: ${roleModel.interview.q1}

Q2: その進路を選んだ理由・背景は？
A2: ${roleModel.interview.q2}

Q3: その進路選択ズバリ何点？それってなぜ？
A3: ${roleModel.interview.q3}

Q4: その進路を選んだことで得たものと失ったものは？
A4: ${roleModel.interview.q4}

Q5: あなたの生き方や進路に対する考え方が変わった経験は？
A5: ${roleModel.interview.q5}

Q6: 自分らしい生き方の見つけ方のアドバイスは？
A6: ${roleModel.interview.q6}

【対話のルール】
1. ${roleModel.name}として一人称で話す（「私は〜」）
2. 親しみやすく、フレンドリーな口調で話す
3. 自分の経験や感情を具体的に話す
4. 質問に対しては正直に、時には迷いや葛藤も含めて答える
5. アドバイスを求められたら、押し付けがましくならないように、自分の経験から語る
6. 常に日本語で応答する
7. メッセージは150-300文字程度に収める

あなたは高校生からインタビューを受けています。自分の経験を通じて、進路選択のヒントを与えてください。`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt
        })
      });

      const data = await response.json();

      if (data.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);

        const finalProgressData: ModuleProgress = {
          moduleId: 'role-model-interview',
          sessionId,
          messages: finalMessages,
          createdAt: new Date(),
          lastUpdated: new Date(),
          completed: false
        };
        await storage.saveModuleProgress('role-model-interview', finalProgressData);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (!roleModel || !roleModelId || !sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-gray-600 mb-4">ロールモデルが見つかりませんでした</p>
          <Link
            href="/role-models"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
          >
            一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-500 to-teal-500 border-b border-emerald-600 shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">👥</span>
                <h1 className="text-xl font-bold text-white">
                  {roleModel.name}さんへのインタビュー
                </h1>
              </div>
              <p className="text-emerald-100 text-sm">{roleModel.catchphrase}</p>
            </div>
            <button
              onClick={() => router.push(`/role-models/${roleModelId}`)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors text-sm backdrop-blur-sm border border-white/30"
            >
              ← プロフィール
            </button>
          </div>
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isSendingMessage}
          placeholder="質問を入力..."
        />
      </div>
    </div>
  );
}

export default function RoleModelInterviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <RoleModelInterviewContent />
    </Suspense>
  );
}
