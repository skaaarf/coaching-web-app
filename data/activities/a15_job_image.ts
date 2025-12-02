import { ActivityDefinition } from '@/types/activity';

export const a15_job_image: ActivityDefinition = {
    id: 'a15-job-image',
    title: '興味のある仕事イメージをざっくり洗い出す',
    style: 'selection',
    initialStepId: 'q1',
    steps: {
        q1: {
            id: 'q1',
            type: 'button',
            message: 'どんな仕事に興味がありますか？\n（複数回答可のイメージですが、ここでは一番近いものを選んでください）',
            options: [
                { label: '体を動かす仕事', value: 'body', nextStepId: 'q2' },
                { label: '人と話す仕事', value: 'people', nextStepId: 'q2' },
                { label: 'モノづくり', value: 'create', nextStepId: 'q2' },
                { label: 'パソコンを使う仕事', value: 'pc', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: 'それはなぜですか？',
            options: [
                { label: '楽しそうだから', value: 'fun', nextStepId: 'complete' },
                { label: '得意そうだから', value: 'good', nextStepId: 'complete' },
                { label: '憧れがあるから', value: 'admire', nextStepId: 'complete' },
            ],
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'ありがとうございます。\nまずはざっくりとしたイメージからで大丈夫です。',
            isFinal: true,
        },
    },
};
