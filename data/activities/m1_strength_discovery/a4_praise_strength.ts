import { ActivityDefinition } from '@/types/activity';

export const a4_praise_strength: ActivityDefinition = {
    id: 'a4-praise-strength',
    title: '評価された行動から強みを探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「人から褒められた経験」や「感謝された経験」を深掘りし、そこから「客観的な強み」を特定してください。
    
    # ルール
    - ユーザーが謙遜しても、「それは素晴らしい才能です」と肯定的にフィードバックしてください。
    - 「具体的にどんな言葉をかけられましたか？」「その時、自分ではどう思いましたか？」と問いかけてください。
    - 3〜5往復程度の会話を通じて、他者から見たユーザーの強みを言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでの経験で、人から褒められたり、感謝されて嬉しかったことはありますか？\n些細なことでも構いません。',
            placeholder: '',
            options: [
                { label: '資料が見やすいと褒められた', value: '資料が見やすいと褒められた' },
                { label: '相談に乗ってくれて助かると言われた', value: '相談に乗ってくれて助かると言われた' },
                { label: '行動が早いと驚かれた', value: '行動が早いと驚かれた' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
