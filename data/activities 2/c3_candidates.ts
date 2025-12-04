import { ActivityDefinition } from '@/types/activity';

export const c3_candidates: ActivityDefinition = {
    id: 'c3-candidates',
    title: '業界と職種の候補を整理する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '興味のある業界を挙げてください。',
            placeholder: '例：IT、広告、人材',
            multiline: true,
            nextStepId: 'role',
        },
        role: {
            id: 'role',
            type: 'text',
            message: 'その中で、どんな職種に興味がありますか？',
            placeholder: '例：営業、企画、エンジニア',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'ターゲットが明確になってきました。\nこの領域を中心に情報を集めていきましょう。',
            isFinal: true,
        },
    },
};
