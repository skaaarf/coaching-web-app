import { ActivityDefinition } from '@/types/activity';

export const a6_options_overview: ActivityDefinition = {
    id: 'a6-options-overview',
    title: '今迷っている選択肢を全部出す',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '進路について、今頭にある選択肢をすべて書き出してみましょう。\n進学、就職、転職、あるいは具体的な学校名や企業名でも構いません。',
            placeholder: '例：A大学、B社への転職、フリーランス...',
            multiline: true,
            nextStepId: 'prioritize',
        },
        prioritize: {
            id: 'prioritize',
            type: 'text',
            message: 'ありがとうございます。それぞれの選択肢について、現時点での優先度や「なぜ迷っているか」を一言メモしてみましょう。',
            placeholder: '例：A大学は第一志望だけど学費が...',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '選択肢が可視化されましたね。\n次はこれらを詳しく比較していきましょう。',
            isFinal: true,
        },
    },
};
