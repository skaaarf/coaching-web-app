import { ActivityDefinition } from '@/types/activity';

export const d3_type_fit: ActivityDefinition = {
    id: 'd3-type-fit',
    title: '自分に合うインターン・バイトのタイプを知る',
    style: 'selection',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'button',
            message: 'どんな環境で働いてみたいですか？',
            options: [
                { label: 'ベンチャーでバリバリ', value: 'venture', nextStepId: 'complete' },
                { label: '落ち着いたオフィスで', value: 'office', nextStepId: 'complete' },
                { label: '接客で賑やかに', value: 'service', nextStepId: 'complete' },
            ],
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'ありがとうございます。\n自分に合った環境を選ぶのが、長く続けるコツです。',
            isFinal: true,
        },
    },
};
