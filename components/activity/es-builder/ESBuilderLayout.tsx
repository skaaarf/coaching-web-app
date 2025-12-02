'use client';

import React, { useState, useEffect } from 'react';
import { EsQuestionTemplate, EsAnswer, EsChatSession, ChatMessage, EsStatus, EsScoreResult } from './types';
import QuestionSidebar from './QuestionSidebar';
import ESChatPanel from './ESChatPanel';
import ESEditorPanel from './ESEditorPanel';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveInteractiveModuleProgress, getInteractiveModuleProgress } from '@/lib/storage-unified';
import { EsBuilderData } from '@/types';

const INITIAL_QUESTIONS: EsQuestionTemplate[] = [
    {
        id: 'q1_self_pr',
        title: 'まず、ご自身の強みを交えて1分程度で自己PRをお願いいたします。',
        description: 'ご自身の強みを交えて1分程度で自己PRをお願いいたします。',
    },
    {
        id: 'q2_weakness',
        title: 'ご自身の弱みや今後改善したい点について具体的に教えてください。',
        description: 'ご自身の弱みや今後改善したい点について具体的に教えてください。',
    },
    {
        id: 'q3_gakuchika_summary',
        title: '学生時代に最も力を入れた取り組みについて概要をお聞かせください。',
        description: '学生時代に最も力を入れた取り組みについて概要をお聞かせください。',
    },
    {
        id: 'q4_academic',
        title: '学業面で特に熱心に取り組んだテーマや研究内容を教えてください。',
        description: '学業面で特に熱心に取り組んだテーマや研究内容を教えてください。',
    },
    {
        id: 'q5_role',
        title: 'チームや組織で活動した経験の中で、あなたが担った役割と意識したことを教えてください。',
        description: 'チームや組織で活動した経験の中で、あなたが担った役割と意識したことを教えてください。',
    },
    {
        id: 'q6_problem_solving',
        title: 'その取り組みで直面した課題をどのように特定し、解決策を立案・実行されましたか。',
        description: 'その取り組みで直面した課題をどのように特定し、解決策を立案・実行されましたか。',
    },
    {
        id: 'q7_hardship',
        title: 'これまでの人生で最も困難だった経験と、それをどう乗り越えたかを教えてください。',
        description: 'これまでの人生で最も困難だった経験と、それをどう乗り越えたかを教えてください。',
    },
    {
        id: 'q8_learning',
        title: 'これまでの経験から得た学びを、今後どのように活かしていきたいと考えていますか。',
        description: 'これまでの経験から得た学びを、今後どのように活かしていきたいと考えていますか。',
    },
    {
        id: 'q9_news',
        title: '最近関心を持ったICT関連ニュースと、そこから考えたビジネスへの示唆を教えてください。',
        description: '最近関心を持ったICT関連ニュースと、そこから考えたビジネスへの示唆を教えてください。',
    },
    {
        id: 'q10_vision',
        title: '貴社で挑戦したい事業や社会課題と、その実現イメージをお聞かせください。',
        description: '貴社で挑戦したい事業や社会課題と、その実現イメージをお聞かせください。',
    },
    {
        id: 'q11_criteria',
        title: '最終的に入社先を決める際に重視するポイントは何でしょうか。',
        description: '最終的に入社先を決める際に重視するポイントは何でしょうか。',
    },
];

export default function ESBuilderLayout() {
    const router = useRouter();
    const [questions, setQuestions] = useState<EsQuestionTemplate[]>(INITIAL_QUESTIONS);
    const [activeQuestionId, setActiveQuestionId] = useState<string>(INITIAL_QUESTIONS[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // State for answers
    const [answers, setAnswers] = useState<Record<string, EsAnswer>>(() => {
        const initial: Record<string, EsAnswer> = {};
        INITIAL_QUESTIONS.forEach(q => {
            initial[q.id] = {
                id: crypto.randomUUID(),
                questionId: q.id,
                text: '',
                status: 'not_started',
                updatedAt: new Date().toISOString(),
            };
        });
        return initial;
    });

    // State for chat sessions
    const [chatSessions, setChatSessions] = useState<Record<string, EsChatSession>>(() => {
        const initial: Record<string, EsChatSession> = {};
        INITIAL_QUESTIONS.forEach(q => {
            initial[q.id] = {
                id: crypto.randomUUID(),
                questionId: q.id,
                messages: [
                    {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `最初に、関連しそうな出来事や経験をざっくりで良いので教えてもらえますか？\n箇条書きでも短文でも全然OKです！`,
                        timestamp: Date.now(),
                    }
                ],
            };
        });
        return initial;
    });

    const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
    const [scoreResults, setScoreResults] = useState<Record<string, EsScoreResult>>({});
    const [isScoring, setIsScoring] = useState<Record<string, boolean>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // ... (Load/Save effects remain same)

    // ...

    const activeQuestion = questions.find(q => q.id === activeQuestionId) || questions[0];
    const activeAnswer = answers[activeQuestionId] || {
        id: crypto.randomUUID(),
        questionId: activeQuestionId,
        text: '',
        status: 'not_started',
        updatedAt: new Date().toISOString(),
    };
    const activeChatSession = chatSessions[activeQuestionId] || {
        id: crypto.randomUUID(),
        questionId: activeQuestionId,
        messages: [],
    };

    const handleAddQuestion = (title: string) => {
        const newQuestion: EsQuestionTemplate = {
            id: crypto.randomUUID(),
            title,
            description: '自由記述',
        };

        setQuestions(prev => [...prev, newQuestion]);

        // Initialize answer
        setAnswers(prev => ({
            ...prev,
            [newQuestion.id]: {
                id: crypto.randomUUID(),
                questionId: newQuestion.id,
                text: '',
                status: 'not_started',
                updatedAt: new Date().toISOString(),
            }
        }));

        // Initialize chat session
        setChatSessions(prev => ({
            ...prev,
            [newQuestion.id]: {
                id: crypto.randomUUID(),
                questionId: newQuestion.id,
                messages: [
                    {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `最初に、関連しそうな出来事や経験をざっくりで良いので教えてもらえますか？\n箇条書きでも短文でも全然OKです！`,
                        timestamp: Date.now(),
                    }
                ],
            }
        }));

        setActiveQuestionId(newQuestion.id);
    };

    const handleSelectQuestion = (id: string) => {
        setActiveQuestionId(id);
    };

    const handleUpdateAnswer = (text: string) => {
        setAnswers(prev => ({
            ...prev,
            [activeQuestionId]: {
                ...prev[activeQuestionId],
                text,
                status: prev[activeQuestionId].status === 'not_started' ? 'drafting' : prev[activeQuestionId].status,
                updatedAt: new Date().toISOString(),
            }
        }));
    };

    const handleUpdateStatus = (status: EsStatus) => {
        setAnswers(prev => ({
            ...prev,
            [activeQuestionId]: {
                ...prev[activeQuestionId],
                status,
                updatedAt: new Date().toISOString(),
            }
        }));
    };

    const handleReflectDraft = (draft: string) => {
        handleUpdateAnswer(draft);
    };



    const handleScoreAnswer = async () => {
        const currentQuestionId = activeQuestionId;
        const currentAnswer = answers[currentQuestionId];

        if (!currentAnswer || currentAnswer.text.length < 100) return;

        setIsScoring(prev => ({ ...prev, [currentQuestionId]: true }));

        try {
            const response = await fetch('/api/es-builder/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: activeQuestion.title,
                    answer: currentAnswer.text,
                }),
            });

            if (!response.ok) {
                throw new Error('Scoring failed');
            }

            const result: EsScoreResult = await response.json();
            setScoreResults(prev => ({ ...prev, [currentQuestionId]: result }));

        } catch (error) {
            console.error('Scoring error:', error);
            alert('採点中にエラーが発生しました。もう一度お試しください。');
        } finally {
            setIsScoring(prev => ({ ...prev, [currentQuestionId]: false }));
        }
    };

    const handleReflectImprovement = () => {
        const result = scoreResults[activeQuestionId];
        if (!result) return;

        const improvementRequest = `
AI採点結果に基づき、以下の改善ポイントを反映した修正案を作成してください。

【改善ポイント】
${result.improvementPoints.map((p: string) => `・${p}`).join('\n')}

【現在の回答】
${answers[activeQuestionId].text}
`;
        handleSendMessage(improvementRequest);
    };

    const handleSendMessage = async (content: string) => {
        const currentQuestionId = activeQuestionId;

        // Add user message
        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            timestamp: Date.now(),
        };

        setChatSessions(prev => ({
            ...prev,
            [currentQuestionId]: {
                ...prev[currentQuestionId],
                messages: [...prev[currentQuestionId].messages, userMsg],
            }
        }));

        setTypingStatus(prev => ({ ...prev, [currentQuestionId]: true }));

        // Call real API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s client timeout

        try {
            const response = await fetch('/api/es-builder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...activeChatSession.messages, userMsg].map(m => ({
                        role: m.role,
                        content: m.content || '' // Ensure content is not null
                    })),
                    questionInfo: {
                        title: activeQuestion?.title || 'ES作成',
                        description: activeQuestion?.description || '',
                    }
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API request failed: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            // Create placeholder message
            const aiMsgId = crypto.randomUUID();
            const aiMsg: ChatMessage = {
                id: aiMsgId,
                role: 'assistant',
                content: '',
                timestamp: Date.now(),
            };

            setChatSessions(prev => ({
                ...prev,
                [currentQuestionId]: {
                    ...prev[currentQuestionId],
                    messages: [...prev[currentQuestionId].messages, aiMsg],
                }
            }));

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedContent += chunk;

                // Parse for draft content separator
                const separator = '---DRAFT_START---';
                const parts = accumulatedContent.split(separator);
                const messageContent = parts[0].trim();
                const draftContent = parts.length > 1 ? parts[1].trim() : undefined;

                setChatSessions(prev => {
                    const session = prev[currentQuestionId];
                    const messages = session.messages.map(m =>
                        m.id === aiMsgId
                            ? { ...m, content: messageContent, draftContent: draftContent }
                            : m
                    );
                    return {
                        ...prev,
                        [currentQuestionId]: {
                            ...session,
                            messages,
                        }
                    };
                });
            }

            // Final update to ensure everything is clean
            // Check for shortcuts (simple heuristic or just omit for now since we stream text)
            // If we really want shortcuts, we can ask AI to output them in a specific format too, but let's skip for now to ensure speed.

        } catch (error: any) {
            console.error('Failed to get AI response:', error);

            let errorMessage = '申し訳ありません。エラーが発生しました。もう一度お試しください。';
            if (error.name === 'AbortError') {
                errorMessage = '通信がタイムアウトしました。しばらく待ってからもう一度お試しください。';
            }

            // Fallback error message
            const errorMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: errorMessage,
                timestamp: Date.now(),
            };
            setChatSessions(prev => ({
                ...prev,
                [currentQuestionId]: {
                    ...prev[currentQuestionId],
                    messages: [...prev[currentQuestionId].messages, errorMsg],
                }
            }));
        } finally {
            setTypingStatus(prev => ({ ...prev, [currentQuestionId]: false }));
        }
    };

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            {/* ... (Top Bar) ... */}

            {/* Main Content (3-pane) */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Sidebar */}
                {isSidebarOpen && (
                    <QuestionSidebar
                        questions={questions}
                        answers={answers}
                        activeQuestionId={activeQuestionId}
                        onSelectQuestion={handleSelectQuestion}
                        onAddQuestion={handleAddQuestion}
                    />
                )}

                {/* Center: Chat */}
                <div className="flex-[1.2] border-r border-gray-200">
                    <ESChatPanel
                        question={activeQuestion}
                        messages={activeChatSession.messages}
                        onSendMessage={handleSendMessage}
                        onReflectDraft={handleReflectDraft}
                        isTyping={typingStatus[activeQuestionId] || false}
                    />
                </div>

                {/* Right: Editor */}
                <div className="flex-1">
                    <ESEditorPanel
                        question={activeQuestion}
                        answer={activeAnswer}
                        onUpdateAnswer={handleUpdateAnswer}
                        onUpdateStatus={handleUpdateStatus}
                        onRequestDraft={() => handleSendMessage('これまでの内容でドラフトを書いてみて')}
                        isTyping={typingStatus[activeQuestionId] || false}
                        onScore={handleScoreAnswer}
                        isScoring={isScoring[activeQuestionId] || false}
                        scoreResult={scoreResults[activeQuestionId] || null}
                        onReflectImprovement={handleReflectImprovement}
                    />
                </div>
            </div>
        </div>
    );
}
