import { ActivityDefinition } from '@/types/activity';

export const a1_moyamoya: ActivityDefinition = {
    id: 'a1-moyamoya',
    title: '今日のモヤモヤを整理する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '今、一番モヤモヤしていることは何ですか。\n一つで大丈夫なので、思いつくままに書いてみてください。',
            placeholder: '進路が決まらなくて焦っている...',
            multiline: true,
            nextStepId: 'intensity',
        },
        intensity: {
            id: 'intensity',
            type: 'text',
            message: 'そのモヤモヤの強さは、1〜10でいうとどれくらいですか？\n（10が最大、1が最小）',
            placeholder: '8',
            nextStepId: 'category',
        },
        category: {
            id: 'category',
            type: 'text',
            message: 'これは、どんな種類の悩みに近いですか？\n（進路、勉強、人間関係、お金、体調、その他、から選んで書いてください）',
            placeholder: '進路',
            nextStepId: 'ideal_state',
        },
        ideal_state: {
            id: 'ideal_state',
            type: 'text',
            message: 'そのモヤモヤが少し楽になるとしたら、\nどんな状態になっているとよさそうですか。',
            placeholder: 'やりたいことが1つでも見つかっている状態',
            multiline: true,
            nextStepId: 'summary',
        },
        summary: {
            id: 'summary',
            type: 'summary',
            message: 'まとめると、こんな感じでしょうか。',
            summaryContent: {
                title: 'モヤモヤ整理シート',
                items: [
                    { label: 'モヤモヤ', value: '{intro}' },
                    { label: '強さ', value: '{intensity}' },
                    { label: 'カテゴリ', value: '{category}' },
                    { label: '望む状態', value: '{ideal_state}' },
                ],
            },
            nextStepId: 'confirmation',
        },
        confirmation: {
            id: 'confirmation',
            type: 'text',
            message: 'このまとめは、今の気持ちに近いですか？\n「はい」か「いいえ」で教えてください。',
            placeholder: 'はい',
            nextStepId: 'complete', // In a real app, we'd parse the text to branch
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '教えてくれてありがとうございます。\nモヤモヤを言葉にするだけでも、少し整理が進みます。\nこの内容は「マイページ」に保存しておきますね。',
            isFinal: true,
        },
    },
};
