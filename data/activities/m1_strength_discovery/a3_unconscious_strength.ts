import { ActivityDefinition } from '@/types/activity';

export const a3_unconscious_strength: ActivityDefinition = {
    id: 'a3-unconscious-strength',
    title: '無意識の強みを探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーが「無意識にやってしまうこと」や「人から感謝されること」を深掘りし、そこから「本質的な強み」を特定してください。
    
    # ルール
    - ユーザーは自分の強みに気づいていないことが多いので、「それはすごいことです！」と積極的に肯定してください。
    - 「具体的にどんな場面でしたか？」「その時どう考えましたか？」と状況を詳しく聞いてください。
    - 3〜5往復程度の会話を通じて、再現性の高い強みを言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '自分では当たり前にやっていたのに、人から感謝されたり驚かれたことはありますか？',
            placeholder: '',
            options: [
                { label: '会議の議事録をまとめたら感謝された', value: '会議の議事録をまとめたら感謝された' },
                { label: '場の空気を読んで発言したら褒められた', value: '場の空気を読んで発言したら褒められた' },
                { label: '細かいミスに気づいたら驚かれた', value: '細かいミスに気づいたら驚かれた' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
