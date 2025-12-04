import { ActivityDefinition } from '@/types/activity';

export const a19_consult_memo: ActivityDefinition = {
    id: 'a19-consult-memo',
    title: '担任や先生に相談するためのメモを作る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '先生や保護者の方に相談したいことは何ですか？\n不安なことや、確認したいことを書き出してみましょう。',
            placeholder: '例：求人票の見方がわからない、面接練習をしてほしい',
            multiline: true,
            nextStepId: 'summary',
        },
        summary: {
            id: 'summary',
            type: 'summary',
            message: '相談メモを作成しました。',
            summaryContent: {
                title: '先生への相談メモ',
                items: [
                    { label: '相談内容', value: '{intro}' },
                ],
            },
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'このメモを見せながら相談すれば、スムーズに話せるはずです。\n勇気を出して聞いてみましょう！',
            isFinal: true,
        },
    },
};
