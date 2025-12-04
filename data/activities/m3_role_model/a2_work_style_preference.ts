import { ActivityDefinition } from '@/types/activity';

export const a2_work_style_preference: ActivityDefinition = {
    id: 'a2-work-style-preference',
    title: '憧れの働き方を選ぶ',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'message_only',
            message: '様々な働き方のパターンを表示します。\n「理想に近い順」に選んでみましょう。',
            nextStepId: 'ranking',
        },
        ranking: {
            id: 'ranking',
            type: 'text',
            message: '以下の選択肢から、最も魅力的なものを1つ選んで入力してください。\n\n・大企業で安定的に働く\n・ベンチャーで急成長する\n・起業して自分の会社を作る\n・フリーランスで自由に働く\n・NPOで社会貢献する\n・専門職として極める\n・経営者として組織を率いる',
            placeholder: '',
            options: [
                { label: 'フリーランスで自由に働く', value: 'フリーランスで自由に働く' },
                { label: '大企業で安定的に働く', value: '大企業で安定的に働く' },
            ],
            nextStepId: 'reason_top',
        },
        reason_top: {
            id: 'reason_top',
            type: 'text',
            message: 'なぜそれが1位なんですか？',
            placeholder: '',
            options: [
                { label: '場所や時間に縛られたくないから', value: '場所や時間に縛られたくないから' },
                { label: '安定した生活基盤が欲しいから', value: '安定した生活基盤が欲しいから' },
            ],
            nextStepId: 'worst',
        },
        worst: {
            id: 'worst',
            type: 'text',
            message: '逆に、最も避けたい働き方はどれですか？',
            placeholder: '',
            options: [
                { label: '大企業で安定的に働く', value: '大企業で安定的に働く' },
                { label: '不安定な生活', value: '不安定な生活' },
            ],
            nextStepId: 'reason_worst',
        },
        reason_worst: {
            id: 'reason_worst',
            type: 'text',
            message: 'なぜそれは避けたいですか？',
            placeholder: '',
            options: [
                { label: '歯車のように働くのは嫌だから', value: '歯車のように働くのは嫌だから' },
                { label: '将来が見えないのは不安だから', value: '将来が見えないのは不安だから' },
            ],
            nextStepId: 'analysis',
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: 'ありがとうございます。\nあなたのキャリア・アンカーは『自律・独立』や『起業家的創造性』が強そうですね。\n逆に『保障・安定』は優先度が低いようです。',
            isFinal: true,
        },
    },
};
