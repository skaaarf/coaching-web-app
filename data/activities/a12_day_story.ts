import { ActivityDefinition } from '@/types/activity';

export const a12_day_story: ActivityDefinition = {
    id: 'a12-day-story',
    title: '仕事の一日ストーリーを読む',
    style: 'selection',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'button',
            message: 'ある職業の「一日」を見てみましょう。\n（※実際のアプリではストーリーが表示されます）\n\n読んでみて、どう感じましたか？',
            options: [
                { label: '楽しそう！', value: 'fun', nextStepId: 'complete' },
                { label: '普通かな', value: 'normal', nextStepId: 'complete' },
                { label: '大変そう...', value: 'hard', nextStepId: 'complete' },
            ],
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '感想をありがとうございます。\nリアルな一日を知ると、イメージが具体的になりますね。',
            isFinal: true,
        },
    },
};
