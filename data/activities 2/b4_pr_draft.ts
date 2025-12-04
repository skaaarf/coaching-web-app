import { ActivityDefinition } from '@/types/activity';

export const b4_pr_draft: ActivityDefinition = {
    id: 'b4-pr-draft',
    title: '自己PRを四百文字で書いてみる',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'あなたの「一番の強み」を一言で言うと？',
            placeholder: '例：相手の立場に立って考える力',
            nextStepId: 'episode',
        },
        episode: {
            id: 'episode',
            type: 'text',
            message: 'その強みが発揮された具体的なエピソードを教えてください。',
            placeholder: '例：サークルの新歓活動で...',
            multiline: true,
            nextStepId: 'draft',
        },
        draft: {
            id: 'draft',
            type: 'text',
            message: 'それらを組み合わせて、自己PRの文章を書いてみましょう。\n（下書きでOKです！）',
            placeholder: '私の強みは...です。具体的には...',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'お疲れ様でした！\n自分の言葉で書くことで、想いが伝わる文章になります。',
            isFinal: true,
        },
    },
};
