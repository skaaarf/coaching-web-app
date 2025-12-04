import { ActivityDefinition } from '@/types/activity';

export const a1_immersion: ActivityDefinition = {
    id: 'a1-immersion',
    title: '没頭体験から強みを探る',
    style: 'chat',
    mode: 'dynamic_chat',

    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでの人生で、時間を忘れて没頭した経験はありますか？\nゲーム、趣味、勉強、仕事など、どんなことでも構いません。',
            placeholder: '',
            // options removed for chat-only experience
            nextStepId: 'chat_loop', // In dynamic mode, this is ignored after first step, but good to have
        },
    },
};
