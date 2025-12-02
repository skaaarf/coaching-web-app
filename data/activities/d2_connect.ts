import { ActivityDefinition } from '@/types/activity';

export const d2_connect: ActivityDefinition = {
    id: 'd2-connect',
    title: '今までの経験とのつながりを考える',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでの経験（部活、バイト、趣味など）で、「もっと深掘りしたい」「活かしたい」と思うことはありますか？',
            placeholder: '例：接客の経験を活かして、もっと営業に近いことをしてみたい',
            multiline: true,
            nextStepId: 'skill',
        },
        skill: {
            id: 'skill',
            type: 'text',
            message: 'その経験を通じて、どんな力を伸ばしたいですか？',
            placeholder: '例：提案力、コミュニケーション力',
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '過去の経験と未来を繋げる視点は素晴らしいです。\nきっと良い成長に繋がりますよ。',
            isFinal: true,
        },
    },
};
