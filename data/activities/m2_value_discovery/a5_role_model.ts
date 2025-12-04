import { ActivityDefinition } from '@/types/activity';

export const a5_role_model: ActivityDefinition = {
    id: 'a5-role-model',
    title: '尊敬する人からキャリア志向を探る',
    style: 'chat',
    mode: 'dynamic_chat',

    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '尊敬する人や、「こんな風になりたい」と思う憧れの人はいますか？\n有名人、先輩、キャラクターなど、誰でもOKです。',
            placeholder: '',
            // options removed for chat-only experience
            nextStepId: 'chat_loop',
        },
    },
};
