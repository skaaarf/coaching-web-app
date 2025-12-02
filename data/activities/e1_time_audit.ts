import { ActivityDefinition } from '@/types/activity';

export const e1_time_audit: ActivityDefinition = {
    id: 'e1-time-audit',
    title: '時間の使い方を棚卸しする',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '昨日のあなたの1日を振り返ってみましょう。\n何にどれくらいの時間を使いましたか？',
            placeholder: '例：睡眠7時間、スマホ3時間、勉強2時間...',
            multiline: true,
            nextStepId: 'audit',
        },
        audit: {
            id: 'audit',
            type: 'text',
            message: 'その中で、「将来のためになった時間」と「無駄だったかもと思う時間」はどれですか？',
            placeholder: '例：勉強はよかったけど、スマホを見すぎた',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '時間の使い方のクセが見えてきましたね。\n意識するだけで、明日の使い方は変わりますよ。',
            isFinal: true,
        },
    },
};
