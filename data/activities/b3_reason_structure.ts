import { ActivityDefinition } from '@/types/activity';

export const b3_reason_structure: ActivityDefinition = {
    id: 'b3-reason-structure',
    title: '志望理由の骨組みを作る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '志望動機を作りましょう。\nまず、「なぜこの業界・分野」なのですか？',
            placeholder: '例：ITの力で生活を便利にしたいから',
            multiline: true,
            nextStepId: 'company',
        },
        company: {
            id: 'company',
            type: 'text',
            message: 'その中でも、「なぜこの会社（学校）」なのですか？\n他との違いは何でしょう。',
            placeholder: '例：若手から挑戦できる風土があるから',
            multiline: true,
            nextStepId: 'contribution',
        },
        contribution: {
            id: 'contribution',
            type: 'text',
            message: 'そこで、あなたは「何を提供（貢献）」できますか？',
            placeholder: '例：粘り強さを活かして開発に取り組みたい',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '3つの柱ができました。\nこの骨組みがあれば、ブレない志望動機が書けます。',
            isFinal: true,
        },
    },
};
