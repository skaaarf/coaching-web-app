import { ActivityDefinition } from '@/types/activity';

export const b5_feedback: ActivityDefinition = {
    id: 'b5-feedback',
    title: '進路くんからの改善フィードバックを受け取る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '添削してほしい文章（ガクチカや自己PR）を貼り付けてください。',
            placeholder: 'ここに文章をペースト',
            multiline: true,
            nextStepId: 'feedback',
        },
        feedback: {
            id: 'feedback',
            type: 'message_only',
            message: 'ありがとうございます。\n（※AIが分析中...）\n\nとても具体的なエピソードですね！\n「結果」の部分にもう少し数字を入れると、より説得力が増すと思います。',
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'フィードバックを参考に、さらにブラッシュアップしていきましょう！',
            isFinal: true,
        },
    },
};
