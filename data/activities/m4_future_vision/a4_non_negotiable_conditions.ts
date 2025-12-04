import { ActivityDefinition } from '@/types/activity';

export const a4_non_negotiable_conditions: ActivityDefinition = {
    id: 'a4-non-negotiable-conditions',
    title: '譲れない条件を決める',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'message_only',
            message: '企業選びの条件をいくつか表示します。\n「これだけは譲れない」と思うものを順番に選んでください。',
            nextStepId: 'ranking',
        },
        ranking: {
            id: 'ranking',
            type: 'text',
            message: '以下の条件から、優先順位が高いものを3つ選んで入力してください。\n\n・年収\n・勤務地\n・裁量の大きさ\n・ワークライフバランス\n・成長機会\n・社会貢献\n・安定性\n・企業のブランド',
            placeholder: '',
            options: [
                { label: '1.裁量の大きさ、2.成長機会、3.年収', value: '1.裁量の大きさ、2.成長機会、3.年収' },
                { label: '1.安定性、2.ワークライフバランス、3.年収', value: '1.安定性、2.ワークライフバランス、3.年収' },
            ],
            nextStepId: 'reason_top',
        },
        reason_top: {
            id: 'reason_top',
            type: 'text',
            message: 'なぜそれが最優先なんですか？',
            placeholder: '',
            options: [
                { label: '若いうちに経験を積みたいから', value: '若いうちに経験を積みたいから' },
                { label: '長く安心して働きたいから', value: '長く安心して働きたいから' },
            ],
            nextStepId: 'analysis',
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: 'ありがとうございます。\nあなたは『裁量』と『成長機会』を最重視するタイプですね。\n逆に『安定性』などは優先度が低いようです。\nこの軸を持って企業を探すと、ミスマッチを防げます。',
            isFinal: true,
        },
    },
};
