import { ProfileAnalysisData } from '@/types/profile';

export const mockProfileAnalysisData: ProfileAnalysisData = {
  // 1. キャリアタイプ
  careerType: {
    type: '「構造化×起業家的創造性」タイプ',
    description:
      '複雑な課題を整理し、0→1を生み出す力が強み。変化の多い環境で、裁量を持って新しいことに挑める場が最適。',
    anchors: ['起業家的創造性', '自律・独立'],
    strengths: ['構造化力', '創造的思考', '粘り強さ'],
    lastUpdated: '2024-12-03T00:00:00Z',
  },

  // 2. 自己理解の進捗
  selfUnderstanding: {
    overallProgress: 78,
    categories: [
      { name: '強み発見', progress: 100, count: 3, confidence: 4 },
      { name: '価値観明確化', progress: 80, count: 4 },
      { name: 'キャリア・アンカー', progress: 100 },
      { name: 'キャリアビジョン', progress: 60 },
      { name: '業界マッチング', progress: 50 },
    ],
    nextRecommendation: {
      title: 'インターン経験を振り返る',
      description: '強みの信頼度UP、業界マッチング精度が向上',
      benefits: ['強みの信頼度UP', '業界マッチング精度向上'],
    },
  },

  // 3. 強み
  strengths: {
    totalCount: 3,
    strengths: [
      {
        id: 'strength-1',
        name: '構造化・要点整理力',
        rating: 5,
        ratingText: '5.0/5.0',
        description: '複雑な状況でも情報を整理し、論点を明確化できる。',
        typicalBehaviors: [
          '課題の背景を素早く把握する',
          'バラバラの情報を構造化して整理する',
          '論点を明確にしてチームに共有する',
        ],
        episodes: [
          {
            id: 'ep-1',
            title: '学園祭で混乱した進行タスクを可視化、役割分担を再構築',
            fullText:
              '学園祭の準備期間中、タスク管理が混乱していたため、全体を可視化し役割分担を再構築した。結果、遅延していた作業が予定通り完了した。',
            date: '2024-10-15T00:00:00Z',
          },
          {
            id: 'ep-2',
            title: 'ゼミでデータ分析結果を構造化してレポート作成',
            fullText:
              'ゼミの研究で複雑なデータ分析結果をわかりやすく構造化し、教授から高評価を得た。',
            date: '2024-09-20T00:00:00Z',
          },
          {
            id: 'ep-3',
            title: 'インターンで顧客課題を整理し、提案資料に落とし込み',
            fullText:
              'インターン先で顧客からヒアリングした課題を整理し、提案資料として落とし込んだ。顧客から「わかりやすい」との評価を受けた。',
            date: '2024-08-10T00:00:00Z',
          },
        ],
        lastUpdated: '2024-12-03T00:00:00Z',
      },
      {
        id: 'strength-2',
        name: '創造的思考',
        rating: 4,
        ratingText: '4.0/5.0',
        description: '既存の枠にとらわれず、新しいアイデアを生み出せる。',
        typicalBehaviors: [
          '前例にとらわれない発想ができる',
          '「なぜ？」を繰り返して本質を探る',
          '複数の視点から物事を見られる',
        ],
        episodes: [
          {
            id: 'ep-4',
            title: 'サークルで新企画を立案し、実行まで主導',
            fullText:
              'サークルで前例のない企画を立案し、メンバーを巻き込んで実行まで主導した。結果、参加者から高評価を得た。',
            date: '2024-07-01T00:00:00Z',
          },
          {
            id: 'ep-5',
            title: '授業で独自の視点から課題を分析',
            fullText:
              '授業の課題で、教科書にない独自の視点から問題を分析し、教授から「新しい視点だ」と評価された。',
            date: '2024-06-15T00:00:00Z',
          },
        ],
        lastUpdated: '2024-12-01T00:00:00Z',
      },
      {
        id: 'strength-3',
        name: '粘り強さ',
        rating: 3,
        ratingText: '3.0/5.0',
        description: '困難な状況でも諦めずに取り組み続けられる。',
        typicalBehaviors: [],
        episodes: [
          {
            id: 'ep-6',
            title: 'アルバイトで難しい業務に挑戦、3ヶ月かけて習得',
            fullText:
              'アルバイトで難易度の高い業務に挑戦し、失敗を繰り返しながらも3ヶ月かけて習得した。',
            date: '2024-05-01T00:00:00Z',
          },
        ],
        lastUpdated: '2024-11-20T00:00:00Z',
        needsMoreEpisodes: true,
      },
    ],
  },

  // 4. 価値観+働き方の相性
  valuesCompatibility: {
    values: [
      {
        id: 'value-1',
        title: '新しいことへの挑戦意欲',
        score: 8,
        leftLabel: '挑戦',
        rightLabel: '安定',
        description: '未知の領域に飛び込む瞬間に最も成長を実感',
        anchorRelation: ['起業家的創造性', '純粋な挑戦'],
      },
      {
        id: 'value-2',
        title: '選択の自由・裁量',
        score: 9,
        leftLabel: '自由',
        rightLabel: 'ルール',
        description: '自分で判断しながら動ける環境で最もパフォーマンスが上がる',
        anchorRelation: ['自律・独立'],
      },
      {
        id: 'value-3',
        title: '創造性を活かした企画力',
        score: 8,
        leftLabel: '創造',
        rightLabel: '実行',
        description: '新しい価値を生み出すことにやりがいを感じる',
        anchorRelation: ['起業家的創造性'],
      },
      {
        id: 'value-4',
        title: '最後までやり抜く継続力',
        score: 7,
        leftLabel: '継続',
        rightLabel: '柔軟',
        description: '始めたことは責任を持って完遂したい',
      },
    ],
    workStyleAxes: [
      { name: 'チーム⇔個人', score: 4, leftLabel: 'チーム', rightLabel: '個人' },
      { name: '速い⇔緻密', score: 6, leftLabel: '速い', rightLabel: '緻密' },
      { name: '外向⇔内向', score: 5, leftLabel: '外向', rightLabel: '内向' },
    ],
    suitableEnvironments: ['ベンチャー/新規事業', '裁量権が大きい環境', 'スピード感重視'],
    unsuitableEnvironments: ['ルーティンワーク中心', '裁量が少ない組織', '変化を嫌う保守的な文化'],
  },

  // 5. キャリアビジョン
  careerVision: {
    coreAnchors: ['起業家的創造性', '自律・独立'],
    anchorRanking: [
      {
        name: '起業家的創造性',
        score: 8,
        description: '組織の構築、新規性、リスクテイクに魅力',
      },
      {
        name: '自律・独立',
        score: 7,
        description: '自己裁量、自由を重視',
      },
      {
        name: '純粋な挑戦',
        score: 5,
        description: '困難な課題に取り組むこと自体が楽しい',
      },
    ],
    opportunities: [
      '新しいプロジェクトを0から立ち上げる機会',
      '自分で判断し、裁量を持って動ける環境',
      '未知の課題に挑戦できる場',
    ],
    challenges: ['ルーティンワークが中心の業務', '指示待ちで動く仕事'],
    vision3Years:
      '新規事業や企画職で、裁量を持ちながら0→1を生み出せる人材。「このプロジェクトは〇〇さんが立ち上げた」と言われる存在。',
    vision10Years: '事業責任者、または起業家として、複数領域で価値を生み続ける存在。',
    skillsToGrow: ['課題発見力', '仮説検証力', 'データ分析', 'チームマネジメント'],
  },

  // 6. 向いている業界・職種
  industryMatch: {
    matches: [
      {
        rank: 1,
        industry: 'コンサル・IT/SaaS業界',
        positions: ['企画職', 'PM', 'コンサルタント'],
        matchScore: 92,
        matchReasons: [
          '強み「構造化力」「創造的思考」が業務と一致',
          'アンカー「起業家的創造性」「自律・独立」が満たされる',
          '新しいプロジェクト、裁量、挑戦の機会が豊富',
        ],
        companies: ['アクセンチュア', 'デロイト', 'リクルート', 'ビズリーチ', 'メルカリ'],
      },
      {
        rank: 2,
        industry: 'マーケティング・広告業界',
        positions: ['マーケター', 'ブランドマネージャー'],
        matchScore: 85,
        matchReasons: [
          '強み「創造的思考」が企画立案で活きる',
          'アンカー「起業家的創造性」と相性◎',
        ],
        warnings: ['データ分析スキルを伸ばすとさらに◎'],
        companies: ['電通', '博報堂', 'サイバーエージェント', 'ユーザベース'],
      },
      {
        rank: 3,
        industry: 'エンターテイメント・コンテンツ業界',
        positions: ['企画職', 'プロデューサー'],
        matchScore: 78,
        matchReasons: ['強み「創造性」「企画力」が活かせる'],
        warnings: ['裁量が限られる場合もあり、企業選びを慎重に'],
        companies: ['ソニー・ミュージック', 'アニプレックス', '集英社'],
      },
    ],
  },

  // 7. AI総合コメント
  aiComment: {
    summary:
      'あなたは「構造化×起業家的創造性」タイプで、複雑な課題を整理し、新しいフィールドで価値を生み出す力があります。',
    strengths: [
      '論理的に課題を整理できる力 → 面接で高評価',
      '挑戦志向の姿勢 → 成長企業で求められる',
      '自分の価値観が明確 → 企業選びの軸がブレない',
    ],
    warnings: [
      '裁量が少ない企業では、モチベーション低下のリスク',
      '自由度だけでなく、成長機会も重視すると◎',
    ],
    downloadAvailable: true,
    emailAvailable: true,
  },

  // 8. 更新履歴
  updateHistory: {
    history: [
      {
        date: '2024-12-03T00:00:00Z',
        changes: [
          { category: '強み', description: '強み「構造化力」にエピソード1件追加' },
          {
            category: 'キャリア候補',
            description: 'キャリア候補「データアナリスト」が新たに追加',
          },
          { category: 'AI総合コメント', description: 'AI総合コメントが更新' },
        ],
      },
      {
        date: '2024-12-01T00:00:00Z',
        changes: [
          { category: '価値観', description: '価値観「挑戦志向」のスコアが7→8に上昇' },
          { category: '適職マッチ度', description: '適職マッチ度が再計算' },
        ],
      },
      {
        date: '2024-11-20T00:00:00Z',
        changes: [
          { category: '強み', description: '強み「創造的思考」が新たに発見' },
          { category: '適性職種', description: '適性職種に「プロデューサー」が追加' },
        ],
      },
    ],
    hasMore: true,
  },
};
