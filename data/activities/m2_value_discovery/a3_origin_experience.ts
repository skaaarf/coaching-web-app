import { ActivityDefinition } from '@/types/activity';

export const a3_origin_experience: ActivityDefinition = {
    id: 'a3-origin-experience',
    title: '原体験から価値観を探る',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「原体験（幼少期〜中学時代の記憶）」を深掘りし、現在の価値観のルーツを特定してください。
    
    # ルール
    - 過去の出来事が今の考え方にどう繋がっているかを紐解いてください。
    - 「その時どう思いましたか？」「今の自分にどう影響していますか？」と問いかけてください。
    - 3〜5往復程度の会話を通じて、ユーザーの人生のルール（信念）を言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '幼少期から中学生くらいまでの間で、今の自分に大きな影響を与えている出来事はありますか？',
            placeholder: '',
            options: [
                { label: '部活でレギュラーになれなかったこと', value: '部活でレギュラーになれなかったこと' },
                { label: '先生に褒められたこと', value: '先生に褒められたこと' },
                { label: '親の仕事を見ていたこと', value: '親の仕事を見ていたこと' },
                { label: '転校して環境が変わったこと', value: '転校して環境が変わったこと' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
