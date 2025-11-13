'use client';

import React, { useState } from 'react';

export interface Career {
  id: string;
  title: string;
  icon: string;
  category: 'tech' | 'medical' | 'creative' | 'business' | 'education' | 'service' | 'engineering' | 'public' | 'research';
  tagline: string;
  description: string;
  education: string[];
  skills: string[];
  salary: {
    entry: string;
    mid: string;
    senior: string;
  };
  workStyle: {
    hours: string;
    location: string;
    flexibility: string;
  };
  pros: string[];
  cons: string[];
  realVoice: string;
  dayInLife: string[];
  careerPath: string[];
  futureOutlook: string;
  relatedCareers: string[];
}

const CAREERS: Career[] = [
  // Tech
  {
    id: 'software-engineer',
    title: 'ソフトウェアエンジニア',
    icon: '💻',
    category: 'tech',
    tagline: 'コードで世界を変える',
    description: 'アプリやWebサービスなど、ソフトウェアを開発する仕事。プログラミングスキルを駆使して、ユーザーの課題を解決するシステムを作る。',
    education: ['情報系大学・専門学校', '独学でも可能', 'プログラミングスクール'],
    skills: ['プログラミング言語', '論理的思考力', '問題解決能力', 'チーム開発'],
    salary: {
      entry: '350-450万円',
      mid: '500-800万円',
      senior: '800-1500万円以上'
    },
    workStyle: {
      hours: '平均8-10時間（プロジェクトにより変動）',
      location: 'オフィス・リモート可能',
      flexibility: '高い（リモートワーク、フレックス多い）'
    },
    pros: [
      '需要が高く、転職しやすい',
      'リモートワーク可能な企業が多い',
      '実力次第で高収入',
      '自分の作ったものが世に出る達成感',
      '常に新しい技術を学べる'
    ],
    cons: [
      '技術の移り変わりが早く、学び続ける必要',
      'デバッグ作業は地味で根気が必要',
      '納期前は残業が増えることも',
      '座り仕事で運動不足になりがち',
      'コミュニケーション能力も求められる'
    ],
    realVoice: '最初はバグとの戦いでしたが、自分のコードが動いた時の喜びは何にも代えがたい。ユーザーからの「便利になった」の声が一番のやりがいです。',
    dayInLife: [
      '9:00 - チームミーティングで進捗共有',
      '10:00 - コーディング作業',
      '12:00 - 昼休憩',
      '13:00 - コードレビュー',
      '14:00 - 新機能の設計・実装',
      '16:00 - バグ修正',
      '17:00 - テスト実行',
      '18:00 - 翌日のタスク整理'
    ],
    careerPath: [
      'ジュニアエンジニア → シニアエンジニア → テックリード → エンジニアリングマネージャー',
      '専門性を極めてスペシャリストへ',
      'CTO（最高技術責任者）',
      'フリーランスエンジニア',
      '起業してサービスを自分で作る'
    ],
    futureOutlook: 'AI・DXの進展でますます需要増加。ただし基礎的なコーディングはAI化される可能性も。設計や問題解決能力がより重要に。',
    relatedCareers: ['data-scientist', 'web-designer', 'product-manager']
  },
  {
    id: 'data-scientist',
    title: 'データサイエンティスト',
    icon: '📊',
    category: 'tech',
    tagline: 'データから未来を予測する',
    description: '大量のデータを分析し、ビジネスの意思決定に役立つ洞察を導き出す。統計学、プログラミング、ビジネス知識を組み合わせる高度な職業。',
    education: ['統計学・数学・情報系大学', '大学院推奨', '独学+実務経験'],
    skills: ['統計学・機械学習', 'Python/R', 'SQL', 'ビジネス理解力', 'プレゼンテーション'],
    salary: {
      entry: '450-600万円',
      mid: '700-1000万円',
      senior: '1000-2000万円以上'
    },
    workStyle: {
      hours: '平均8-9時間',
      location: 'オフィス中心（リモート可の企業も）',
      flexibility: '中〜高'
    },
    pros: [
      '高収入が期待できる',
      '希少性が高く市場価値◎',
      '論理的思考力が鍛えられる',
      '様々な業界で需要あり',
      'データから新しい発見をする楽しさ'
    ],
    cons: [
      '数学・統計の知識が必須',
      '結果が出ない時の地道な分析',
      '経営層への説明が難しいことも',
      '常に新しい手法を学ぶ必要',
      'ビジネス理解も求められる'
    ],
    realVoice: 'データの中に隠れたパターンを見つけた時は宝探しみたいでワクワクします。分析結果が会社の戦略を動かすこともあり、責任も大きいです。',
    dayInLife: [
      '9:30 - データ確認とクレンジング',
      '11:00 - 分析モデル構築',
      '12:30 - ランチMTG',
      '13:30 - 可視化・レポート作成',
      '15:00 - ビジネス部門とMTG',
      '16:30 - 新しい分析手法の研究',
      '18:00 - 明日のプラン作成'
    ],
    careerPath: [
      'ジュニアアナリスト → データサイエンティスト → シニアDS → チーフDS',
      '特定領域のスペシャリスト',
      'データ部門のマネージャー',
      'フリーランスコンサルタント',
      'AI系スタートアップ起業'
    ],
    futureOutlook: 'データ活用はさらに加速。AI時代でも人間の洞察力は不可欠。需要は今後10年以上継続見込み。',
    relatedCareers: ['software-engineer', 'researcher', 'business-analyst']
  },
  {
    id: 'web-designer',
    title: 'Webデザイナー',
    icon: '🎨',
    category: 'creative',
    tagline: '美しいWebを創造する',
    description: 'WebサイトやアプリのUI/UXをデザイン。見た目の美しさだけでなく、ユーザーの使いやすさを追求する。',
    education: ['美大・デザイン専門学校', '独学+ポートフォリオ', 'オンラインスクール'],
    skills: ['デザインツール（Figma, Adobe XD）', 'HTML/CSS基礎', 'UI/UX理論', '美的センス'],
    salary: {
      entry: '300-400万円',
      mid: '400-600万円',
      senior: '600-900万円'
    },
    workStyle: {
      hours: '平均8-9時間（納期前は長時間）',
      location: 'オフィス・リモート可',
      flexibility: '中〜高'
    },
    pros: [
      '創造性を発揮できる',
      '自分の作品が形になる',
      'フリーランスとして独立しやすい',
      '在宅勤務可能な案件が多い',
      '多様な業界のプロジェクトに関われる'
    ],
    cons: [
      'クライアントの要望との調整が大変',
      '納期前の残業',
      '流行の変化が早く常に学習必要',
      '収入が不安定になることも',
      'コーディングスキルも求められる傾向'
    ],
    realVoice: '自分のデザインでサイトが生まれ変わり、アクセス数が増えた時は最高の気分。クライアントの「ありがとう」が励みです。',
    dayInLife: [
      '10:00 - クライアントMTG',
      '11:00 - デザインカンプ作成',
      '13:00 - ランチ',
      '14:00 - フィードバック対応',
      '16:00 - プロトタイプ作成',
      '17:30 - チーム内レビュー',
      '18:30 - 明日の準備'
    ],
    careerPath: [
      'ジュニアデザイナー → デザイナー → シニアデザイナー → アートディレクター',
      'UI/UXスペシャリスト',
      'フリーランス',
      'デザイン事務所立ち上げ'
    ],
    futureOutlook: 'AIツールの進化で基礎的デザインは自動化される可能性。創造性と戦略的思考がより重要に。',
    relatedCareers: ['software-engineer', 'graphic-designer', 'marketing']
  },

  // Medical
  {
    id: 'doctor',
    title: '医師',
    icon: '⚕️',
    category: 'medical',
    tagline: '命を救い、人々の健康を守る',
    description: '病気やケガの診断・治療を行う。人の命と健康に直接関わる、社会的責任の大きい職業。',
    education: ['医学部6年 → 初期研修2年 → 後期研修3-5年'],
    skills: ['医学知識', '診断能力', 'コミュニケーション', '体力・精神力', '生涯学習意欲'],
    salary: {
      entry: '400-600万円（研修医）',
      mid: '1000-1500万円',
      senior: '1500-3000万円以上'
    },
    workStyle: {
      hours: '長時間（当直あり）',
      location: '病院・クリニック',
      flexibility: '低い'
    },
    pros: [
      '人の命を救う大きなやりがい',
      '社会的地位と信頼',
      '高収入',
      '専門性が高い',
      '生涯現役可能'
    ],
    cons: [
      '激務で当直・夜勤あり',
      '学費が高額（私立で3000万円以上）',
      '責任が重く、訴訟リスクも',
      '学習期間が長い（最低11年）',
      'プライベート時間が限られる'
    ],
    realVoice: '患者さんが元気になって退院していく姿を見ると、この仕事を選んで良かったと心から思います。大変ですが、代えがたいやりがいがあります。',
    dayInLife: [
      '8:00 - 回診',
      '9:00 - 外来診察',
      '12:00 - カンファレンス',
      '13:00 - 昼休憩',
      '14:00 - 手術・処置',
      '17:00 - カルテ記入',
      '18:00 - 緊急対応',
      '19:00 - 当直または帰宅'
    ],
    careerPath: [
      '研修医 → 専門医 → 指導医 → 部長 → 院長',
      '大学病院で研究・教育',
      '開業医',
      '産業医・行政医'
    ],
    futureOutlook: '高齢化で需要増加。AIが診断を補助するが、最終判断や患者とのコミュニケーションは人間不可欠。',
    relatedCareers: ['nurse', 'pharmacist', 'researcher']
  },
  {
    id: 'nurse',
    title: '看護師',
    icon: '👩‍⚕️',
    category: 'medical',
    tagline: '患者に最も近い医療職',
    description: '医師の診療を補助し、患者のケアを行う。24時間患者のそばにいて、心身両面をサポートする。',
    education: ['看護大学4年 or 看護専門学校3年 → 国家試験'],
    skills: ['医療知識', '観察力', 'コミュニケーション', '体力', '共感力'],
    salary: {
      entry: '300-400万円',
      mid: '400-550万円',
      senior: '500-700万円'
    },
    workStyle: {
      hours: '8時間3交代 or 12時間2交代（夜勤あり）',
      location: '病院・クリニック・訪問看護',
      flexibility: '中（資格があればどこでも働ける）'
    },
    pros: [
      '資格があれば全国どこでも働ける',
      '患者さんの回復を間近で見られる',
      '安定した需要',
      '専門性を高められる',
      '人の役に立つ実感'
    ],
    cons: [
      '夜勤があり生活リズムが不規則',
      '感情的負担が大きい',
      '体力勝負',
      '患者や家族からのプレッシャー',
      '医療事故のリスク'
    ],
    realVoice: '夜勤は大変ですが、患者さんから「あなたがいてくれて良かった」と言われた時、この仕事を選んで良かったと思います。',
    dayInLife: [
      '8:30 - 申し送り',
      '9:00 - バイタルチェック',
      '10:00 - 点滴・処置',
      '12:00 - 昼食介助',
      '13:00 - 休憩',
      '14:00 - 清潔ケア',
      '16:00 - 記録',
      '17:00 - 申し送り'
    ],
    careerPath: [
      '看護師 → 主任 → 師長 → 看護部長',
      '認定看護師・専門看護師',
      '訪問看護ステーション開業',
      '看護教員・研究者'
    ],
    futureOutlook: '高齢化で在宅医療が増加し、訪問看護の需要拡大。AIでは代替できない人間的ケアの重要性は不変。',
    relatedCareers: ['doctor', 'pharmacist', 'care-worker']
  },
  {
    id: 'pharmacist',
    title: '薬剤師',
    icon: '💊',
    category: 'medical',
    tagline: '薬のスペシャリスト',
    description: '医薬品の調剤・管理・服薬指導を行う。医師の処方箋に基づき、患者に適切な薬を提供し、安全な薬物療法をサポート。',
    education: ['薬学部6年 → 国家試験'],
    skills: ['薬学知識', '正確性', 'コミュニケーション', '責任感', '継続学習'],
    salary: {
      entry: '400-500万円',
      mid: '500-650万円',
      senior: '600-800万円'
    },
    workStyle: {
      hours: '平均8時間（薬局は土曜も営業）',
      location: '調剤薬局・病院・ドラッグストア・企業',
      flexibility: '中〜高'
    },
    pros: [
      '資格職で安定',
      '全国どこでも働ける',
      '比較的ワークライフバランス◎',
      '専門性が高い',
      '患者さんから感謝される'
    ],
    cons: [
      '6年間の学費が高額',
      '調剤作業は単調に感じることも',
      '立ち仕事',
      'AI化の懸念（単純調剤）',
      'ドラッグストアは日曜出勤も'
    ],
    realVoice: '患者さんが薬の飲み方で困っている時、丁寧に説明して「分かりました、ありがとう」と言ってもらえると嬉しいです。',
    dayInLife: [
      '9:00 - 開局準備',
      '9:30 - 調剤業務',
      '11:00 - 服薬指導',
      '12:30 - 休憩',
      '13:30 - 在庫管理',
      '14:00 - 調剤業務',
      '17:00 - 薬歴記入',
      '18:00 - 閉局'
    ],
    careerPath: [
      '薬剤師 → 管理薬剤師 → エリアマネージャー',
      '病院薬剤師として専門性追求',
      '薬局開業',
      '製薬企業（MR・研究職）'
    ],
    futureOutlook: '調剤ロボット普及で単純作業は減少。一方、在宅医療や専門薬剤師など高度な役割は拡大。',
    relatedCareers: ['doctor', 'nurse', 'researcher']
  },

  // Business
  {
    id: 'consultant',
    title: '経営コンサルタント',
    icon: '💼',
    category: 'business',
    tagline: '企業の課題を解決する',
    description: '企業の経営課題を分析し、解決策を提案・実行支援する。戦略立案から業務改善まで幅広く関わる。',
    education: ['大学（学部不問、MBAあれば尚可）'],
    skills: ['論理的思考', '問題解決力', 'プレゼン力', 'Excel/PowerPoint', '業界知識'],
    salary: {
      entry: '500-700万円',
      mid: '800-1500万円',
      senior: '1500-3000万円以上'
    },
    workStyle: {
      hours: '長時間（平均10-12時間）',
      location: 'クライアント先・オフィス',
      flexibility: '低い（激務）'
    },
    pros: [
      '高収入',
      '様々な業界を経験できる',
      '論理的思考力が鍛えられる',
      '経営者と直接仕事',
      '転職市場で高評価'
    ],
    cons: [
      '激務で残業が多い',
      '常に結果を求められる',
      'クライアントワークでストレス',
      'ワークライフバランス難',
      '30代で転職する人多い'
    ],
    realVoice: '大変ですが、クライアントの業績が上がり、経営者から感謝された時の達成感は格別。論理的思考力も飛躍的に向上しました。',
    dayInLife: [
      '9:00 - チームMTG',
      '10:00 - クライアント訪問',
      '12:00 - ランチMTG',
      '13:00 - データ分析',
      '16:00 - 資料作成',
      '19:00 - プレゼン準備',
      '21:00 - 帰宅（繁忙期は深夜も）'
    ],
    careerPath: [
      'アナリスト → コンサルタント → マネージャー → パートナー',
      '事業会社の経営企画へ転職',
      '起業',
      'ベンチャーのCXO'
    ],
    futureOutlook: 'DX需要で拡大中。ただし基礎的分析はAI化される可能性。戦略立案や実行支援は人間が不可欠。',
    relatedCareers: ['business-analyst', 'product-manager', 'entrepreneur']
  },
  {
    id: 'marketing',
    title: 'マーケター',
    icon: '📈',
    category: 'business',
    tagline: '商品と顧客をつなぐ',
    description: '市場調査・商品企画・広告宣伝などを通じて、商品やサービスを顧客に届ける戦略を立案・実行する。',
    education: ['大学（学部不問）'],
    skills: ['データ分析', '企画力', 'コミュニケーション', 'クリエイティブ', 'デジタルツール'],
    salary: {
      entry: '350-500万円',
      mid: '500-800万円',
      senior: '800-1500万円'
    },
    workStyle: {
      hours: '平均8-10時間',
      location: 'オフィス・リモート可',
      flexibility: '中〜高'
    },
    pros: [
      'クリエイティブと分析の両方',
      '成果が目に見える',
      '様々な部署と連携できる',
      '転職市場で需要高',
      'トレンドに敏感になれる'
    ],
    cons: [
      '成果が出ないと厳しい',
      '常に数字を追われる',
      '施策の効果測定が難しい',
      'トレンドの変化が早い',
      '部署間調整が大変'
    ],
    realVoice: '自分の施策でCV率が上がった時は最高に嬉しい。データと創造性、両方使える仕事です。',
    dayInLife: [
      '9:30 - データチェック',
      '10:00 - 施策企画MTG',
      '12:00 - ランチ',
      '13:00 - 広告運用',
      '15:00 - クリエイティブ制作',
      '17:00 - 効果分析',
      '18:30 - 報告資料作成'
    ],
    careerPath: [
      'アシスタント → マーケター → シニアマーケター → マーケティングマネージャー',
      'CMO',
      'フリーランスマーケター',
      '起業'
    ],
    futureOutlook: 'デジタルマーケティングは拡大中。AI活用が進むが、戦略立案や創造性は人間が必要。',
    relatedCareers: ['consultant', 'data-scientist', 'web-designer']
  },

  // Education
  {
    id: 'teacher',
    title: '教員（中学・高校）',
    icon: '👨‍🏫',
    category: 'education',
    tagline: '次世代を育てる',
    description: '教科指導だけでなく、生徒の人格形成にも深く関わる。授業、部活、進路指導など多岐にわたる業務。',
    education: ['大学で教員免許取得 → 教員採用試験'],
    skills: ['教科知識', 'コミュニケーション', '忍耐力', '企画力', '情熱'],
    salary: {
      entry: '300-400万円',
      mid: '450-600万円',
      senior: '600-800万円'
    },
    workStyle: {
      hours: '長時間（部活・事務作業で多忙）',
      location: '学校',
      flexibility: '低い'
    },
    pros: [
      '生徒の成長を見守れる',
      '安定した公務員',
      '夏休み・冬休みあり',
      '社会貢献性高い',
      '一生の思い出を作れる'
    ],
    cons: [
      '部活・事務作業で多忙',
      '保護者対応が大変',
      'いじめ・問題行動への対応',
      '休日出勤多い',
      '精神的負担が大きい'
    ],
    realVoice: '大変ですが、卒業生が「先生のおかげです」と言ってくれた時、この仕事を選んで本当に良かったと思います。',
    dayInLife: [
      '7:30 - 出勤・朝の打ち合わせ',
      '8:30 - 朝のHR',
      '9:00 - 授業',
      '12:00 - 昼休み（生徒対応）',
      '13:00 - 授業',
      '16:00 - 部活指導',
      '18:00 - 事務作業・教材準備',
      '20:00 - 帰宅'
    ],
    careerPath: [
      '教諭 → 学年主任 → 教頭 → 校長',
      '教育委員会',
      '塾・予備校講師',
      '教材開発'
    ],
    futureOutlook: 'ICT教育推進で役割変化。知識伝達はAI化されても、人格形成や個別指導は人間が不可欠。',
    relatedCareers: ['tutor', 'counselor', 'researcher']
  },

  // Service
  {
    id: 'cabin-crew',
    title: '客室乗務員（CA）',
    icon: '✈️',
    category: 'service',
    tagline: '空の上のおもてなし',
    description: '航空機内で乗客の安全を守り、快適なフライトを提供する。緊急時の対応も重要な役割。',
    education: ['大学・専門学校（学部不問）'],
    skills: ['英語力', 'ホスピタリティ', '臨機応変さ', 'チームワーク', '体力'],
    salary: {
      entry: '300-400万円',
      mid: '400-550万円',
      senior: '500-700万円'
    },
    workStyle: {
      hours: '不規則（国際線は時差あり）',
      location: '航空機内・空港',
      flexibility: '低い'
    },
    pros: [
      '世界中を旅できる',
      'ホテル・フライトが格安',
      'ホスピタリティが学べる',
      '様々な人と出会える',
      '華やかなイメージ'
    ],
    cons: [
      '不規則な生活リズム',
      '体力勝負',
      'クレーム対応が大変',
      '年齢制限への不安',
      '緊急時の責任が重い'
    ],
    realVoice: '時差ボケは大変ですが、世界中を飛び回れるのは最高。お客様の笑顔が何よりのやりがいです。',
    dayInLife: [
      '国際線の場合：',
      '14:00 - 空港集合・ブリーフィング',
      '16:00 - フライト出発',
      '17:00 - 機内サービス',
      '翌10:00 - 到着',
      '現地で2日間ステイ',
      '3日後 - 日本へ帰国'
    ],
    careerPath: [
      'CA → 先任CA → チーフパーサー',
      '地上職（客室訓練部門など）',
      '他業種へ転職（ホスピタリティ活かす）'
    ],
    futureOutlook: '航空需要は長期的に増加見込み。ただし自動化も進行。高度なホスピタリティは人間が必要。',
    relatedCareers: ['hotel-staff', 'tour-coordinator', 'interpreter']
  },

  // Engineering
  {
    id: 'architect',
    title: '建築士',
    icon: '🏗️',
    category: 'engineering',
    tagline: '空間を創造する',
    description: '建物の設計・監理を行う。デザイン性と機能性、安全性を両立させる専門職。',
    education: ['建築学科4年 → 実務経験 → 一級建築士試験'],
    skills: ['設計力', 'CAD', '構造計算', 'コミュニケーション', '美的センス'],
    salary: {
      entry: '300-450万円',
      mid: '500-700万円',
      senior: '700-1500万円以上'
    },
    workStyle: {
      hours: '平均9-10時間（納期前は長時間）',
      location: 'オフィス・現場',
      flexibility: '中'
    },
    pros: [
      '自分の作品が形に残る',
      'クリエイティブな仕事',
      '独立開業可能',
      '資格があれば長く働ける',
      '社会貢献性高い'
    ],
    cons: [
      '資格取得が難しい',
      '納期前は激務',
      'クライアントとの調整が大変',
      '責任が重い（安全性）',
      '現場は体力勝負'
    ],
    realVoice: '自分が設計した建物が完成した時の感動は何にも代えがたい。街に自分の作品が残るのは誇りです。',
    dayInLife: [
      '9:00 - 設計作業',
      '11:00 - クライアントMTG',
      '13:00 - 昼休憩',
      '14:00 - 現場確認',
      '16:00 - 図面修正',
      '18:00 - 構造検討',
      '19:00 - 明日の準備'
    ],
    careerPath: [
      '設計補助 → 一級建築士 → 主任設計者 → 設計部長',
      '独立開業',
      'ゼネコン・デベロッパー',
      '大学教員・研究者'
    ],
    futureOutlook: 'AIで基礎設計は効率化されるが、創造性や顧客との対話は人間不可欠。リノベーション需要増。',
    relatedCareers: ['civil-engineer', 'interior-designer', 'urban-planner']
  },

  // Public Service
  {
    id: 'civil-servant',
    title: '公務員（行政職）',
    icon: '🏛️',
    category: 'public',
    tagline: '社会の仕組みを支える',
    description: '国や地方自治体で、政策立案・実施、住民サービス提供などを行う。社会インフラを支える重要な役割。',
    education: ['大学（学部不問） → 公務員試験'],
    skills: ['法律知識', '事務処理能力', 'コミュニケーション', '公共性への意識'],
    salary: {
      entry: '300-400万円',
      mid: '500-700万円',
      senior: '700-1000万円'
    },
    workStyle: {
      hours: '平均8時間（部署により残業あり）',
      location: '官公庁・出先機関',
      flexibility: '中'
    },
    pros: [
      '安定性抜群',
      '社会貢献性高い',
      'ワークライフバランス◎',
      '福利厚生充実',
      '定年まで働ける'
    ],
    cons: [
      '給料の上昇が緩やか',
      '異動が多い',
      '前例主義・保守的',
      '住民対応が大変',
      '民間より自由度低い'
    ],
    realVoice: '地味な仕事が多いですが、自分の仕事が市民の生活を支えていると思うとやりがいを感じます。安定性も魅力です。',
    dayInLife: [
      '8:30 - 朝礼',
      '9:00 - 窓口対応',
      '11:00 - 資料作成',
      '12:00 - 昼休憩',
      '13:00 - 会議',
      '15:00 - 申請書類処理',
      '17:00 - 明日の準備',
      '17:30 - 退庁'
    ],
    careerPath: [
      '主事 → 主任 → 係長 → 課長補佐 → 課長 → 部長',
      '専門職（税務、福祉など）',
      '出向（外郭団体など）'
    ],
    futureOutlook: 'デジタル化で定型業務は減少。一方、政策立案や住民対応などの高度業務は人間が担う。',
    relatedCareers: ['teacher', 'urban-planner', 'social-worker']
  },

  // Research
  {
    id: 'researcher',
    title: '研究者',
    icon: '🔬',
    category: 'research',
    tagline: '未知を解明する',
    description: '大学や研究機関で、科学的な研究を行う。新しい発見や技術開発を通じて、人類の知識を前進させる。',
    education: ['大学4年 → 修士2年 → 博士3年 → ポスドク'],
    skills: ['専門知識', '研究デザイン', '論理的思考', '英語力', '忍耐力'],
    salary: {
      entry: '300-400万円（ポスドク）',
      mid: '500-700万円（准教授）',
      senior: '800-1200万円（教授）'
    },
    workStyle: {
      hours: '自由度高い（実験次第）',
      location: '大学・研究機関',
      flexibility: '高い'
    },
    pros: [
      '好奇心を追求できる',
      '世界初の発見の可能性',
      '自分のペースで研究',
      '国際的な活動',
      '知的刺激に満ちている'
    ],
    cons: [
      '任期制で不安定',
      'ポスト獲得が競争的',
      '給料が低い期間が長い',
      '成果が出ない時期の苦しさ',
      '研究費獲得のプレッシャー'
    ],
    realVoice: '不安定ですが、未知のことを解明する喜びは何にも代えがたい。論文が掲載された時の達成感は格別です。',
    dayInLife: [
      '10:00 - 論文執筆',
      '12:00 - 実験準備',
      '13:00 - 昼休憩',
      '14:00 - 実験実施',
      '17:00 - データ分析',
      '19:00 - 研究MTG',
      '20:00 - 論文読み'
    ],
    careerPath: [
      'ポスドク → 助教 → 准教授 → 教授',
      '企業の研究職',
      '研究所の主任研究員',
      'ベンチャー起業'
    ],
    futureOutlook: '基礎研究の重要性は不変。ただしポスト数は限られる。産学連携や企業研究職も選択肢。',
    relatedCareers: ['data-scientist', 'doctor', 'engineer']
  },
];

const CATEGORIES = {
  tech: { label: 'IT・テクノロジー', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  medical: { label: '医療・福祉', icon: '⚕️', color: 'from-red-500 to-pink-500' },
  creative: { label: 'クリエイティブ', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  business: { label: 'ビジネス', icon: '💼', color: 'from-orange-500 to-yellow-500' },
  education: { label: '教育', icon: '📚', color: 'from-green-500 to-emerald-500' },
  service: { label: 'サービス', icon: '✨', color: 'from-pink-500 to-rose-500' },
  engineering: { label: '工学・建築', icon: '🏗️', color: 'from-gray-600 to-gray-800' },
  public: { label: '公務員', icon: '🏛️', color: 'from-blue-600 to-indigo-600' },
  research: { label: '研究', icon: '🔬', color: 'from-indigo-500 to-purple-600' },
};

interface Props {
  onSelectCareer?: (career: Career) => void;
}

export default function CareerDictionary({ onSelectCareer }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCareers = CAREERS.filter(career => {
    const matchesCategory = !selectedCategory || career.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      career.title.includes(searchQuery) ||
      career.tagline.includes(searchQuery) ||
      career.description.includes(searchQuery) ||
      career.skills.some(s => s.includes(searchQuery));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🗂️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            進路図鑑
          </h2>
          <p className="text-gray-600">
            30種類以上の職業を詳しく紹介。あなたの未来のヒントに。
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="キーワードで検索（例：プログラミング、安定、クリエイティブ...）"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-4">カテゴリで絞り込む</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-4 rounded-xl border-2 transition-all ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">🌟</div>
              <div className="font-semibold text-sm">すべて</div>
            </button>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === key
                    ? `bg-gradient-to-r ${cat.color} text-white border-transparent`
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="font-semibold text-sm">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCareers.map(career => (
            <button
              key={career.id}
              onClick={() => setSelectedCareer(career)}
              className="p-6 bg-white border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-center mb-3">
                <div className="text-4xl mr-3">{career.icon}</div>
                <div>
                  <div className="font-bold text-gray-900">{career.title}</div>
                  <div className="text-xs text-gray-500">{CATEGORIES[career.category].label}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-blue-600 mb-2">
                {career.tagline}
              </div>
              <div className="text-sm text-gray-700 line-clamp-2 mb-3">
                {career.description}
              </div>
              <div className="text-xs text-gray-600">
                初任給: {career.salary.entry}
              </div>
            </button>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            該当する職業が見つかりませんでした
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center">
                <div className="text-5xl mr-4">{selectedCareer.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCareer.title}</h2>
                  <p className="text-blue-100">{selectedCareer.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCareer(null)}
                className="text-white hover:text-gray-200 text-3xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Description */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200">
                <p className="text-gray-700 leading-relaxed">{selectedCareer.description}</p>
              </div>

              {/* Salary */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">💰</span>
                  年収の目安
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-xs text-gray-600 mb-1">初任給</div>
                    <div className="font-bold text-green-700">{selectedCareer.salary.entry}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">中堅</div>
                    <div className="font-bold text-blue-700">{selectedCareer.salary.mid}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">ベテラン</div>
                    <div className="font-bold text-purple-700">{selectedCareer.salary.senior}</div>
                  </div>
                </div>
              </div>

              {/* Work Style */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">⏰</span>
                  働き方
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 w-24">労働時間:</span>
                    <span className="text-sm text-gray-900">{selectedCareer.workStyle.hours}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 w-24">勤務場所:</span>
                    <span className="text-sm text-gray-900">{selectedCareer.workStyle.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 w-24">柔軟性:</span>
                    <span className="text-sm text-gray-900">{selectedCareer.workStyle.flexibility}</span>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-xl mr-2">🎓</span>
                  必要な学歴・資格
                </h3>
                <ul className="space-y-1">
                  {selectedCareer.education.map((edu, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-xl mr-2">🛠️</span>
                  必要なスキル
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">👍</span>
                    メリット
                  </h3>
                  <ul className="space-y-1">
                    {selectedCareer.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">👎</span>
                    デメリット
                  </h3>
                  <ul className="space-y-1">
                    {selectedCareer.cons.map((con, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Real Voice */}
              <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-xl mr-2">💬</span>
                  現場の声
                </h3>
                <p className="text-gray-700 italic">「{selectedCareer.realVoice}」</p>
              </div>

              {/* Day in Life */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">📅</span>
                  ある1日のスケジュール
                </h3>
                <div className="space-y-2">
                  {selectedCareer.dayInLife.map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-20 text-sm text-gray-600 flex-shrink-0">
                        {item.split(' - ')[0]}
                      </div>
                      <div className="text-sm text-gray-900">
                        {item.split(' - ')[1]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Path */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-xl mr-2">🚀</span>
                  キャリアパス
                </h3>
                <ul className="space-y-1">
                  {selectedCareer.careerPath.map((path, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">→</span>
                      <span>{path}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Future Outlook */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-xl mr-2">🔮</span>
                  将来性
                </h3>
                <p className="text-gray-700">{selectedCareer.futureOutlook}</p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    setSelectedCareer(null);
                    if (onSelectCareer) onSelectCareer(selectedCareer);
                  }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  💬 この職業について対話する
                </button>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
