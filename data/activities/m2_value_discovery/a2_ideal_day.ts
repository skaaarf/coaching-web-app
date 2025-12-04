import { ActivityDefinition } from '@/types/activity';

export const a2_ideal_day: ActivityDefinition = {
    id: 'a2-ideal-day',
    title: '理想の1日を描く',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '理想の仕事の1日を想像してみてください。\n朝起きてから夜寝るまで、どんな1日を過ごしていますか？',
            placeholder: '',
            options: [
                { label: '朝はゆっくりカフェで仕事', value: '朝はゆっくりカフェで仕事' },
                { label: 'チームで活発に議論', value: 'チームで活発に議論' },
            ],
            multiline: true,
            nextStepId: 'enjoyable',
        },
        enjoyable: {
            id: 'enjoyable',
            type: 'text',
            message: 'その1日のどこが一番楽しそうですか？',
            placeholder: '',
            options: [
                { label: 'チームでアイデアを出し合っている時', value: 'チームでアイデアを出し合っている時' },
                { label: '一人で集中して作業している時', value: '一人で集中して作業している時' },
            ],
            nextStepId: 'colleagues',
        },
        colleagues: {
            id: 'colleagues',
            type: 'text',
            message: '誰と一緒に働いていますか？',
            placeholder: '',
            options: [
                { label: '尊敬できる先輩', value: '尊敬できる先輩' },
                { label: '仲の良い同僚', value: '仲の良い同僚' },
                { label: '切磋琢磨できるライバル', value: '切磋琢磨できるライバル' },
            ],
            nextStepId: 'place',
        },
        place: {
            id: 'place',
            type: 'text',
            message: 'どこで働いていますか？（オフィス、在宅、カフェなど）',
            placeholder: '',
            options: [
                { label: 'おしゃれなオフィス', value: 'おしゃれなオフィス' },
                { label: 'リモートワーク', value: 'リモートワーク' },
                { label: 'カフェ', value: 'カフェ' },
            ],
            nextStepId: 'avoid',
        },
        avoid: {
            id: 'avoid',
            type: 'text',
            message: '逆に、どんな1日は避けたいですか？',
            placeholder: '',
            options: [
                { label: '満員電車で通勤', value: '満員電車で通勤' },
                { label: '一日中誰とも話さない', value: '一日中誰とも話さない' },
                { label: '理不尽な指示', value: '理不尽な指示' },
            ],
            nextStepId: 'analysis',
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: 'ありがとうございます。\nあなたは『裁量がある』『変化が多い』環境や、人間関係を重視する傾向がありそうですね。\n理想のライフスタイルもキャリアの大切な要素です。',
            isFinal: true,
        },
    },
};
