import { ActivityDefinition } from '@/types/activity';

export const a5_role_model: ActivityDefinition = {
    id: 'a5-role-model',
    title: '尊敬する人からキャリア志向を探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「尊敬する人」や「憧れの人」を深掘りし、そこから「理想のキャリア像」や「キャリア・アンカー（譲れない価値観）」を特定してください。
    
    # ルール
    - その人の「どんな部分」に惹かれるのかを具体的に聞いてください。
    - 「その人のようになれたら、どんな生活を送りたいですか？」と理想の未来をイメージさせてください。
    - 3〜5往復程度の会話を通じて、ユーザーが目指したい方向性を言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '尊敬する人や、「こんな風になりたい」と思う憧れの人はいますか？\n有名人、先輩、キャラクターなど、誰でもOKです。',
            placeholder: '',
            options: [
                { label: '自由に働いている先輩', value: '自由に働いている先輩' },
                { label: 'スティーブ・ジョブズ', value: 'スティーブ・ジョブズ' },
                { label: 'いつも笑顔で周りを明るくする友人', value: 'いつも笑顔で周りを明るくする友人' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
