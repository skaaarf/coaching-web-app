import { ActivityDefinition } from '@/types/activity';

export const a1_negative_values: ActivityDefinition = {
    id: 'a1-negative-values',
    title: '許せない行動から価値観を探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「許せない行動」や「嫌いなこと」を深掘りし、その裏返しにある「大切にしたい価値観」を特定してください。
    
    # ルール
    - ネガティブな感情も「大切な価値観の裏返し」として肯定的に捉え直してください。
    - 「なぜそれが許せないと思いますか？」「逆にどうあってほしいですか？」と問いかけてください。
    - 3〜5往復程度の会話を通じて、ユーザーの譲れない軸を言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '他人の行動を見て、「これは許せない」「嫌だな」と強く感じたことはありますか？',
            placeholder: '',
            options: [
                { label: '約束を破る人', value: '約束を破る人' },
                { label: '嘘をつく人', value: '嘘をつく人' },
                { label: '他人の悪口を言う人', value: '他人の悪口を言う人' },
                { label: '責任転嫁する人', value: '責任転嫁する人' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
