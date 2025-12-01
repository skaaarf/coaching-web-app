import { ActivityDefinition } from '@/types/activity';

export const a4_holiday_diagnosis: ActivityDefinition = {
    id: 'a4-holiday',
    title: '休日の過ごし方診断',
    style: 'selection',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'button',
            message: '休日の過ごし方から、\nあなたの価値観を見つけましょう。\n\n7つの質問に答えてください。\n直感で選んで大丈夫です。',
            options: [
                { label: '始める', value: 'start', nextStepId: 'q1' },
            ],
        },
        q1: {
            id: 'q1',
            type: 'button',
            message: 'Q1. 休日の理想の過ごし方は？',
            options: [
                { label: '友達や家族とワイワイ過ごす', value: 'A', nextStepId: 'q2' },
                { label: '一人でのんびり過ごす', value: 'B', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: 'Q2. やりたいことができた時、どっちが嬉しい？',
            options: [
                { label: '新しいことに挑戦できた', value: 'A', nextStepId: 'q3' },
                { label: 'いつものことを続けられた', value: 'B', nextStepId: 'q3' },
            ],
        },
        q3: {
            id: 'q3',
            type: 'button',
            message: 'Q3. 予定のない休日、どう感じる？',
            options: [
                { label: '自由で最高！何でもできる', value: 'A', nextStepId: 'q4' },
                { label: 'ちょっと不安。予定が欲しい', value: 'B', nextStepId: 'q4' },
            ],
        },
        q4: {
            id: 'q4',
            type: 'button',
            message: 'Q4. 疲れた時、どうやって回復する？',
            options: [
                { label: '人と話す・遊ぶ', value: 'A', nextStepId: 'q5' },
                { label: '一人で静かに過ごす', value: 'B', nextStepId: 'q5' },
            ],
        },
        q5: {
            id: 'q5',
            type: 'button',
            message: 'Q5. 仕事や勉強で大事なのは？',
            options: [
                { label: '自分のペースで進められること', value: 'A', nextStepId: 'q6' },
                { label: 'チームで協力できること', value: 'B', nextStepId: 'q6' },
            ],
        },
        q6: {
            id: 'q6',
            type: 'button',
            message: 'Q6. 達成感を感じるのはどっち？',
            options: [
                { label: '目標をクリアした時', value: 'A', nextStepId: 'q7' },
                { label: '日々少しずつ成長している時', value: 'B', nextStepId: 'q7' },
            ],
        },
        q7: {
            id: 'q7',
            type: 'button',
            message: 'Q7. やりがいを感じるのは？',
            options: [
                { label: '人の役に立てた時', value: 'A', nextStepId: 'result' },
                { label: '自分の成長を感じた時', value: 'B', nextStepId: 'result' },
            ],
        },
        result: {
            id: 'result',
            type: 'message_only', // Special type for result, or handle in onComplete
            message: '診断お疲れ様でした！\n結果を集計しています...',
            isFinal: true,
        },
    },
};
