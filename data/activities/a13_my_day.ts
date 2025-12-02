import { ActivityDefinition } from '@/types/activity';

export const a13_my_day: ActivityDefinition = {
    id: 'a13-my-day',
    title: '自分がその仕事をした場合の一日を描いてみる',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'もしあなたがその仕事をしているとしたら、どんな一日になりそうですか？\n朝起きてから寝るまで、想像して書いてみてください。',
            placeholder: '例：朝は早起きして...夜は疲れてバタンキューかも',
            multiline: true,
            nextStepId: 'feedback',
        },
        feedback: {
            id: 'feedback',
            type: 'message_only',
            message: '想像してみると、自分に合いそうかどうかが感覚的にわかりますね。\n「無理なく続けられそうか」が大事なポイントです。',
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'シミュレーション完了です！\nこの感覚を忘れないようにしましょう。',
            isFinal: true,
        },
    },
};
