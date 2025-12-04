import { ActivityDefinition } from '@/types/activity';

export const a1_role_model_analysis: ActivityDefinition = {
    id: 'a1-role-model-analysis',
    title: 'ロールモデル分析',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「ロールモデル（憧れの人）」を深掘りし、そこから「理想のキャリア像」や「目指すリーダーシップ像」を特定してください。
    
    # ルール
    - 憧れの人のどんな要素に惹かれているのか（成果、人格、生き方など）を具体的に聞いてください。
    - 「その人のようになれたら、どんなことをしたいですか？」と未来のイメージを広げてください。
    - 3〜5往復程度の会話を通じて、ユーザーの目指す方向性を言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '尊敬する人、または「こうなりたい」と刺激を受ける人は誰ですか？\n有名人、歴史上の人物、身近な人、誰でも構いません。',
            placeholder: '',
            options: [
                { label: 'スティーブ・ジョブズ', value: 'スティーブ・ジョブズ' },
                { label: '坂本龍馬', value: '坂本龍馬' },
                { label: '部活の先輩', value: '部活の先輩' },
                { label: '親', value: '親' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
