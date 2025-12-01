import { ActivityDefinition } from '@/types/activity';

export const a2_recent_success: ActivityDefinition = {
    id: 'a2-recent-success',
    title: '最近頑張ったことを整理する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'この一年くらいで\n『あの時はけっこう頑張ったな』と思える出来事を一つ教えてください。\n学校・仕事・部活・アルバイト・サークルなど、どこでも大丈夫です。',
            placeholder: '例：文化祭のクラス企画',
            nextStepId: 'situation',
        },
        situation: {
            id: 'situation',
            type: 'text',
            message: 'その時の状況を、簡単に教えてください。\nどんな場面で、誰と、何をしていましたか。',
            placeholder: '例：クラス全員で映画を作ることになり、監督を任された',
            multiline: true,
            nextStepId: 'goal',
        },
        goal: {
            id: 'goal',
            type: 'text',
            message: 'そのとき、あなたはどんなゴールを目指していましたか。',
            placeholder: '例：全員が楽しめる作品を作ること',
            multiline: true,
            nextStepId: 'action',
        },
        action: {
            id: 'action',
            type: 'text',
            message: 'ゴールに向けて、あなたはどんな工夫や行動をしましたか。',
            placeholder: '例：意見が割れた時に話し合いの場を設けた',
            multiline: true,
            nextStepId: 'result',
        },
        result: {
            id: 'result',
            type: 'text',
            message: 'その結果、どうなりましたか。\n成功・失敗は気にせず、そのまま教えてください。',
            placeholder: '例：無事完成し、クラスの仲が深まった',
            multiline: true,
            nextStepId: 'strength',
        },
        strength: {
            id: 'strength',
            type: 'text',
            message: 'この出来事の中で\n『自分の強みっぽいな』と思えるポイントを一つ挙げるとしたら、何ですか。\n例としては、粘り強さ、計画性、巻き込み力、好奇心 などがあります。',
            placeholder: '例：巻き込み力',
            nextStepId: 'summary',
        },
        summary: {
            id: 'summary',
            type: 'summary',
            message: 'エピソードを整理しました！',
            summaryContent: {
                title: '頑張ったこと記録',
                items: [
                    { label: '出来事', value: '{intro}' },
                    { label: '強み候補', value: '{strength}' },
                    { label: '状況', value: '{situation}' },
                    { label: '行動', value: '{action}' },
                ],
            },
            nextStepId: 'confirmation',
        },
        confirmation: {
            id: 'confirmation',
            type: 'button',
            message: 'このまとめで、強みのイメージは近そうですか。',
            options: [
                { label: '近い', value: 'yes', nextStepId: 'complete' },
                { label: '少し違う', value: 'no', nextStepId: 'correction' },
            ],
        },
        correction: {
            id: 'correction',
            type: 'text',
            message: 'どのあたりが違いますか？',
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'ありがとうございます！\nあなたの強みのタネが見つかりました。\nこれは後の自己PR作成でも役立ちますよ。',
            isFinal: true,
        },
    },
};
