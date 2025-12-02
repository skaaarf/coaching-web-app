import { ActivityDefinition } from '@/types/activity';

export const d1_goals: ActivityDefinition = {
    id: 'd1-goals',
    title: 'インターンやバイトで得たいものを整理する',
    style: 'selection',
    initialStepId: 'q1',
    steps: {
        q1: {
            id: 'q1',
            type: 'button',
            message: 'インターンやバイトをする一番の目的は何ですか？',
            options: [
                { label: 'お金を稼ぐ', value: 'money', nextStepId: 'q2' },
                { label: 'スキルを身につける', value: 'skill', nextStepId: 'q2' },
                { label: '社会経験・人脈', value: 'experience', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: '二番目に大事なのは？',
            options: [
                { label: 'お金', value: 'money', nextStepId: 'complete' },
                { label: 'スキル', value: 'skill', nextStepId: 'complete' },
                { label: '仲間・楽しさ', value: 'fun', nextStepId: 'complete' },
            ],
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '目的がはっきりしましたね。\nこれを基準に探すと、ミスマッチが減ります。',
            isFinal: true,
        },
    },
};
