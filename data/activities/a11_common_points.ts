import { ActivityDefinition } from '@/types/activity';

export const a11_common_points: ActivityDefinition = {
    id: 'a11-common-points',
    title: '選んだ人たちの共通点と違いを言葉にする',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '先ほど選んだ人たちに、何か共通点はありますか？\n「楽しそう」「自由そう」「専門性がある」など、なんでもOKです。',
            placeholder: '例：みんな自分の仕事に誇りを持っている',
            multiline: true,
            nextStepId: 'diff',
        },
        diff: {
            id: 'diff',
            type: 'text',
            message: '逆に、それぞれ違うところはありますか？',
            placeholder: '例：働き方のスタイルはバラバラ',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '分析ありがとうございます。\nあなたが「何に惹かれるか」のヒントが見えてきましたね。',
            isFinal: true,
        },
    },
};
