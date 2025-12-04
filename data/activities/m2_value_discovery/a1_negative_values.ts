import { ActivityDefinition } from '@/types/activity';

export const a1_negative_values: ActivityDefinition = {
    id: 'a1-negative-values',
    title: '許せない行動から価値観を探る',
    style: 'chat',
    mode: 'dynamic_chat',

    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '他人の行動を見て、「これは許せない」「嫌だな」と強く感じたことはありますか？',
            placeholder: '',
            // options removed for chat-only experience
            nextStepId: 'chat_loop',
        },
    },
};
