import { ActivityDefinition } from '@/types/activity';

export const a6_recent_concerns: ActivityDefinition = {
    id: 'a6-recent-concerns',
    title: '最近の悩みを話す',
    style: 'chat',
    mode: 'dynamic_chat',

    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message:
                'ここ最近で気になっている悩みやモヤモヤはありますか？\n勉強、就活、人間関係、生活リズムなど、どんな些細なことでも大丈夫です。',
            placeholder: '',
            nextStepId: 'chat_loop',
        },
    },
};
