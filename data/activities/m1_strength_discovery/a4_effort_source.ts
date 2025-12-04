import { ActivityDefinition } from '@/types/activity';

export const a4_effort_source: ActivityDefinition = {
    id: 'a4-effort-source',
    title: '努力の源泉を探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーが「努力し続けられた経験」を深掘りし、そこから「行動の原動力（ドライバー）」を特定してください。
    
    # ルール
    - ユーザーの努力を称賛し、リスペクトを示してください。
    - 「何があなたを突き動かしましたか？」「辛い時はどう乗り越えましたか？」と動機にフォーカスしてください。
    - 3〜5往復程度の会話を通じて、ユーザーが頑張れる条件や環境を言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでに、辛くても努力し続けられた経験はありますか？\n部活、受験、習い事など、何でも構いません。',
            placeholder: '',
            options: [
                { label: '部活の厳しい練習', value: '部活の厳しい練習' },
                { label: '受験勉強', value: '受験勉強' },
                { label: 'アルバイトでの接客', value: 'アルバイトでの接客' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
