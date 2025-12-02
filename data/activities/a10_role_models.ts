import { ActivityDefinition } from '@/types/activity';

export const a10_role_models: ActivityDefinition = {
    id: 'a10-role-models',
    title: '気になる先輩・ロールモデルを選ぶ',
    style: 'selection',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'button',
            message: '進路図鑑の中から、直感で「いいな」「気になる」と思う人を3人選んでみましょう。\n（※実際のアプリではここで人物カードが表示されます）',
            options: [
                { label: '選びました', value: 'selected', nextStepId: 'complete' },
            ],
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'ありがとうございます。\n選んだ人たちには、あなたの「理想」が隠れているかもしれません。',
            isFinal: true,
        },
    },
};
