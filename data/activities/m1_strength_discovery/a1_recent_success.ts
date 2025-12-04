import { ActivityDefinition } from '@/types/activity';

export const a1_recent_success: ActivityDefinition = {
    id: 'a1-recent-success',
    title: '最近頑張ったことを振り返る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '最近、頑張ったことや達成したことを教えてください。\n学業、サークル、バイト、インターン、なんでもOKです。',
            placeholder: '',
            options: [
                { label: '文化祭のクラス企画でリーダーを務めた', value: '文化祭のクラス企画でリーダーを務めた' },
                { label: '部活動の大会で優勝を目指した', value: '部活動の大会で優勝を目指した' },
            ],
            nextStepId: 'effort',
        },
        effort: {
            id: 'effort',
            type: 'text',
            message: 'それをやり遂げるために、どんな工夫をしましたか？',
            placeholder: '',
            options: [
                { label: 'メンバーの意見を聞く場を設けた', value: 'メンバーの意見を聞く場を設けた' },
                { label: '毎日コツコツ練習を続けた', value: '毎日コツコツ練習を続けた' },
            ],
            nextStepId: 'strength_reflection',
        },
        strength_reflection: {
            id: 'strength_reflection',
            type: 'text',
            message: 'その経験で、自分の何が活きたと思いますか？',
            placeholder: '',
            options: [
                { label: '調整力', value: '調整力' },
                { label: '継続力', value: '継続力' },
                { label: 'リーダーシップ', value: 'リーダーシップ' },
            ],
            nextStepId: 'reaction',
        },
        reaction: {
            id: 'reaction',
            type: 'text',
            message: '周りからどんな反応がありましたか？',
            placeholder: '',
            options: [
                { label: 'ありがとうと言われた', value: 'ありがとうと言われた' },
                { label: '頼りになると言われた', value: '頼りになると言われた' },
            ],
            nextStepId: 'improvement',
        },
        improvement: {
            id: 'improvement',
            type: 'text',
            message: 'もう一度やるとしたら、何を変えますか？',
            placeholder: '',
            options: [
                { label: 'もっと早めに準備を始める', value: 'もっと早めに準備を始める' },
                { label: '周りをもっと頼る', value: '周りをもっと頼る' },
            ],
            nextStepId: 'analysis',
        },
        analysis: {
            id: 'analysis',
            type: 'text',
            message: 'ありがとうございます。お話を聞いて、あなたの強みは『構造化力』や『調整力』かもしれませんね。\nこの理解で合っていますか？',
            options: [
                { label: '合っている', value: 'yes', nextStepId: 'complete' },
                { label: '少し違う', value: 'no', nextStepId: 'correction' },
            ],
        },
        correction: {
            id: 'correction',
            type: 'text',
            message: 'どのあたりが違いますか？また、ご自身ではどんな強みがあると思いますか？',
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'ありがとうございます！\nあなたの強みのエピソードとして記録しました。',
            isFinal: true,
        },
    },
};
