import { ActivityDefinition } from '@/types/activity';

export const d5_apply_plan: ActivityDefinition = {
    id: 'd5-apply-plan',
    title: '最初の応募プランを三件決める',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '具体的に、どんな募集に応募してみますか？\n「〇〇業界の長期インターン」など、3つほど挙げてみましょう。',
            placeholder: '例：ITベンチャーの営業インターン、Webメディアのライター...',
            multiline: true,
            nextStepId: 'deadline',
        },
        deadline: {
            id: 'deadline',
            type: 'text',
            message: 'いつまでに応募しますか？',
            placeholder: '例：今週末までに',
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'プラン決定です！\nまずは応募ボタンを押すところからスタートです。',
            isFinal: true,
        },
    },
};
