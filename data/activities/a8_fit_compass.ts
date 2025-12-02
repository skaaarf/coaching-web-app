import { ActivityDefinition } from '@/types/activity';

export const a8_fit_compass: ActivityDefinition = {
    id: 'a8-fit-compass',
    title: '自分コンパスとのフィット度を評価する',
    style: 'selection',
    initialStepId: 'q1',
    steps: {
        q1: {
            id: 'q1',
            type: 'button',
            message: 'Module 1で作った「自分コンパス」を思い出してください。\n検討中の選択肢は、あなたのコンパス（大事にしたいこと）に合っていますか？',
            options: [
                { label: 'かなり合う', value: 'high', nextStepId: 'complete' },
                { label: 'まあ合う', value: 'medium', nextStepId: 'complete' },
                { label: 'あまり合わない', value: 'low', nextStepId: 'complete' },
            ],
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '評価ありがとうございます。\n自分の軸と照らし合わせることで、納得感のある選択に近づきます。',
            isFinal: true,
        },
    },
};
