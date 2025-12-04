import { ActivityDefinition } from '@/types/activity';

export const a4_praise_strength: ActivityDefinition = {
    id: 'a4-praise-strength',
    title: '評価された行動から強みを探る',
    style: 'chat',
    mode: 'dynamic_chat',

    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでの経験で、人から褒められたり、感謝されて嬉しかったことはありますか？\n些細なことでも構いません。',
            placeholder: '',
            // options removed for chat-only experience
            nextStepId: 'chat_loop',
        },
    },
};
