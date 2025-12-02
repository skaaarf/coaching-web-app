import { ActivityDefinition } from '@/types/activity';

export const a16_work_env: ActivityDefinition = {
    id: 'a16-work-env',
    title: '働く環境の好みを整理する',
    style: 'selection',
    initialStepId: 'q1',
    steps: {
        q1: {
            id: 'q1',
            type: 'button',
            message: '働く場所はどちらがいいですか？',
            options: [
                { label: '屋内（オフィスや店舗）', value: 'indoor', nextStepId: 'q2' },
                { label: '屋外（現場や外回り）', value: 'outdoor', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: '働く人数は？',
            options: [
                { label: '少人数でアットホーム', value: 'small', nextStepId: 'complete' },
                { label: '大人数で賑やか', value: 'large', nextStepId: 'complete' },
            ],
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '環境の好みも大事な要素です。\n自分らしくいられる場所を選びましょう。',
            isFinal: true,
        },
    },
};
