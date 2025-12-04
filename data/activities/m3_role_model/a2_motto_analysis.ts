import { ActivityDefinition } from '@/types/activity';

export const a2_motto_analysis: ActivityDefinition = {
    id: 'a2-motto-analysis',
    title: '座右の銘から軸を探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「座右の銘」や「好きな言葉」を深掘りし、そこから「行動指針」や「判断軸」を特定してください。
    
    # ルール
    - その言葉がなぜ響くのか、その言葉に支えられた経験があるかを聞いてください。
    - 「迷った時にどう判断しますか？」と意思決定のスタイルを紐解いてください。
    - 3〜5往復程度の会話を通じて、ユーザーの行動原理を言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'あなたの好きな言葉や、座右の銘はありますか？\nもしなければ、大切にしている考え方を教えてください。',
            placeholder: '',
            options: [
                { label: '継続は力なり', value: '継続は力なり' },
                { label: '一期一会', value: '一期一会' },
                { label: '七転び八起き', value: '七転び八起き' },
                { label: '為せば成る', value: '為せば成る' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
