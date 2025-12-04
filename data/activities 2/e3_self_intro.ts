import { ActivityDefinition } from '@/types/activity';

export const e3_self_intro: ActivityDefinition = {
    id: 'e3-self-intro',
    title: '伝わる自己紹介テンプレを作る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '自己紹介の準備をしましょう。\nまず、あなたの「所属」と「名前」を教えてください。',
            placeholder: '例：〇〇大学の山田太郎です',
            nextStepId: 'interest',
        },
        interest: {
            id: 'interest',
            type: 'text',
            message: '今、一番興味があることや、力を入れていることは何ですか？',
            placeholder: '例：プログラミングの勉強をしています',
            multiline: true,
            nextStepId: 'future',
        },
        future: {
            id: 'future',
            type: 'text',
            message: '将来やりたいことや、この場での意気込みを一言！',
            placeholder: '例：将来はエンジニアになりたいです。今日は色々学びたいです',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'バッチリです！\nこれらを繋げれば、どこでも使える自己紹介になりますよ。',
            isFinal: true,
        },
    },
};
