import { ActivityDefinition } from '@/types/activity';

export const c2_axis: ActivityDefinition = {
    id: 'c2-axis',
    title: '就活・転職の軸を三つに絞る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '会社選びで「これだけは譲れない」という軸を3つ挙げてください。',
            placeholder: '例：成長できる環境、人間関係が良い、給与が高い',
            multiline: true,
            nextStepId: 'priority',
        },
        priority: {
            id: 'priority',
            type: 'text',
            message: 'その中で、あえて1位を決めるならどれですか？',
            placeholder: '例：人間関係が良いこと',
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '軸が定まると、迷った時の判断基準になります。\nこの3つを大切にしましょう。',
            isFinal: true,
        },
    },
};
