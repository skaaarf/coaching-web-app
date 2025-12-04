import { ActivityDefinition } from '@/types/activity';

export const a3_environment_diagnosis: ActivityDefinition = {
    id: 'a3-environment-diagnosis',
    title: '環境診断ゲーム',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'message_only',
            message: '様々な職場環境を表示します。\n「好き」「嫌い」「どちらでもない」で選んでください。',
            nextStepId: 'q1',
        },
        q1: {
            id: 'q1',
            type: 'button',
            message: '変化が激しく、毎日新しいことに挑戦できる環境',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q2' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q2' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: 'ルーティンが決まっていて、安心して働ける環境',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q3' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q3' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q3' },
            ],
        },
        q3: {
            id: 'q3',
            type: 'button',
            message: '自由度が高く、自分で判断できる環境',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q4' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q4' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q4' },
            ],
        },
        q4: {
            id: 'q4',
            type: 'button',
            message: 'チームで協力して、和気あいあいとした環境',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q5' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q5' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q5' },
            ],
        },
        q5: {
            id: 'q5',
            type: 'button',
            message: '個人の裁量が大きく、責任も重い環境',
            options: [
                { label: '好き', value: 'like', nextStepId: 'q6' },
                { label: '嫌い', value: 'dislike', nextStepId: 'q6' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q6' },
            ],
        },
        q6: {
            id: 'q6',
            type: 'button',
            message: '上司の指示が明確で、迷わない環境',
            options: [
                { label: '好き', value: 'like', nextStepId: 'analysis' },
                { label: '嫌い', value: 'dislike', nextStepId: 'analysis' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'analysis' },
            ],
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: '診断結果が出ました！\n\nあなたに合う組織文化は：\n✅ ベンチャー/新規事業\n✅ スピード感重視\n✅ 裁量権が大きい環境\n\n合わない環境は：\n⚠️ ルーティンワーク中心\n⚠️ 変化を嫌う保守的な文化\n\nの可能性があります。',
            isFinal: true,
        },
    },
};
