import { ActivityDefinition } from '@/types/activity';

export const a2_excitement: ActivityDefinition = {
    id: 'a2-excitement',
    title: '胸が高鳴った瞬間を探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「ワクワクした経験」を深掘りし、そこから「モチベーションの源泉」や「好奇心の方向性」を特定してください。
    
    # ルール
    - ユーザーの話に共感し、肯定的に受け止めてください。
    - 「その時どう感じましたか？」「何が一番嬉しかったですか？」と感情にフォーカスして質問してください。
    - 3〜5往復程度の会話を通じて、ユーザーが何に価値を感じるかを言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでの経験で、胸が高鳴ったり、ワクワクした瞬間はどんな時でしたか？',
            placeholder: '',
            options: [
                { label: '新しいアイデアを思いついた時', value: '新しいアイデアを思いついた時' },
                { label: '人前で発表して拍手をもらった時', value: '人前で発表して拍手をもらった時' },
                { label: '難しい問題を解けた時', value: '難しい問題を解けた時' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
