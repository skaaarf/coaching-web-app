import { ActivityDefinition } from '@/types/activity';

export const c4_focus: ActivityDefinition = {
    id: 'c4-focus',
    title: 'どこにどれくらい時間とエネルギーを使うか決める',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '受ける企業を「本命群」と「滑り止め・練習群」に分けてみましょう。\n本命はどこですか？',
            placeholder: '例：A社、B社',
            multiline: true,
            nextStepId: 'allocation',
        },
        allocation: {
            id: 'allocation',
            type: 'text',
            message: '時間の使い方はどう配分しますか？\n（例：本命に8割、他は2割）',
            placeholder: '例：本命の企業研究に時間を割く',
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'リソース配分が決まりました。\nメリハリをつけることで、本命への合格率が高まります。',
            isFinal: true,
        },
    },
};
