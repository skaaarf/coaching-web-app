import { ActivityDefinition } from '@/types/activity';

export const a3_learn_from_role_model: ActivityDefinition = {
    id: 'a3-learn-from-role-model',
    title: 'ロールモデルから学ぶ',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '身近に「こんな風になりたい」と思う先輩や大人はいますか？\n家族、先生、バイト先の先輩など、誰でもOKです。',
            placeholder: '',
            options: [
                { label: 'バイト先の店長', value: 'バイト先の店長' },
                { label: '部活の顧問', value: '部活の顧問' },
                { label: '親', value: '親' },
            ],
            nextStepId: 'charm',
        },
        charm: {
            id: 'charm',
            type: 'text',
            message: 'その人のどこが魅力的ですか？',
            placeholder: '',
            options: [
                { label: 'いつも冷静で、トラブルにも動じないところ', value: 'いつも冷静で、トラブルにも動じないところ' },
                { label: '誰に対しても平等なところ', value: '誰に対しても平等なところ' },
            ],
            nextStepId: 'imitate',
        },
        imitate: {
            id: 'imitate',
            type: 'text',
            message: 'その人のどんな行動や考え方を真似したいですか？',
            placeholder: '',
            options: [
                { label: '相手の話を最後まで聞く姿勢', value: '相手の話を最後まで聞く姿勢' },
                { label: '常に笑顔でいること', value: '常に笑顔でいること' },
            ],
            nextStepId: 'negative_model',
        },
        negative_model: {
            id: 'negative_model',
            type: 'text',
            message: '逆に、「こうはなりたくない」と思う人はいますか？（名前は出さなくて大丈夫です）',
            placeholder: '',
            options: [
                { label: 'いつもイライラしている人', value: 'いつもイライラしている人' },
                { label: '自分の話ばかりする人', value: '自分の話ばかりする人' },
            ],
            nextStepId: 'analysis',
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: 'ありがとうございます。\n身近なロールモデルは、具体的な行動指針になりますね。\nあなたが大切にしたいのは『精神的な余裕』や『誠実さ』かもしれません。',
            isFinal: true,
        },
    },
};
