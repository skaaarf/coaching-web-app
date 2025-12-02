import { ActivityDefinition } from '@/types/activity';

export const a18_prep_check: ActivityDefinition = {
    id: 'a18-prep-check',
    title: 'その職種に向けて今からできる準備を知る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '気になっている職種を一つ教えてください。',
            placeholder: '例：販売スタッフ',
            nextStepId: 'gap',
        },
        gap: {
            id: 'gap',
            type: 'text',
            message: 'その仕事に就くために、今の自分に足りないものや、準備が必要そうなことは何だと思いますか？\n（資格、成績、体力など）',
            placeholder: '例：体力が必要そう、敬語が苦手',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '現状の把握ができましたね。\n早めに準備を始めれば、必ず追いつけますよ。',
            isFinal: true,
        },
    },
};
