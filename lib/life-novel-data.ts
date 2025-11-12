export interface NovelScene {
  id: string;
  age: number;
  title: string;
  description: string;
  choices: NovelChoice[];
  isEnding?: boolean;
}

export interface NovelChoice {
  id: string;
  text: string;
  nextSceneId: string;
  effects?: {
    money?: number;
    stress?: number;
    happiness?: number;
    skills?: string[];
    path?: string;
    education?: string;
    job?: string;
  };
}

export interface PlayerStatus {
  age: number;
  money: number; // 経済状況 (0-100)
  stress: number; // ストレス (0-100)
  happiness: number; // 幸福度 (0-100)
  skills: string[]; // 習得スキル
  path: string; // 進路（文系、理系など）
  education: string; // 学歴
  job?: string; // 職業
}

export const NOVEL_SCENES: Record<string, NovelScene> = {
  'start': {
    id: 'start',
    age: 16,
    title: '高校2年生の春',
    description: 'あなたは高校2年生になりました。今日は文理選択の締切日。どちらの道に進むか、決めなければなりません。\n\n教室で友達と話していると、先生から「放課後、進路指導室に来るように」と言われました。',
    choices: [
      {
        id: 'choose_liberal_arts',
        text: '文系を選ぶ（歴史や文学が好き）',
        nextSceneId: 'liberal_arts_path',
        effects: { happiness: 10 }
      },
      {
        id: 'choose_science',
        text: '理系を選ぶ（数学や科学が好き）',
        nextSceneId: 'science_path',
        effects: { happiness: 10 }
      },
      {
        id: 'choose_unsure',
        text: 'まだ決められない...悩んでいる',
        nextSceneId: 'guidance_counselor',
        effects: { stress: 15 }
      }
    ]
  },

  'liberal_arts_path': {
    id: 'liberal_arts_path',
    age: 17,
    title: '高校3年生 - 文系コース',
    description: '文系を選んだあなた。国語と社会の授業が増え、毎日充実しています。\n\n夏休みが近づき、進路について考える時期になりました。友達の中には推薦入試を狙う人、一般入試で難関大学を目指す人、専門学校に行く人、様々です。',
    choices: [
      {
        id: 'aim_university',
        text: '大学進学を目指す（一般入試）',
        nextSceneId: 'university_prep',
        effects: { stress: 20, skills: ['学習習慣'] }
      },
      {
        id: 'aim_vocational',
        text: '専門学校を考える',
        nextSceneId: 'vocational_school_choice',
        effects: { happiness: 5 }
      },
      {
        id: 'consider_work',
        text: '就職も視野に入れる',
        nextSceneId: 'job_hunting_highschool',
        effects: { money: 10 }
      }
    ]
  },

  'science_path': {
    id: 'science_path',
    age: 17,
    title: '高校3年生 - 理系コース',
    description: '理系を選んだあなた。数学と理科の授業が増え、実験や演習に追われる日々です。\n\n夏休みが近づき、進路について考える時期になりました。理系は選択肢が多く、迷ってしまいます。',
    choices: [
      {
        id: 'aim_engineering',
        text: '工学部を目指す',
        nextSceneId: 'university_prep',
        effects: { stress: 20, skills: ['論理的思考'] }
      },
      {
        id: 'aim_medical',
        text: '医療系を目指す',
        nextSceneId: 'medical_prep',
        effects: { stress: 30, skills: ['忍耐力'] }
      },
      {
        id: 'aim_it_vocational',
        text: 'IT系の専門学校を考える',
        nextSceneId: 'it_vocational',
        effects: { happiness: 10, skills: ['プログラミング基礎'] }
      }
    ]
  },

  'guidance_counselor': {
    id: 'guidance_counselor',
    age: 16,
    title: '進路指導室で',
    description: '進路指導室で先生と話をしました。\n\n「焦らなくていいよ。でも、自分が何に興味があるか、考えてみることは大切だね。得意な科目は？やってみたいことは？」\n\n先生の質問に答えているうちに、少し頭が整理されてきました。',
    choices: [
      {
        id: 'realize_liberal_arts',
        text: '文系に興味があることに気づく',
        nextSceneId: 'liberal_arts_path',
        effects: { stress: -10, happiness: 15 }
      },
      {
        id: 'realize_science',
        text: '理系に興味があることに気づく',
        nextSceneId: 'science_path',
        effects: { stress: -10, happiness: 15 }
      }
    ]
  },

  'university_prep': {
    id: 'university_prep',
    age: 17,
    title: '受験勉強の日々',
    description: '大学受験を決意したあなた。毎日図書館に通い、夜遅くまで勉強する日々が始まりました。\n\nある日、突然母親から電話がかかってきました。「父さんが倒れて入院したの...」\n\n家計が苦しくなるかもしれません。どうしますか？',
    choices: [
      {
        id: 'continue_exam_prep',
        text: '奨学金を前提に受験を続ける',
        nextSceneId: 'exam_result_scholarship',
        effects: { stress: 30, money: -20 }
      },
      {
        id: 'consider_cheaper_school',
        text: '学費の安い大学に志望変更',
        nextSceneId: 'exam_result_public',
        effects: { stress: 25, money: -10 }
      },
      {
        id: 'give_up_university',
        text: '大学進学を諦めて就職を考える',
        nextSceneId: 'job_hunting_crisis',
        effects: { stress: 40, happiness: -20, money: 10 }
      },
      {
        id: 'work_and_study',
        text: '働きながら通える夜間大学を目指す',
        nextSceneId: 'night_school_prep',
        effects: { stress: 35, money: 5 }
      }
    ]
  },

  'exam_result_scholarship': {
    id: 'exam_result_scholarship',
    age: 18,
    title: '合格発表の日',
    description: '必死で勉強した結果、第一志望の大学に合格しました！\n\n奨学金の申請も通り、大学に通えることになりました。ただし、卒業後に返済が始まります。月々の返済額を考えると、少し不安もあります。',
    choices: [
      {
        id: 'university_life_scholarship',
        text: '大学生活を始める',
        nextSceneId: 'university_life_busy',
        effects: { happiness: 30, money: -30, skills: ['責任感'] }
      }
    ]
  },

  'exam_result_public': {
    id: 'exam_result_public',
    age: 18,
    title: '合格発表の日',
    description: '地元の国公立大学に合格しました！\n\n学費も比較的安く、実家から通えるため、経済的な負担は少なくて済みそうです。',
    choices: [
      {
        id: 'university_life_public',
        text: '大学生活を始める',
        nextSceneId: 'university_life_stable',
        effects: { happiness: 25, money: -10, skills: ['堅実性'] }
      }
    ]
  },

  'university_life_busy': {
    id: 'university_life_busy',
    age: 19,
    title: '大学1年生 - 忙しい日々',
    description: '奨学金で大学に通うあなた。学費と生活費のため、アルバイトも始めました。\n\n授業、バイト、課題...忙しい日々ですが、友達もできて楽しい大学生活です。ただ、最近少し疲れが溜まっています。',
    choices: [
      {
        id: 'focus_on_study',
        text: 'バイトを減らして勉強に集中',
        nextSceneId: 'university_academic',
        effects: { stress: -10, money: -10, skills: ['専門知識'] }
      },
      {
        id: 'balance_work_study',
        text: 'バイトと勉強をバランスよく',
        nextSceneId: 'university_balanced',
        effects: { stress: 10, money: 10, skills: ['時間管理'] }
      },
      {
        id: 'focus_on_work',
        text: 'バイトを増やして貯金する',
        nextSceneId: 'university_working',
        effects: { stress: 20, money: 30, happiness: -10 }
      }
    ]
  },

  'university_life_stable': {
    id: 'university_life_stable',
    age: 19,
    title: '大学1年生 - 充実した日々',
    description: '実家から通う大学生活。経済的な心配が少ない分、いろいろなことに挑戦できます。\n\nサークルに入る？ボランティア活動に参加する？それとも資格の勉強をする？',
    choices: [
      {
        id: 'join_circle',
        text: 'サークルで交友関係を広げる',
        nextSceneId: 'university_social',
        effects: { happiness: 20, skills: ['コミュニケーション力'] }
      },
      {
        id: 'focus_on_grades',
        text: 'GPA を上げて就活に備える',
        nextSceneId: 'university_academic',
        effects: { stress: 10, skills: ['専門知識', '計画性'] }
      },
      {
        id: 'part_time_experience',
        text: 'インターンやバイトで社会経験',
        nextSceneId: 'university_practical',
        effects: { money: 15, skills: ['実務経験', '社会性'] }
      }
    ]
  },

  'university_academic': {
    id: 'university_academic',
    age: 21,
    title: '大学3年生 - 就活の始まり',
    description: '勉強に力を入れてきたあなた。成績も優秀で、教授からも評価されています。\n\n就職活動が本格化してきました。大手企業を狙うか、やりたいことを優先するか...',
    choices: [
      {
        id: 'aim_big_company',
        text: '大手企業の安定を目指す',
        nextSceneId: 'job_hunting_corporate',
        effects: { stress: 25, skills: ['就活力'] }
      },
      {
        id: 'aim_passion',
        text: 'やりたい仕事を優先する',
        nextSceneId: 'job_hunting_passion',
        effects: { happiness: 15, skills: ['自己理解'] }
      },
      {
        id: 'consider_grad_school',
        text: '大学院進学も視野に入れる',
        nextSceneId: 'grad_school_choice',
        effects: { skills: ['研究力'] }
      }
    ]
  },

  'job_hunting_corporate': {
    id: 'job_hunting_corporate',
    age: 22,
    title: '就職活動 - 大手企業志望',
    description: '大手企業を中心にエントリーシートを書き、面接を受ける日々。競争は厳しいですが、いくつか内定をもらうことができました。',
    choices: [
      {
        id: 'accept_corporate',
        text: '大手企業の内定を受諾する',
        nextSceneId: 'corporate_life_start',
        effects: { happiness: 20, money: 40, skills: ['ビジネスマナー'] }
      }
    ]
  },

  'job_hunting_passion': {
    id: 'job_hunting_passion',
    age: 22,
    title: '就職活動 - 自分らしい道',
    description: 'やりたいことを優先して就活を進めました。給与は大手より低いかもしれませんが、興味のある分野の企業から内定をもらいました。',
    choices: [
      {
        id: 'accept_passion_job',
        text: '好きな仕事の内定を受諾する',
        nextSceneId: 'passion_job_start',
        effects: { happiness: 35, money: 20, skills: ['やりがい'] }
      }
    ]
  },

  'corporate_life_start': {
    id: 'corporate_life_start',
    age: 23,
    title: '社会人1年目 - 大企業での生活',
    description: '大企業に入社して1年。研修を経て、配属された部署で働いています。\n\n給料は良いし、福利厚生も充実しています。でも、毎日の残業と満員電車に少し疲れを感じています。',
    choices: [
      {
        id: 'adapt_corporate',
        text: 'この環境に適応していく',
        nextSceneId: 'corporate_life_stable',
        effects: { money: 50, stress: 30, skills: ['適応力', '忍耐力'] }
      },
      {
        id: 'consider_change',
        text: '転職も視野に入れ始める',
        nextSceneId: 'career_change_consideration',
        effects: { stress: 20, happiness: 10 }
      }
    ]
  },

  'passion_job_start': {
    id: 'passion_job_start',
    age: 23,
    title: '社会人1年目 - 好きな仕事',
    description: '興味のある分野で働き始めて1年。給料は高くないけど、毎日が充実しています。\n\n同僚たちも情熱を持って働いていて、刺激的な環境です。',
    choices: [
      {
        id: 'grow_in_passion',
        text: 'この分野でスキルを磨く',
        nextSceneId: 'specialist_path',
        effects: { happiness: 40, money: 25, skills: ['専門性', '情熱'] }
      },
      {
        id: 'side_business',
        text: '副業も始めてみる',
        nextSceneId: 'side_hustle',
        effects: { stress: 25, money: 35, skills: ['複業力'] }
      }
    ]
  },

  'corporate_life_stable': {
    id: 'corporate_life_stable',
    age: 25,
    title: '25歳 - 安定した生活',
    description: '社会人3年目のあなた。大企業での仕事にも慣れ、後輩もできました。\n\n給料も上がり、貯金もできています。週末は趣味や友人との時間を楽しんでいます。\n\n安定した生活を送っているあなた。これからも、自分なりの道を歩んでいくことでしょう。',
    choices: [],
    isEnding: true
  },

  'specialist_path': {
    id: 'specialist_path',
    age: 25,
    title: '25歳 - 専門性を持った若手',
    description: '好きな分野で3年働き、専門性が身についてきました。\n\n業界内での評判も上がり、いくつかのプロジェクトを任されるようになりました。給料も少しずつ上がっています。\n\nやりがいを感じながら働くあなた。情熱を持ち続ければ、きっと道は開けるはずです。',
    choices: [],
    isEnding: true
  },

  'side_hustle': {
    id: 'side_hustle',
    age: 25,
    title: '25歳 - 複業で活躍',
    description: '本業と副業の両立は大変でしたが、充実した3年間でした。\n\n副業の収入も安定し、本業だけの時より自由度が増しました。忙しいけれど、選択肢が増えたことで、人生の可能性が広がった気がします。\n\n複数の収入源を持つあなた。これからも、柔軟に生きていくことでしょう。',
    choices: [],
    isEnding: true
  },

  'vocational_school_choice': {
    id: 'vocational_school_choice',
    age: 18,
    title: '専門学校への進学',
    description: '専門学校に進学することを決めました。実践的なスキルを身につけられる環境です。\n\n2年間で集中して学び、資格を取得して就職する道です。',
    choices: [
      {
        id: 'vocational_life',
        text: '専門学校で学び始める',
        nextSceneId: 'vocational_graduation',
        effects: { happiness: 20, money: -15, skills: ['専門技術'] }
      }
    ]
  },

  'vocational_graduation': {
    id: 'vocational_graduation',
    age: 20,
    title: '専門学校卒業',
    description: '2年間の専門学校を卒業しました。資格も取得し、就職先も決まりました。\n\n同世代より2年早く社会に出ることになります。',
    choices: [
      {
        id: 'start_specialist_job',
        text: '専門職として働き始める',
        nextSceneId: 'young_professional',
        effects: { money: 30, skills: ['実務経験', '若手の強み'] }
      }
    ]
  },

  'young_professional': {
    id: 'young_professional',
    age: 25,
    title: '25歳 - 若手プロフェッショナル',
    description: '20歳から働き始めて5年。同世代が大学を卒業して就職する頃には、あなたはすでに中堅になっていました。\n\n実務経験が豊富で、若いながらも信頼される存在になっています。早くから働き始めたことで、貯金もそれなりにできました。\n\n若さと経験を武器に活躍するあなた。これからも実力で勝負していくことでしょう。',
    choices: [],
    isEnding: true
  },

  'job_hunting_highschool': {
    id: 'job_hunting_highschool',
    age: 18,
    title: '高卒での就職活動',
    description: '高校卒業後、すぐに就職する道を選びました。\n\n地元の企業から内定をもらいました。大学に行った友達より早く社会に出て、お金を稼ぐことができます。',
    choices: [
      {
        id: 'start_working_early',
        text: '18歳で社会人になる',
        nextSceneId: 'early_worker_life',
        effects: { money: 40, skills: ['実務経験', '早期自立'] }
      }
    ]
  },

  'early_worker_life': {
    id: 'early_worker_life',
    age: 25,
    title: '25歳 - 7年目の社会人',
    description: '18歳から働き始めて7年。同世代がまだ社会人2-3年目の頃、あなたはすでにベテランの域に入っています。\n\n早くから働いたことで、貯金もかなりできました。最近、通信制大学で学ぶことも考え始めています。\n\n早くから社会に出たあなた。経験を武器に、これからも自分の道を切り開いていくことでしょう。',
    choices: [],
    isEnding: true
  },

  'night_school_prep': {
    id: 'night_school_prep',
    age: 18,
    title: '働きながら学ぶ決意',
    description: '昼は働き、夜は大学で学ぶ道を選びました。\n\n大変な道ですが、経済的に自立しながら学位も取れる選択です。',
    choices: [
      {
        id: 'start_night_school',
        text: '二刀流の生活を始める',
        nextSceneId: 'night_school_life',
        effects: { stress: 40, money: 20, happiness: 15, skills: ['タフネス', '時間管理'] }
      }
    ]
  },

  'night_school_life': {
    id: 'night_school_life',
    age: 25,
    title: '25歳 - 働きながら学んだ7年間',
    description: '昼は働き、夜は学ぶという生活を続けて7年。ついに大学を卒業しました。\n\n大変だったけど、働きながら学位を取れたことは大きな自信になりました。職場での評価も上がり、収入も増えました。\n\n苦労を乗り越えたあなた。この経験は、これからの人生の大きな財産になるはずです。',
    choices: [],
    isEnding: true
  },

  'medical_prep': {
    id: 'medical_prep',
    age: 18,
    title: '医療系への道',
    description: '医療系の進路を選びました。看護学校や医療系専門学校など、選択肢はいくつかあります。',
    choices: [
      {
        id: 'nursing_school',
        text: '看護学校に進学する',
        nextSceneId: 'nursing_education',
        effects: { stress: 30, skills: ['医療知識', 'ケアスキル'] }
      }
    ]
  },

  'nursing_education': {
    id: 'nursing_education',
    age: 21,
    title: '看護師資格取得',
    description: '3年間の看護教育を終え、国家試験に合格しました。\n\n病院での実習は大変でしたが、人の命を預かる責任とやりがいを学びました。',
    choices: [
      {
        id: 'start_nurse',
        text: '看護師として働き始める',
        nextSceneId: 'nurse_life',
        effects: { happiness: 30, money: 35, skills: ['専門性', '使命感'] }
      }
    ]
  },

  'nurse_life': {
    id: 'nurse_life',
    age: 25,
    title: '25歳 - 看護師として',
    description: '看護師として4年間働きました。夜勤もあって大変ですが、患者さんから感謝されることにやりがいを感じています。\n\n最近、専門看護師の資格取得も考え始めました。\n\n人の役に立つ仕事を選んだあなた。これからも、多くの人を支えていくことでしょう。',
    choices: [],
    isEnding: true
  },

  'it_vocational': {
    id: 'it_vocational',
    age: 18,
    title: 'IT専門学校への進学',
    description: 'IT系の専門学校に進学しました。プログラミングやWebデザインなど、実践的なスキルを学べます。\n\n2年間で集中して技術を身につけ、IT業界へ就職する道です。',
    choices: [
      {
        id: 'it_study',
        text: 'ITスキルを磨く',
        nextSceneId: 'it_graduation',
        effects: { happiness: 25, skills: ['プログラミング', 'Web技術'] }
      }
    ]
  },

  'it_graduation': {
    id: 'it_graduation',
    age: 20,
    title: 'IT専門学校卒業',
    description: '2年間でプログラミングスキルを身につけました。IT企業から内定をもらい、エンジニアとして働き始めます。',
    choices: [
      {
        id: 'start_engineer',
        text: 'エンジニアとして働き始める',
        nextSceneId: 'young_engineer',
        effects: { money: 35, happiness: 30, skills: ['実務経験', 'チーム開発'] }
      }
    ]
  },

  'young_engineer': {
    id: 'young_engineer',
    age: 25,
    title: '25歳 - 若手エンジニア',
    description: '20歳からエンジニアとして働いて5年。多くのプロジェクトを経験し、技術力も上がりました。\n\nIT業界は変化が早いですが、常に学び続けることで、市場価値の高いエンジニアに成長しています。\n\n技術を武器に生きるあなた。これからも、スキルを磨き続けることでしょう。',
    choices: [],
    isEnding: true
  },

  'job_hunting_crisis': {
    id: 'job_hunting_crisis',
    age: 18,
    title: '高卒での就職 - 家族のために',
    description: '家族の状況を考え、大学進学を諦めて就職することを決めました。\n\n地元の企業から内定をもらいました。給料の一部は家計を助けるために使うことになります。',
    choices: [
      {
        id: 'work_for_family',
        text: '家族のために働き始める',
        nextSceneId: 'family_support_worker',
        effects: { money: 30, stress: 20, skills: ['責任感', '家族愛'] }
      }
    ]
  },

  'family_support_worker': {
    id: 'family_support_worker',
    age: 25,
    title: '25歳 - 家族を支えた7年間',
    description: '18歳から働き始めて7年。給料の一部を家に入れながら、自分の生活も築いてきました。\n\n父親も回復し、家計も安定してきました。大学には行けなかったけど、働きながら資格を取得し、キャリアアップも果たしています。\n\n家族のために頑張ったあなた。その経験は、何物にも代えがたい財産です。',
    choices: [],
    isEnding: true
  },

  'grad_school_choice': {
    id: 'grad_school_choice',
    age: 22,
    title: '大学院進学の選択',
    description: '大学院への進学を決めました。研究者の道を目指すか、専門性を高めるための2年間です。\n\n奨学金を借りることになりますが、より深い学びが得られます。',
    choices: [
      {
        id: 'enter_grad_school',
        text: '大学院で研究を続ける',
        nextSceneId: 'grad_school_life',
        effects: { stress: 20, money: -20, skills: ['研究力', '専門知識'] }
      }
    ]
  },

  'grad_school_life': {
    id: 'grad_school_life',
    age: 25,
    title: '25歳 - 大学院生活',
    description: '大学院に進学して3年目。修士課程を修了し、博士課程に進むか、就職するか考える時期になりました。\n\n研究は大変ですが、自分の興味のあることを深く追求できる充実した時間です。\n\n学び続けることを選んだあなた。この知識と経験は、必ず将来に活きるはずです。',
    choices: [],
    isEnding: true
  },

  'university_balanced': {
    id: 'university_balanced',
    age: 21,
    title: '大学3年生 - バランスの取れた生活',
    description: 'バイトと勉強のバランスを取りながら、充実した大学生活を送っています。\n\n就職活動が始まりました。',
    choices: [
      {
        id: 'balanced_job_hunt',
        text: '就活を始める',
        nextSceneId: 'job_hunting_passion',
        effects: { skills: ['バランス感覚'] }
      }
    ]
  },

  'university_working': {
    id: 'university_working',
    age: 21,
    title: '大学3年生 - バイト中心の生活',
    description: 'バイトを増やして貯金を頑張っています。少し勉強が疎かになっていますが、社会経験は積めています。\n\n就職活動が始まりました。',
    choices: [
      {
        id: 'working_student_job_hunt',
        text: '就活を始める',
        nextSceneId: 'job_hunting_corporate',
        effects: { skills: ['実務経験'] }
      }
    ]
  },

  'university_social': {
    id: 'university_social',
    age: 21,
    title: '大学3年生 - 人脈を広げた日々',
    description: 'サークル活動を通じて、多くの友人ができました。コミュニケーション力も上がった気がします。\n\n就職活動が始まりました。',
    choices: [
      {
        id: 'social_job_hunt',
        text: '就活を始める',
        nextSceneId: 'job_hunting_corporate',
        effects: { skills: ['人脈', 'コミュニケーション力'] }
      }
    ]
  },

  'university_practical': {
    id: 'university_practical',
    age: 21,
    title: '大学3年生 - 実践的な経験',
    description: 'インターンやバイトで社会経験を積んできました。就活にも有利になりそうです。\n\n就職活動が始まりました。',
    choices: [
      {
        id: 'practical_job_hunt',
        text: '就活を始める',
        nextSceneId: 'job_hunting_corporate',
        effects: { skills: ['実務経験', '社会性'] }
      }
    ]
  },

  'career_change_consideration': {
    id: 'career_change_consideration',
    age: 25,
    title: '25歳 - 転職を考え始める',
    description: '大企業で3年働きましたが、別の道も気になり始めています。\n\n安定した今の環境を離れるのは勇気がいりますが、25歳なら転職もまだしやすい年齢です。\n\n選択肢を持っているあなた。これからどんな道を選ぶにせよ、自分で決めることが大切です。',
    choices: [],
    isEnding: true
  }
};

export function getSceneById(sceneId: string): NovelScene | undefined {
  return NOVEL_SCENES[sceneId];
}
