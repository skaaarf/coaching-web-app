import { ActivityDefinition } from '@/types/activity';

export const d4_requirements: ActivityDefinition = {
    id: 'd4-requirements',
    title: '募集要項のどこを見るべきか整理する',
    style: 'selection',
    initialStepId: 'q1',
    steps: {
        q1: {
            id: 'q1',
            type: 'button',
            message: '募集要項を見るとき、一番重視するのは？',
            options: [
                { label: '仕事内容・身につくスキル', value: 'content', nextStepId: 'q2' },
                { label: '時給・待遇', value: 'salary', nextStepId: 'q2' },
                { label: '勤務地・時間', value: 'place', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: '「これだけは嫌だ」という条件はありますか？',
            options: [
                { label: '特にない', value: 'none', nextStepId: 'complete' },
                { label: '厳しいノルマ', value: 'quota', nextStepId: 'complete' },
                { label: '単純作業のみ', value: 'simple', nextStepId: 'complete' },
            ],
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '見るべきポイントが整理できました。\nこれをチェックリストにして探してみましょう。',
            isFinal: true,
        },
    },
};
