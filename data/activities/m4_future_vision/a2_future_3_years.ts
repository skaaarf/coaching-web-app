import { ActivityDefinition } from '@/types/activity';

export const a2_future_3_years: ActivityDefinition = {
    id: 'a2-future-3-years',
    title: '3年後の自分を想像する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '3年後、どんな仕事をしていたら幸せだと思いますか？\n自由に想像してみてください。',
            placeholder: '',
            options: [
                { label: 'プロジェクトリーダーとしてバリバリ働いている', value: 'プロジェクトリーダーとしてバリバリ働いている' },
                { label: '専門スキルを磨いて頼られる存在になる', value: '専門スキルを磨いて頼られる存在になる' },
            ],
            nextStepId: 'charm',
        },
        charm: {
            id: 'charm',
            type: 'text',
            message: 'その仕事のどこが魅力的ですか？',
            placeholder: '',
            options: [
                { label: '自分のアイデアが形になるところ', value: '自分のアイデアが形になるところ' },
                { label: 'チームをまとめるやりがい', value: 'チームをまとめるやりがい' },
            ],
            nextStepId: 'skill',
        },
        skill: {
            id: 'skill',
            type: 'text',
            message: 'どんなスキルを身につけていると思いますか？',
            placeholder: '',
            options: [
                { label: 'プレゼン力', value: 'プレゼン力' },
                { label: 'マネジメント力', value: 'マネジメント力' },
                { label: '専門知識', value: '専門知識' },
            ],
            nextStepId: 'environment',
        },
        environment: {
            id: 'environment',
            type: 'text',
            message: 'どんな環境で働いていますか？',
            placeholder: '',
            options: [
                { label: '活気のあるオフィス', value: '活気のあるオフィス' },
                { label: '静かで集中できる環境', value: '静かで集中できる環境' },
            ],
            nextStepId: 'reputation',
        },
        reputation: {
            id: 'reputation',
            type: 'text',
            message: '周りからどんな人だと思われていたいですか？',
            placeholder: '',
            options: [
                { label: '頼れるリーダー', value: '頼れるリーダー' },
                { label: '相談しやすい先輩', value: '相談しやすい先輩' },
            ],
            nextStepId: 'analysis',
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: 'ありがとうございます。\n3年後のあなたは『裁量を持って動き、周囲から頼られる存在』を目指しているようですね。\nこのビジョンに向けて、今からできることを考えていきましょう。',
            isFinal: true,
        },
    },
};
