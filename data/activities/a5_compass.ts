import { ActivityDefinition } from '@/types/activity';

export const a5_compass: ActivityDefinition = {
    id: 'a5-compass',
    title: '自分コンパスを一行で作る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'message_only',
            message: 'ここまでの振り返りから、\nあなたの「自分コンパス」を作りましょう。\n\nこれまで分かったこと：\n・価値観：自分のペース、成長実感\n・強み：創造性、継続力\n・好きなこと：何かを作ること',
            nextStepId: 'proposal',
        },
        proposal: {
            id: 'proposal',
            type: 'summary',
            message: 'これらをもとに、AIがあなたの一行プロフィールを作りました。',
            summaryContent: {
                title: '自分コンパス（案）',
                items: [
                    { label: 'プロフィール', value: '私は自分のペースで成長することを大切にして、何かを創り出す時に力を発揮するタイプです。' },
                ],
            },
            nextStepId: 'evaluation',
        },
        evaluation: {
            id: 'evaluation',
            type: 'button',
            message: 'しっくりきますか？',
            options: [
                { label: 'かなり近い', value: 'good', nextStepId: 'complete' },
                { label: 'まあまあ近い', value: 'ok', nextStepId: 'edit' },
                { label: 'あまり近くない', value: 'bad', nextStepId: 'edit' },
            ],
        },
        edit: {
            id: 'edit',
            type: 'text',
            message: 'より自分らしくするために、修正したいポイントを教えてください。\nあるいは、自分で書き直してみましょう。',
            placeholder: '私は〇〇を大切にして、〇〇なときに一番力を発揮するタイプです。',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '保存しました！\nこれがあなたの「自分コンパス」です。\n迷ったときは、この言葉に立ち返ってみましょう。',
            isFinal: true,
        },
    },
};
