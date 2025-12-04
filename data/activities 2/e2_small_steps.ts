import { ActivityDefinition } from '@/types/activity';

export const e2_small_steps: ActivityDefinition = {
    id: 'e2-small-steps',
    title: '一ヶ月の目標をスモールステップに分解する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '今月達成したい目標を一つ教えてください。',
            placeholder: '例：TOEICで600点取る',
            nextStepId: 'breakdown',
        },
        breakdown: {
            id: 'breakdown',
            type: 'text',
            message: 'それを達成するために、今週やるべきことは何ですか？\nできるだけ具体的に書いてみましょう。',
            placeholder: '例：単語帳を50ページ進める',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '大きな目標も、小さく分解すれば達成できます。\nまずは今週のタスクから始めましょう！',
            isFinal: true,
        },
    },
};
