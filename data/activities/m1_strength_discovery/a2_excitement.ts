import { ActivityDefinition } from '@/types/activity';

export const a2_excitement: ActivityDefinition = {
    id: 'a2-excitement',
    title: '胸が高鳴った瞬間を探る',
    style: 'chat',
    mode: 'dynamic_chat',

    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでの経験で、胸が高鳴ったり、ワクワクした瞬間はどんな時でしたか？',
            placeholder: '',
            // options removed for chat-only experience
            nextStepId: 'chat_loop',
        },
    },
};
