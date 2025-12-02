import { ActivityDefinition } from '@/types/activity';

export const e5_reflection: ActivityDefinition = {
    id: 'e5-reflection',
    title: '二週間後の振り返りの仕方を決める',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '2週間後の自分に、どんな質問を投げかけたいですか？\n3つほど考えてみましょう。',
            placeholder: '例：計画通りに進んだ？、何が一番楽しかった？',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: '質問セットができました。\n2週間後、この質問に答えることで、成長を実感できるはずです。',
            isFinal: true,
        },
    },
};
