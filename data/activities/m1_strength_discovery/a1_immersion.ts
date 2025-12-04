import { ActivityDefinition } from '@/types/activity';

export const a1_immersion: ActivityDefinition = {
    id: 'a1-immersion',
    title: '没頭体験から強みを探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「没頭体験」を深掘りし、そこから「強み」や「才能」を特定してください。
    
    # ルール
    - ユーザーの話に共感し、肯定的に受け止めてください。
    - 「なぜ？」と問いかけることで、行動の動機や感情を深掘りしてください。
    - 3〜5往復程度の会話を通じて、ユーザーが気づいていない「強み」を言語化してください。
    - 最後に「あなたの強みは〇〇ですね」とまとめてください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでの人生で、時間を忘れて没頭した経験はありますか？\nゲーム、趣味、勉強、仕事など、どんなことでも構いません。',
            placeholder: '',
            options: [
                { label: 'ゲームに熱中して朝までやった', value: 'ゲームに熱中して朝までやった' },
                { label: '文化祭の準備に没頭した', value: '文化祭の準備に没頭した' },
                { label: 'プログラミングのエラー解決', value: 'プログラミングのエラー解決' },
            ],
            nextStepId: 'chat_loop', // In dynamic mode, this is ignored after first step, but good to have
        },
    },
};
