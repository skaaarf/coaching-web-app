import { ActivityDefinition } from '@/types/activity';

export const a7_options_pro_con: ActivityDefinition = {
    id: 'a7-options-pro-con',
    title: '各選択肢の良い点・不安な点を整理する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '先ほど挙げた選択肢の中から、詳しく考えたいものを一つ選んでください。',
            placeholder: '例：A大学',
            nextStepId: 'pros',
        },
        pros: {
            id: 'pros',
            type: 'text',
            message: 'その選択肢の「良い点」「魅力的な点」はどこですか？',
            placeholder: '例：カリキュラムが充実している、雰囲気が良い',
            multiline: true,
            nextStepId: 'cons',
        },
        cons: {
            id: 'cons',
            type: 'text',
            message: '逆に、「不安な点」や「懸念点」はありますか？',
            placeholder: '例：通学が遠い、倍率が高い',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'メリットとデメリットが整理できました。\nこれを他の選択肢でも繰り返すと、比較しやすくなりますよ。',
            isFinal: true,
        },
    },
};
