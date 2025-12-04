import { ActivityDefinition } from '@/types/activity';

export const c1_status_check: ActivityDefinition = {
    id: 'c1-status-check',
    title: '今の就活・転職の状況を整理する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '今の就活・転職活動の状況を教えてください。\n（例：エントリー数、面接の進み具合など）',
            placeholder: '例：5社エントリーして、1社面接中',
            multiline: true,
            nextStepId: 'feeling',
        },
        feeling: {
            id: 'feeling',
            type: 'text',
            message: '今の率直な気持ちはどうですか？\n焦り、不安、楽しみ、なんでもOKです。',
            placeholder: '例：少し焦っているけど、やるしかないと思っている',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '現状を吐き出すだけでも整理になりますね。\nここから戦略を立て直していきましょう。',
            isFinal: true,
        },
    },
};
