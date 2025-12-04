import { ActivityDefinition } from '@/types/activity';

export const a3_future_10_years: ActivityDefinition = {
    id: 'a3-future-10-years',
    title: '10年後の自分を想像する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '10年後、どんな生活をしていたら幸せだと思いますか？\n仕事だけでなく、プライベートも含めて想像してみてください。',
            placeholder: '',
            options: [
                { label: '海外で働きながら、家族とゆっくり過ごす', value: '海外で働きながら、家族とゆっくり過ごす' },
                { label: '起業して自分の会社を持つ', value: '起業して自分の会社を持つ' },
            ],
            nextStepId: 'requirement',
        },
        requirement: {
            id: 'requirement',
            type: 'text',
            message: 'その生活を実現するために、何が必要だと思いますか？',
            placeholder: '',
            options: [
                { label: '語学力', value: '語学力' },
                { label: '専門スキル', value: '専門スキル' },
                { label: '人脈', value: '人脈' },
                { label: '資金', value: '資金' },
            ],
            nextStepId: 'avoid',
        },
        avoid: {
            id: 'avoid',
            type: 'text',
            message: '逆に、どんな生活は避けたいですか？',
            placeholder: '',
            options: [
                { label: '仕事に追われて自分の時間がない生活', value: '仕事に追われて自分の時間がない生活' },
                { label: 'やりたくない仕事を続けること', value: 'やりたくない仕事を続けること' },
            ],
            nextStepId: 'priority',
        },
        priority: {
            id: 'priority',
            type: 'button',
            message: '仕事とプライベート、どちらを優先していますか？（10年後のイメージで）',
            options: [
                { label: '仕事優先', value: 'work', nextStepId: 'analysis' },
                { label: 'プライベート優先', value: 'private', nextStepId: 'analysis' },
                { label: 'バランス重視', value: 'balance', nextStepId: 'analysis' },
            ],
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: 'ありがとうございます。\n10年後のビジョンから、あなたの長期的なゴールが見えてきました。\n『ライフスタイル』もキャリアの大切な要素ですね。',
            isFinal: true,
        },
    },
};
