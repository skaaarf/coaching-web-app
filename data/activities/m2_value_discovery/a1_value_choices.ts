import { ActivityDefinition } from '@/types/activity';

export const a1_value_choices: ActivityDefinition = {
    id: 'a1-value-choices',
    title: '二択で価値観を探る',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'message_only',
            message: 'これから2つの選択肢を表示します。\n「どちらが自分にとって理想的か」直感で選んでください。',
            nextStepId: 'q1',
        },
        q1: {
            id: 'q1',
            type: 'button',
            message: 'Q1. どちらが理想？',
            options: [
                { label: 'A. 安定した給料で、長く働ける会社', value: 'stable', nextStepId: 'q2' },
                { label: 'B. 給料は不安定でも、成長できる環境', value: 'growth', nextStepId: 'q2' },
            ],
        },
        q2: {
            id: 'q2',
            type: 'button',
            message: 'Q2. どちらが好き？',
            options: [
                { label: 'A. 自分で自由に決められる仕事', value: 'freedom', nextStepId: 'q3' },
                { label: 'B. 明確な指示がある仕事', value: 'structure', nextStepId: 'q3' },
            ],
        },
        q3: {
            id: 'q3',
            type: 'button',
            message: 'Q3. どちらが合う？',
            options: [
                { label: 'A. チームで協力しながら進める', value: 'team', nextStepId: 'q4' },
                { label: 'B. 個人で黙々と進める', value: 'individual', nextStepId: 'q4' },
            ],
        },
        q4: {
            id: 'q4',
            type: 'button',
            message: 'Q4. どちらに魅力を感じる？',
            options: [
                { label: 'A. 新しいプロジェクトを立ち上げる', value: 'create', nextStepId: 'q5' },
                { label: 'B. 既存の仕事を改善する', value: 'improve', nextStepId: 'q5' },
            ],
        },
        q5: {
            id: 'q5',
            type: 'button',
            message: 'Q5. どちらが得意？',
            options: [
                { label: 'A. スピード重視でどんどん進める', value: 'speed', nextStepId: 'analysis' },
                { label: 'B. 質を重視してじっくり進める', value: 'quality', nextStepId: 'analysis' },
            ],
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: 'ありがとうございます。\nあなたの選択から、『挑戦』『自由』『チーム』などを重視する傾向が見えてきました。\nこれは企業選びの重要な軸になります。',
            isFinal: true,
        },
    },
};
