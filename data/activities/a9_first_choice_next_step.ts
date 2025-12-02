import { ActivityDefinition } from '@/types/activity';

export const a9_first_choice_next_step: ActivityDefinition = {
    id: 'a9-first-choice-next-step',
    title: '仮の第一候補と次の一歩を決める',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでの整理を踏まえて、現時点での「第一候補」はどれですか？\nまだ仮で構いません。',
            placeholder: '例：A大学への進学',
            nextStepId: 'next_step',
        },
        next_step: {
            id: 'next_step',
            type: 'text',
            message: 'その候補に向けて、直近（今日〜来週）でできる「次の一歩」は何でしょう？\n小さなことでOKです。',
            placeholder: '例：オープンキャンパスの日程を調べる、資料請求する',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '方針が決まりましたね！\nまずはその一歩を踏み出してみましょう。応援しています。',
            isFinal: true,
        },
    },
};
