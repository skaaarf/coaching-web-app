import { ActivityDefinition } from '@/types/activity';

export const c5_action_plan: ActivityDefinition = {
    id: 'c5-action-plan',
    title: '直近二週間のアクションプランを作る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '今日から2週間でやるべきことを、3つ挙げてみましょう。',
            placeholder: '例：ESを1通出す、OB訪問を1件する、自己分析を終わらせる',
            multiline: true,
            nextStepId: 'schedule',
        },
        schedule: {
            id: 'schedule',
            type: 'text',
            message: 'それをいつやりますか？\n具体的な日時を決めると実行しやすくなります。',
            placeholder: '例：ESは今週の水曜日まで',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'プランができました！\nあとは実行あるのみです。応援しています！',
            isFinal: true,
        },
    },
};
