import { ActivityDefinition } from '@/types/activity';

export const a1_skill_to_job: ActivityDefinition = {
    id: 'a1-skill-to-job',
    title: 'スキルから職種を探す',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'message_only',
            message: 'これまでの分析結果から、あなたの強みをリスト化しました。\n\nあなたの強みは：\n・構造化力\n・創造的思考\n・粘り強さ',
            nextStepId: 'job_suggestion',
        },
        job_suggestion: {
            id: 'job_suggestion',
            type: 'text',
            message: 'この強みが活きる職種は：\n・企画職\n・プロジェクトマネージャー\n・コンサルタント\n・マーケター\n\n気になる職種はありますか？',
            placeholder: '',
            options: [
                { label: '企画職', value: '企画職' },
                { label: 'マーケター', value: 'マーケター' },
                { label: 'コンサルタント', value: 'コンサルタント' },
            ],
            nextStepId: 'detail',
        },
        detail: {
            id: 'detail',
            type: 'message_only',
            message: '企画職は、新しいアイデアを生み出し、プロジェクトを推進する仕事です。\nあなたの『創造的思考』と『構造化力』が活きます。\n\nマーケターは、市場を分析して売れる仕組みを作る仕事です。\nこれもあなたの強みに合っていますね。',
            isFinal: true,
        },
    },
};
