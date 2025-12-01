import { ActivityDefinition } from '@/types/activity';

export const a3_likes_dislikes: ActivityDefinition = {
    id: 'a3-likes-dislikes',
    title: '好き・嫌いリストを作る',
    style: 'selection',
    initialStepId: 'q1',
    steps: {
        q1: {
            id: 'q1',
            type: 'button',
            message: '質問1：初対面の人と話すこと',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q2' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q2' },
                { label: '苦手', value: 'dislike', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: '質問2：コツコツ同じ作業を続けること',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q3' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q3' },
                { label: '苦手', value: 'dislike', nextStepId: 'q3' },
            ],
        },
        q3: {
            id: 'q3',
            type: 'button',
            message: '質問3：目立つ役割を任されること',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q4' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q4' },
                { label: '苦手', value: 'dislike', nextStepId: 'q4' },
            ],
        },
        q4: {
            id: 'q4',
            type: 'button',
            message: '質問4：新しい場所に行くこと',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q5' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q5' },
                { label: '苦手', value: 'dislike', nextStepId: 'q5' },
            ],
        },
        q5: {
            id: 'q5',
            type: 'button',
            message: '質問5：計画通りに進めること',
            options: [
                { label: '好き', value: 'like', nextStepId: 'analysis' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'analysis' },
                { label: '苦手', value: 'dislike', nextStepId: 'analysis' },
            ],
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: '回答ありがとうございます！\nあなたの傾向を分析しました。',
            nextStepId: 'result',
        },
        result: {
            id: 'result',
            type: 'summary',
            message: 'あなたの価値観の傾向はこちらです。',
            summaryContent: {
                title: '価値観診断結果',
                items: [
                    { label: '得意なスタイル', value: '自分のペースでコツコツ進める' },
                    { label: '大切にしたいこと', value: '安定感と計画性' },
                    { label: '苦手な環境', value: '急な変化や目立つポジション' },
                ],
            },
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'この結果を「自分コンパス」の材料として保存しました。',
            isFinal: true,
        },
    },
};
