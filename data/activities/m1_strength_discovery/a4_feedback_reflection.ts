import { ActivityDefinition } from '@/types/activity';

export const a4_feedback_reflection: ActivityDefinition = {
    id: 'a4-feedback-reflection',
    title: '周りからの評価を振り返る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '友人や先輩から「あなたって〇〇だよね」と言われたことはありますか？\n良いことでも、ちょっとしたことでも構いません。',
            placeholder: '',
            options: [
                { label: '真面目だよね', value: '真面目だよね' },
                { label: '話しやすいよね', value: '話しやすいよね' },
                { label: '責任感が強いよね', value: '責任感が強いよね' },
            ],
            nextStepId: 'self_perception',
        },
        self_perception: {
            id: 'self_perception',
            type: 'text',
            message: 'その評価は当たっていると思いますか？',
            options: [
                { label: '当たっている', value: 'yes', nextStepId: 'unexpected' },
                { label: 'あまり当たっていない', value: 'no', nextStepId: 'unexpected' },
            ],
        },
        unexpected: {
            id: 'unexpected',
            type: 'text',
            message: '意外だった評価や、自分では気づいていなかった強みはありましたか？',
            placeholder: '',
            options: [
                { label: 'リーダーシップがあると言われたこと', value: 'リーダーシップがあると言われたこと' },
                { label: '意外と繊細だと言われたこと', value: '意外と繊細だと言われたこと' },
            ],
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'ありがとうございます。\n客観的な視点は、自分では気づかない強みを見つける大きなヒントになります。\nこれもあなたの強みとして記録しておきますね。',
            isFinal: true,
        },
    },
};
