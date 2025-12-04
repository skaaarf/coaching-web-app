import { ActivityDefinition } from '@/types/activity';

export const a4_legacy_values: ActivityDefinition = {
    id: 'a4-legacy-values',
    title: '伝えたい価値観を探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーが「後世に伝えたいこと」を深掘りし、そこから「人生で最も大切にしたい価値観（コア・バリュー）」を特定してください。
    
    # ルール
    - 「なぜそれを伝えたいのですか？」と理由を深く聞いてください。
    - 伝えたい言葉＝その人が人生で証明したいこと、です。
    - 3〜5往復程度の会話を通じて、ユーザーの人生の軸を言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'もし将来、自分の子供や後輩に「これだけは大切にしてほしい」と伝えるとしたら、何と言いますか？',
            placeholder: '',
            options: [
                { label: '自分の気持ちに正直に生きること', value: '自分の気持ちに正直に生きること' },
                { label: '人との縁を大切にすること', value: '人との縁を大切にすること' },
                { label: '失敗を恐れずに挑戦すること', value: '失敗を恐れずに挑戦すること' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
