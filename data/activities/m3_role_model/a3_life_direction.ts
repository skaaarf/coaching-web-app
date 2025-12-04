import { ActivityDefinition } from '@/types/activity';

export const a3_life_direction: ActivityDefinition = {
    id: 'a3-life-direction',
    title: '生き方の方向性を決める',
    style: 'chat',
    mode: 'dynamic_chat',
    systemPrompt: `あなたはプロのキャリアコーチです。ユーザーの「理想の生き方」を深掘りし、そこから「キャリア・アンカー（譲れない軸）」を特定してください。
    
    # ルール
    - 抽象的なイメージを具体化する手助けをしてください。「例えばどんな1日ですか？」「誰といたいですか？」
    - 仕事だけでなく、ライフスタイル全体を含めたビジョンを聞き出してください。
    - 3〜5往復程度の会話を通じて、ユーザーのキャリアの方向性を言語化してください。`,
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'これまでの分析を踏まえて、あなたは将来どんな生き方をしていたいですか？\n一言で表すなら、どんなテーマになりそうですか？',
            placeholder: '',
            options: [
                { label: '自由に挑戦し続ける生き方', value: '自由に挑戦し続ける生き方' },
                { label: '周りの人を笑顔にする生き方', value: '周りの人を笑顔にする生き方' },
                { label: '専門性を極めて貢献する生き方', value: '専門性を極めて貢献する生き方' },
            ],
            nextStepId: 'chat_loop',
        },
    },
};
