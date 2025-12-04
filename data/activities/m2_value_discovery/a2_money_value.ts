import { ActivityDefinition } from '@/types/activity';

export const a2_money_value: ActivityDefinition = {
    id: 'a2-money-value',
    title: 'お金の使い方から価値観を探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「お金の使い方」を深掘りし、そこから「何に幸福を感じるか（価値観）」を特定してください。
    
    # ルール
    - お金の使い道にはその人の価値観が色濃く出ます。「なぜそれに価値を感じたのですか？」と聞いてください。
    - 浪費や贅沢も否定せず、「それによってどんな気持ちが得られましたか？」と体験の質に注目してください。
    - 3〜5往復程度の会話を通じて、ユーザーの幸福の源泉を言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでに「お金を払って本当に良かった」と思った経験は何ですか？\n高価なものでなくても構いません。',
            placeholder: '',
            options: [
                { label: '海外旅行', value: '海外旅行' },
                { label: '友人との食事会', value: '友人との食事会' },
                { label: '本や教材', value: '本や教材' },
                { label: '趣味の道具', value: '趣味の道具' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
