import { ActivityDefinition } from '@/types/activity';

export const b2_gakuchika_draft: ActivityDefinition = {
    id: 'b2-gakuchika-draft',
    title: '一つのガクチカを四百文字にまとめる',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '最もアピールしたいエピソードを一つ選んでください。',
            placeholder: '例：アルバイトでの接客',
            nextStepId: 'challenge',
        },
        challenge: {
            id: 'challenge',
            type: 'text',
            message: 'その活動の中で、ぶつかった「課題」や「困難」は何でしたか？',
            placeholder: '例：お客様からのクレーム対応',
            multiline: true,
            nextStepId: 'action',
        },
        action: {
            id: 'action',
            type: 'text',
            message: 'その課題に対して、あなたはどう考え、どう「行動」しましたか？',
            placeholder: '例：相手の話を最後まで聞き、誠意を持って謝罪した',
            multiline: true,
            nextStepId: 'result',
        },
        result: {
            id: 'result',
            type: 'text',
            message: 'その結果、どうなりましたか？\n数値や周囲の反応があれば教えてください。',
            placeholder: '例：お客様が笑顔になり、リピーターになってくれた',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '要素が揃いました！\nこれらを繋げれば、説得力のあるガクチカ文章になりますよ。',
            isFinal: true,
        },
    },
};
