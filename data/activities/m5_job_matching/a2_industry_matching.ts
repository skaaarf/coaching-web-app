import { ActivityDefinition } from '@/types/activity';

export const a2_industry_matching: ActivityDefinition = {
    id: 'a2-industry-matching',
    title: '業界マッチング診断',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'message_only',
            message: 'これまでの全データ（強み、価値観、キャリア・アンカー、ビジョン）を分析し、あなたに向いている業界Top3を算出しました。',
            nextStepId: 'result',
        },
        result: {
            id: 'result',
            type: 'message_only',
            message: 'あなたに向いている業界Top3：\n\n1位：コンサル・IT/SaaS（マッチ度92%）\n・強み『構造化力』が活きる\n・アンカー『起業家的創造性』が満たされる\n・新しいプロジェクトが多い\n\n2位：マーケティング・広告（マッチ度85%）\n・強み『創造的思考』が活きる\n・アンカー『自律・独立』が満たされる\n\n3位：エンターテイメント（マッチ度78%）\n・強み『創造性』が活きる\n・ただし裁量が限られる場合も',
            nextStepId: 'explanation',
        },
        explanation: {
            id: 'explanation',
            type: 'message_only',
            message: 'コンサル・IT業界は、変化が激しく、常に新しい課題解決が求められます。\nこれはあなたの「挑戦したい」「裁量を持ちたい」という価値観に非常にマッチしています。\n\n一方、安定志向の強い業界は、あなたの強みを活かしにくいかもしれません。',
            isFinal: true,
        },
    },
};
