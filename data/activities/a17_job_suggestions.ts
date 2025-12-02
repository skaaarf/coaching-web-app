import { ActivityDefinition } from '@/types/activity';

export const a17_job_suggestions: ActivityDefinition = {
    id: 'a17-job-suggestions',
    title: '自分に合いそうな職種の案をもらう',
    style: 'selection',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'button',
            message: 'あなたの興味と環境の好みから、いくつか職種をピックアップしました。\n（※AIが提案するイメージ）\n\n「販売スタッフ」はどうですか？',
            options: [
                { label: '気になる', value: 'interested', nextStepId: 'q2' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'q2' },
                { label: 'あまり...', value: 'not_interested', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: '「製造・加工スタッフ」はどうですか？',
            options: [
                { label: '気になる', value: 'interested', nextStepId: 'complete' },
                { label: 'どちらでもない', value: 'neutral', nextStepId: 'complete' },
                { label: 'あまり...', value: 'not_interested', nextStepId: 'complete' },
            ],
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'フィードバックありがとうございます。\n「気になる」に入れた職種を詳しく調べてみましょう。',
            isFinal: true,
        },
    },
};
