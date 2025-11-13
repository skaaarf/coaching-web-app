'use client';

import React, { useState } from 'react';

export interface Persona {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatar: string;
  category: 'conflicted' | 'driven' | 'uncertain' | 'pressured' | 'explorer' | 'practical';
  tagline: string;
  description: string;
  values: string[];
  concerns: string[];
  dreams: string[];
  background: string;
  personality: string;
  quote: string;
  relatedPersonas: string[];
}

const PERSONAS: Persona[] = [
  // Conflicted - 葛藤タイプ
  {
    id: 'yuki',
    name: 'ゆうき',
    age: 17,
    grade: '高校2年生',
    avatar: '🎭',
    category: 'conflicted',
    tagline: '親の期待と自分の夢の間で揺れている',
    description: '医者の両親から医学部進学を期待されているが、本当は音楽の道に進みたい。',
    values: ['自己表現', '創造性', '家族の期待'],
    concerns: ['親を裏切ることへの罪悪感', '音楽で食べていけるか不安', '将来の経済的安定'],
    dreams: ['音楽プロデューサーになる', '親にも認めてもらえる道を見つける', '好きなことで生きていく'],
    background: '幼少期からピアノを習い、中学時代にバンドを組んで作曲を始めた。音楽の才能を認められることもあるが、両親は「趣味程度に」と理解を示さない。',
    personality: '真面目で優等生。人の期待に応えようと頑張りすぎる傾向がある。内に秘めた情熱は強いが、それを表に出すのが苦手。',
    quote: '好きなことをやりたい気持ちと、親を悲しませたくない気持ち、どっちも本当なんです',
    relatedPersonas: ['sakura', 'daichi', 'mei']
  },
  {
    id: 'sakura',
    name: 'さくら',
    age: 18,
    grade: '高校3年生',
    avatar: '🌸',
    category: 'conflicted',
    tagline: '安定と挑戦、どちらを選ぶべきか',
    description: '地元の国立大学に進学すべきか、東京の私立大学でやりたいことに挑戦すべきか悩んでいる。',
    values: ['安定', '新しい挑戦', '経済的現実'],
    concerns: ['奨学金の返済', '親に負担をかけること', '地元を離れる不安'],
    dreams: ['デザイナーになりたい', '都会で刺激的な生活を送りたい', '親孝行もしたい'],
    background: '地方出身で、家計はそれほど裕福ではない。絵を描くのが好きで、デザインの勉強をしたいが、親は安定した地元の国立大学を勧める。',
    personality: '慎重で現実的だが、心の中では大きな夢を持っている。周りの目を気にしすぎる傾向がある。',
    quote: 'やりたいことと、現実的な選択。大人になるって、どっちかを諦めるってことなのかな',
    relatedPersonas: ['yuki', 'haruto', 'rina']
  },
  {
    id: 'mei',
    name: 'めい',
    age: 17,
    grade: '高校2年生',
    avatar: '💭',
    category: 'conflicted',
    tagline: '友達と同じ道を選ぶべきか、自分の道を行くべきか',
    description: '親友たちが文系を選ぶ中、自分だけ理系に進みたい。仲間外れになるのが怖い。',
    values: ['友情', '自分らしさ', '帰属意識'],
    concerns: ['友達と離れ離れになること', '一人になる孤独', '間違った選択をする不安'],
    dreams: ['研究者になりたい', '友達とも良い関係を保ちたい', '自分の興味を追求したい'],
    background: '中学時代から理科が好きで、特に生物学に興味がある。しかし親友グループの全員が文系を選択することになり、孤立を恐れている。',
    personality: '優しくて協調性が高い。集団に馴染むことを重視するが、本当の自分を抑え込んでしまうことも。',
    quote: 'みんなと一緒がいい。でも、本当にやりたいことを諦めるのも違う気がして...',
    relatedPersonas: ['yuki', 'aoi', 'sora']
  },

  // Driven - 目標明確タイプ
  {
    id: 'daichi',
    name: 'だいち',
    age: 18,
    grade: '高校3年生',
    avatar: '⚽',
    category: 'driven',
    tagline: 'スポーツ推薦か、一般受験か',
    description: 'サッカーで大学から推薦の話があるが、怪我のリスクも考えて一般受験も視野に。',
    values: ['努力', '情熱', '現実的な判断'],
    concerns: ['怪我でキャリアが終わること', 'サッカー以外の道', '将来の選択肢の広さ'],
    dreams: ['プロサッカー選手になる', 'でもそれがダメでも生きていける力をつけたい'],
    background: '小学生からサッカー一筋。県大会で活躍し、複数の大学から推薦の話が来ている。しかし最近軽い怪我が続き、将来への不安も。',
    personality: '前向きで行動力がある。でも最近は現実的になり始め、「Plan B」の重要性も考えるようになった。',
    quote: 'サッカーは全力でやる。でも、それだけじゃダメなのかもって最近思うんです',
    relatedPersonas: ['haruto', 'ren', 'sho']
  },
  {
    id: 'haruto',
    name: 'はると',
    age: 17,
    grade: '高校2年生',
    avatar: '💻',
    category: 'driven',
    tagline: 'プログラミングで起業したい',
    description: '高校生起業家を目指して独学でアプリ開発。大学進学は必要なのか悩む。',
    values: ['起業家精神', '実践的学び', '自由'],
    concerns: ['学歴の必要性', '失敗のリスク', '親の反対'],
    dreams: ['10代で起業する', 'テクノロジーで社会を変える', '経済的独立を早く達成する'],
    background: '中学時代から独学でプログラミングを学び、すでに小規模なアプリをリリース。大学に行く意味を見出せない一方、人脈や経営学は学びたい。',
    personality: '自信があり行動力抜群。ただし少し性急で、長期的視点が欠けることも。',
    quote: '大学の4年間って、ビジネスの世界では長すぎるんですよね',
    relatedPersonas: ['daichi', 'yuto', 'ren']
  },
  {
    id: 'yuto',
    name: 'ゆうと',
    age: 18,
    grade: '高校3年生',
    avatar: '🎨',
    category: 'driven',
    tagline: '美大一直線、でも不安もある',
    description: '絵を描くことが生きがい。美大進学を決めているが、卒業後の進路には漠然とした不安が。',
    values: ['芸術', '自己表現', '創造的な生き方'],
    concerns: ['美大卒業後の就職', '経済的に自立できるか', '親に理解してもらえるか'],
    dreams: ['イラストレーターとして活躍', '自分の作品で人を感動させる', '好きなことで生計を立てる'],
    background: '幼少期から絵が好きで、美術の先生からも才能を認められている。しかし「絵では食べていけない」という周囲の声も気になる。',
    personality: '感受性が豊かで内省的。作品には自信があるが、ビジネス面では無頓着。',
    quote: '絵を描いてる時が一番自分らしい。でも、それだけで生きていけるのかな',
    relatedPersonas: ['haruto', 'aoi', 'mio']
  },

  // Uncertain - 進路未定タイプ
  {
    id: 'sora',
    name: 'そら',
    age: 17,
    grade: '高校2年生',
    avatar: '☁️',
    category: 'uncertain',
    tagline: 'やりたいことが見つからない',
    description: '特にやりたいことがなく、周りが進路を決めていく中で焦りを感じている。',
    values: ['安定', '平穏', 'まだ分からない'],
    concerns: ['取り残される不安', '決められない自分', '将来への漠然とした恐怖'],
    dreams: ['まずはやりたいことを見つけたい', '誰かに決めてほしい気持ちもある', '後悔しない選択をしたい'],
    background: '勉強も部活も平均的にこなしてきた。特に強い興味も嫌いなこともない。そのため進路選択で何を基準にすべきか分からない。',
    personality: '穏やかで優しい。でも優柔不断で、決断を先延ばしにする癖がある。',
    quote: '特に嫌いなことはないけど、好きなこともない。それって贅沢な悩みなのかな',
    relatedPersonas: ['mei', 'hina', 'kenta']
  },
  {
    id: 'hina',
    name: 'ひな',
    age: 18,
    grade: '高校3年生',
    avatar: '🌙',
    category: 'uncertain',
    tagline: '広く浅く、でも深掘りできない',
    description: 'いろんなことに興味があるが、どれも中途半端。一つに絞れない。',
    values: ['多様性', '好奇心', '可能性'],
    concerns: ['一つに絞ることへの恐れ', '機会損失', '飽きっぽい自分'],
    dreams: ['色々なことに挑戦したい', 'でも何か一つを極めたい気持ちもある', '自分の「これだ！」を見つけたい'],
    background: '文化祭の実行委員、軽音部、ボランティアなど多方面で活動。でもどれも「好き」だが「これだ！」というものがない。',
    personality: '社交的で器用。でも広く浅くになりがちで、深く追求する前に次に移ってしまう。',
    quote: 'あれもこれも好き。でも、どれが"本当に"好きなのか分からなくて',
    relatedPersonas: ['sora', 'aoi', 'rina']
  },
  {
    id: 'kenta',
    name: 'けんた',
    age: 17,
    grade: '高校2年生',
    avatar: '🤔',
    category: 'uncertain',
    tagline: '無難な選択しかできない',
    description: 'リスクを避けて安全な道を選んできた。でも、それでいいのか分からない。',
    values: ['安全', '失敗回避', '確実性'],
    concerns: ['チャレンジしないことへの後悔', '人生が退屈になること', '本当の自分を見失うこと'],
    dreams: ['もっと冒険したい気持ちもある', '失敗しても大丈夫な生き方', '後悔しない人生'],
    background: '親の言うことを聞いて、常に安全な選択をしてきた。成績も中堅で、特に問題もない。でも最近、このままでいいのか疑問に。',
    personality: '慎重でリスク回避的。真面目だが、自分の本当の気持ちが分からなくなっている。',
    quote: '失敗したくない。でも、挑戦しないのも失敗なのかもって思い始めてる',
    relatedPersonas: ['sora', 'sakura', 'tsubasa']
  },

  // Pressured - プレッシャータイプ
  {
    id: 'ren',
    name: 'れん',
    age: 18,
    grade: '高校3年生',
    avatar: '📚',
    category: 'pressured',
    tagline: '進学校のプレッシャーに押しつぶされそう',
    description: '周りは皆有名大学を目指している。自分も頑張ってるけど、本当に行きたいのか分からない。',
    values: ['学歴', '親の期待', '自分の意志'],
    concerns: ['受験のプレッシャー', '期待に応えられないこと', '本当にやりたいことが分からない'],
    dreams: ['とりあえず良い大学に入りたい', 'でも入った後何がしたいか分からない', 'プレッシャーから解放されたい'],
    background: '進学校に通い、幼い頃から塾通い。勉強はできるが、それが自分の意志なのか親の期待なのか曖昧になっている。',
    personality: '真面目で努力家。でも燃え尽きかけている。自分の気持ちより周りの期待を優先する癖がある。',
    quote: '頑張ってるけど、何のために頑張ってるのか分からなくなってきた',
    relatedPersonas: ['yuki', 'sho', 'riko']
  },
  {
    id: 'sho',
    name: 'しょう',
    age: 18,
    grade: '高校3年生',
    avatar: '🎯',
    category: 'pressured',
    tagline: '兄弟と比較され続けてきた',
    description: '優秀な兄がいて、常に比較される。自分なりの道を見つけたいが、期待も重い。',
    values: ['認められたい', '自分の価値', '家族への愛'],
    concerns: ['比較されること', '兄を超えられないかもしれない不安', '自分だけの道を見つけたい'],
    dreams: ['兄とは違う道で成功したい', '親に認めてもらいたい', '比較されない自分になりたい'],
    background: '東大卒の兄がいて、常に「お兄ちゃんは」と言われて育った。自分も頭は良いが、同じ道は選びたくない。',
    personality: '負けず嫌いで自立心が強い。でも家族の期待に応えたい気持ちも強く、葛藤している。',
    quote: '兄とは違う。僕には僕の道がある。それを証明したい',
    relatedPersonas: ['ren', 'daichi', 'yuki']
  },
  {
    id: 'riko',
    name: 'りこ',
    age: 17,
    grade: '高校2年生',
    avatar: '👔',
    category: 'pressured',
    tagline: '家業を継ぐべきか、自分の道を行くべきか',
    description: '老舗の和菓子屋の娘。家業を継ぐことが当然とされているが、本当は獣医になりたい。',
    values: ['伝統', '家族の期待', '自分の夢'],
    concerns: ['家業の将来', '親を裏切ること', '伝統を絶やすこと'],
    dreams: ['動物を助ける獣医になりたい', '家業も大切にしたい', '両立する道を見つけたい'],
    background: '3代続く和菓子屋の一人娘。小さい頃から「後継ぎ」として育てられたが、動物が大好きで獣医になるのが夢。',
    personality: '責任感が強く、家族思い。でも自分の夢も諦めきれず、板挟みになっている。',
    quote: '家のためと、自分のため。どっちかしか選べないのかな',
    relatedPersonas: ['yuki', 'sakura', 'tsubasa']
  },

  // Explorer - 探求タイプ
  {
    id: 'aoi',
    name: 'あおい',
    age: 17,
    grade: '高校2年生',
    avatar: '🔬',
    category: 'explorer',
    tagline: '研究者になりたい、でも道は険しい',
    description: '科学に魅了されている。研究者の道は長く厳しいが、それでも進みたい。',
    values: ['知的好奇心', '探求心', '真理の追求'],
    concerns: ['研究職の競争の激しさ', '経済的な不安定さ', '博士課程まで行く覚悟'],
    dreams: ['大学教授になりたい', 'ノーベル賞級の発見をしたい', '知的な環境で生きていきたい'],
    background: '幼い頃から科学番組が好きで、中学で化学にハマった。研究者の道は狭き門だと知っているが、それでも諦められない。',
    personality: '知的で内省的。研究となると時間を忘れて没頭する。社交的ではないが、話す内容は深い。',
    quote: '未知を解明する。それ以上にワクワクすることってありますか？',
    relatedPersonas: ['mei', 'yuto', 'hina']
  },
  {
    id: 'mio',
    name: 'みお',
    age: 18,
    grade: '高校3年生',
    avatar: '🌍',
    category: 'explorer',
    tagline: '世界を旅して働きたい',
    description: '国際協力の仕事に興味がある。グローバルに活躍したいが、具体的な道は模索中。',
    values: ['国際貢献', '多様性', '冒険'],
    concerns: ['具体的なキャリアパス', '語学力', '親の理解'],
    dreams: ['発展途上国支援に関わりたい', '世界中を飛び回りたい', '文化の架け橋になりたい'],
    background: '中学の時にボランティアで海外に行き、国際協力に興味を持った。でも具体的にどうすればいいか分からない。',
    personality: '好奇心旺盛で行動的。異文化への関心が強い。でも計画性には欠ける。',
    quote: '世界は広い。日本だけじゃなくて、もっと広い世界で生きてみたい',
    relatedPersonas: ['hina', 'rina', 'tsubasa']
  },
  {
    id: 'tsubasa',
    name: 'つばさ',
    age: 17,
    grade: '高校2年生',
    avatar: '✈️',
    category: 'explorer',
    tagline: 'まだ見ぬ可能性を探している',
    description: 'ギャップイヤーを取りたい。大学の前に、世界を見てから決めたい。',
    values: ['経験', '自己発見', '型にはまらない生き方'],
    concerns: ['日本での理解のなさ', '遅れを取ること', '親の反対'],
    dreams: ['1年間世界を旅したい', '自分が本当に何をしたいか見つけたい', '普通じゃない人生を送りたい'],
    background: '海外ドラマでギャップイヤーの概念を知り、魅了された。でも日本では一般的でなく、周りに理解されない。',
    personality: '冒険心があり、既存の枠にとらわれない。でも周囲との温度差に孤独を感じることも。',
    quote: '人生は一度きり。普通のレールに乗る前に、自分で道を探したい',
    relatedPersonas: ['mio', 'haruto', 'kenta']
  },

  // Practical - 実践的タイプ
  {
    id: 'rina',
    name: 'りな',
    age: 18,
    grade: '高校3年生',
    avatar: '💼',
    category: 'practical',
    tagline: '看護師になると決めている',
    description: '人の役に立つ仕事がしたい。看護師は安定していて、やりがいもある。',
    values: ['安定', '社会貢献', '実践的スキル'],
    concerns: ['夜勤の大変さ', '感情的負担', '給料の限界'],
    dreams: ['認定看護師になりたい', '患者さんに信頼される看護師になりたい', '安定した生活を送りたい'],
    background: '祖母が入院した時の看護師さんに憧れた。資格があれば全国どこでも働けるし、人の役にも立てる。現実的で良い選択だと思っている。',
    personality: '現実的で堅実。人の役に立つことに喜びを感じる。感情移入しやすい面もある。',
    quote: '華やかじゃないかもしれないけど、誰かの支えになれる仕事がしたい',
    relatedPersonas: ['sakura', 'kenta', 'riko']
  },
  {
    id: 'koji',
    name: 'こうじ',
    age: 17,
    grade: '高校2年生',
    avatar: '🔧',
    category: 'practical',
    tagline: '手に職をつけたい',
    description: '工業高校に通っている。大学より専門学校や就職を考えている。',
    values: ['実践的スキル', '早期の経済的自立', '手に職'],
    concerns: ['学歴社会での評価', '将来の給料の天井', 'キャリアアップの限界'],
    dreams: ['技術者として認められたい', '早く親から自立したい', 'いずれは独立したい'],
    background: '普通科より工業高校を選んだ。ものづくりが好きで、座学より実習が向いている。大学進学より早く社会に出たい。',
    personality: '実直で手を動かすことが好き。理論より実践派。少し不器用だが誠実。',
    quote: '大卒じゃなくても、技術があれば生きていける。それを証明したい',
    relatedPersonas: ['daichi', 'rina', 'sakura']
  },
  {
    id: 'nana',
    name: 'なな',
    age: 18,
    grade: '高校3年生',
    avatar: '🏥',
    category: 'practical',
    tagline: '薬剤師を目指している',
    description: '理系で資格が取れる。6年間は長いけど、安定した職業。',
    values: ['資格', '専門性', '安定収入'],
    concerns: ['6年間の学費', '薬剤師の将来性', 'AI化の影響'],
    dreams: ['病院薬剤師になりたい', '専門性を活かして働きたい', '安定した生活を送りたい'],
    background: '理系科目が得意で、資格職を調べた結果、薬剤師を選んだ。母も薬剤師で、仕事と家庭の両立ができることも魅力。',
    personality: '計画的で合理的。リスクをしっかり計算して選択する。少し保守的だが堅実。',
    quote: '理系の資格職。将来性も考えたら、いい選択だと思ってる',
    relatedPersonas: ['rina', 'sakura', 'aoi']
  },
];

const CATEGORIES = {
  conflicted: { label: '葛藤タイプ', icon: '🎭', color: 'from-purple-500 to-pink-500' },
  driven: { label: '目標明確タイプ', icon: '🎯', color: 'from-orange-500 to-red-500' },
  uncertain: { label: '進路未定タイプ', icon: '☁️', color: 'from-gray-400 to-gray-600' },
  pressured: { label: 'プレッシャータイプ', icon: '⚡', color: 'from-yellow-500 to-orange-600' },
  explorer: { label: '探求タイプ', icon: '🔭', color: 'from-blue-500 to-cyan-500' },
  practical: { label: '実践的タイプ', icon: '🛠️', color: 'from-green-500 to-emerald-600' },
};

interface Props {
  onSelectPersona?: (persona: Persona) => void;
}

export default function PersonaDictionary({ onSelectPersona }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPersonas = PERSONAS.filter(persona => {
    const matchesCategory = !selectedCategory || persona.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      persona.name.includes(searchQuery) ||
      persona.tagline.includes(searchQuery) ||
      persona.description.includes(searchQuery) ||
      persona.values.some(v => v.includes(searchQuery)) ||
      persona.concerns.some(c => c.includes(searchQuery));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            心の図鑑
          </h2>
          <p className="text-gray-600">
            いろんな高校生の悩みや想い。あなたに近いのは誰？
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="キーワードで検索（例：音楽、安定、親の期待...）"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-4">カテゴリで絞り込む</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

        {/* Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPersonas.map(persona => (
            <button
              key={persona.id}
              onClick={() => setSelectedPersona(persona)}
              className="p-6 bg-white border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-center mb-3">
                <div className="text-4xl mr-3">{persona.avatar}</div>
                <div>
                  <div className="font-bold text-gray-900">{persona.name}</div>
                  <div className="text-xs text-gray-500">{persona.grade}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-blue-600 mb-2">
                {persona.tagline}
              </div>
              <div className="text-sm text-gray-700 line-clamp-2">
                {persona.description}
              </div>
            </button>
          ))}
        </div>

        {filteredPersonas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            該当するキャラクターが見つかりませんでした
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPersona && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center">
                <div className="text-5xl mr-4">{selectedPersona.avatar}</div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedPersona.name}</h2>
                  <p className="text-blue-100">{selectedPersona.grade}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPersona(null)}
                className="text-white hover:text-gray-200 text-3xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tagline */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200">
                <p className="text-lg font-bold text-gray-900">{selectedPersona.tagline}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">💭 状況</h3>
                <p className="text-gray-700 leading-relaxed">{selectedPersona.description}</p>
              </div>

              {/* Quote */}
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 italic">「{selectedPersona.quote}」</p>
              </div>

              {/* Background */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">📚 背景</h3>
                <p className="text-gray-700 leading-relaxed">{selectedPersona.background}</p>
              </div>

              {/* Personality */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">✨ 性格</h3>
                <p className="text-gray-700 leading-relaxed">{selectedPersona.personality}</p>
              </div>

              {/* Values */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">💎 大切にしていること</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPersona.values.map((value, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">😰 悩んでいること</h3>
                <ul className="space-y-1">
                  {selectedPersona.concerns.map((concern, i) => (
                    <li key={i} className="text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dreams */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">🌟 夢・願望</h3>
                <ul className="space-y-1">
                  {selectedPersona.dreams.map((dream, i) => (
                    <li key={i} className="text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{dream}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    setSelectedPersona(null);
                    if (onSelectPersona) onSelectPersona(selectedPersona);
                  }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  💬 このキャラクターについて対話する
                </button>
                <button
                  onClick={() => setSelectedPersona(null)}
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
