import { ActivityDefinition } from '@/types/activity';

export const b1_gakuchika_list: ActivityDefinition = {
    id: 'b1-gakuchika-list',
    title: 'ガクチカ候補を三つ洗い出す',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '学生時代に力を入れたこと（ガクチカ）の候補を3つ考えてみましょう。\nまずは1つ目、何を頑張りましたか？',
            placeholder: '例：アルバイトでの接客',
            nextStepId: 'second',
        },
        second: {
            id: 'second',
            type: 'text',
            message: '2つ目はどうでしょう？\n1つ目とは違うジャンル（部活、勉強、趣味など）だと良いですね。',
            placeholder: '例：ゼミでの研究発表',
            nextStepId: 'third',
        },
        third: {
            id: 'third',
            type: 'text',
            message: '最後、3つ目は？\n小さなことでも構いません。',
            placeholder: '例：毎日のランニング',
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '3つの候補が出揃いましたね！\nこれだけあれば、相手や状況に合わせて使い分けられます。',
            isFinal: true,
        },
    },
};
