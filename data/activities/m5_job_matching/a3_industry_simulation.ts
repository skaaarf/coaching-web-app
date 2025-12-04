import { ActivityDefinition } from '@/types/activity';

export const a3_industry_simulation: ActivityDefinition = {
    id: 'a3-industry-simulation',
    title: '業界の一日を体験する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'message_only',
            message: 'コンサルタントの1日を体験してみましょう。\nシミュレーション形式で進みます。',
            nextStepId: 'morning',
        },
        morning: {
            id: 'morning',
            type: 'button',
            message: '【朝9時】\nクライアントから「売上が伸びない」と相談されました。\nあなたならどうする？',
            options: [
                { label: 'A. まずデータを分析する', value: 'data', nextStepId: 'afternoon' },
                { label: 'B. ヒアリングして課題を整理する', value: 'hearing', nextStepId: 'afternoon' },
                { label: 'C. 競合分析から始める', value: 'competitor', nextStepId: 'afternoon' },
            ],
        },
        afternoon: {
            id: 'afternoon',
            type: 'button',
            message: '【午後2時】\nチームメンバーが意見を対立させています。\nあなたならどうする？',
            options: [
                { label: 'A. 両方の意見を整理して、共通点を探す', value: 'organize', nextStepId: 'feedback' },
                { label: 'B. データで判断する', value: 'data', nextStepId: 'feedback' },
                { label: 'C. 上司に相談する', value: 'boss', nextStepId: 'feedback' },
            ],
        },
        feedback: {
            id: 'feedback',
            type: 'text',
            message: '良い選択です！あなたの『構造化力』が活きていますね。\n\nこの仕事、楽しそうでしたか？それとも大変そうでしたか？',
            placeholder: '',
            options: [
                { label: '頭を使うけど楽しそう', value: '頭を使うけど楽しそう' },
                { label: 'プレッシャーがかかりそうで大変そう', value: 'プレッシャーがかかりそうで大変そう' },
            ],
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'お疲れ様でした！\n実際の業務イメージを持つことで、ミスマッチを防ぐことができます。\n興味が湧いたら、さらに詳しく調べてみましょう。',
            isFinal: true,
        },
    },
};
