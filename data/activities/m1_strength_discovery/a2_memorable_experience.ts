import { ActivityDefinition } from '@/types/activity';

export const a2_memorable_experience: ActivityDefinition = {
    id: 'a2-memorable-experience',
    title: '印象に残っている経験を語る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '学生時代で最も印象に残っている出来事は何ですか？\n成功体験でも、失敗体験でもOKです。',
            placeholder: '', // Explicitly empty
            options: [
                { label: '部活の最後の大会で負けたこと', value: '部活の最後の大会で負けたこと' },
                { label: '文化祭でリーダーをしたこと', value: '文化祭でリーダーをしたこと' },
            ],
            nextStepId: 'reason',
        },
        reason: {
            id: 'reason',
            type: 'text',
            message: 'なぜそれが印象に残っているんですか？',
            placeholder: '例：本気で取り組んだからこそ悔しかったから',
            nextStepId: 'influence',
        },
        influence: {
            id: 'influence',
            type: 'text',
            message: 'その経験から、今の自分に影響していることはありますか？',
            placeholder: '例：準備の大切さを学んだ',
            nextStepId: 'change',
        },
        change: {
            id: 'change',
            type: 'text',
            message: 'その時の自分と、今の自分で変わったことはありますか？',
            placeholder: '例：失敗を恐れずに挑戦できるようになった',
            nextStepId: 'analysis',
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: 'ありがとうございます。\nこの経験から『粘り強さ』や『成長意欲』が強みとして見えてきますね。\n貴重なエピソードを教えていただきありがとうございました。',
            isFinal: true,
        },
    },
};
