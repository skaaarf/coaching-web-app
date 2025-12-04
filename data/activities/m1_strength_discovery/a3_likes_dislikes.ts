import { ActivityDefinition } from '@/types/activity';

export const a3_likes_dislikes: ActivityDefinition = {
    id: 'a3-likes-dislikes',
    title: '好き・嫌いリストを作る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'message_only',
            message: 'これからいくつかの行動を表示します。\n「好き」「嫌い」「どちらでもない」で直感的に選んでください。',
            nextStepId: 'q1',
        },
        q1: {
            id: 'q1',
            type: 'button',
            message: '人と話す',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q2' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q2' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: 'データを分析する',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q3' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q3' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q3' },
            ],
        },
        q3: {
            id: 'q3',
            type: 'button',
            message: '企画を考える',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q4' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q4' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q4' },
            ],
        },
        q4: {
            id: 'q4',
            type: 'button',
            message: '細かい作業をする',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q5' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q5' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q5' },
            ],
        },
        q5: {
            id: 'q5',
            type: 'button',
            message: 'チームをまとめる',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q6' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q6' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q6' },
            ],
        },
        q6: {
            id: 'q6',
            type: 'button',
            message: '一人で集中する',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q7' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q7' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q7' },
            ],
        },
        q7: {
            id: 'q7',
            type: 'button',
            message: '新しいことに挑戦する',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q8' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q8' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q8' },
            ],
        },
        q8: {
            id: 'q8',
            type: 'button',
            message: 'ルーティンをこなす',
            options: [
                { label: '好き', value: 'like', nextStepId: 'analysis' },
                { label: '嫌い', value: 'dislike', nextStepId: 'analysis' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'analysis' },
            ],
        },
        analysis: {
            id: 'analysis',
            type: 'text',
            message: 'ありがとうございます。\nあなたは『新しいこと』『企画』『チーム』が好きで、『ルーティン』『細かい作業』は苦手そうな傾向がありますね。\n\n特に『新しいこと』が好きな理由は何だと思いますか？',
            placeholder: '',
            options: [
                { label: 'ワクワクするから', value: 'ワクワクするから' },
                { label: '飽きっぽいから', value: '飽きっぽいから' },
            ],
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'なるほど、ありがとうございます！\nあなたの価値観（挑戦志向など）や働き方の好みが少し見えてきました。',
            isFinal: true,
        },
    },
};
