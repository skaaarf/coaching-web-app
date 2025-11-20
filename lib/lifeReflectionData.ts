// Era definitions and questions for Life Reflection module

export interface EraConfig {
    id: 'elementary' | 'middleschool' | 'highschool' | 'college' | 'working';
    name: string;
    emoji: string;
    catchphrase: string;
    graphAge: number | null; // null means use user's actual age
    minUserAge: number; // Minimum user age to show this era
    questions: Array<{
        id: string;
        text: string;
    }>;
}

export const ERAS: EraConfig[] = [
    {
        id: 'elementary',
        name: '小学生時代',
        emoji: '🎒',
        catchphrase: 'あなたの原点',
        graphAge: 12,
        minUserAge: 0,
        questions: [
            {
                id: 'elementary_q1',
                text: '一番夢中になった遊びや趣味は？',
            },
            {
                id: 'elementary_q2',
                text: '一番仲が良かった友達とのエピソードは？',
            },
            {
                id: 'elementary_q3',
                text: '一番印象に残っている出来事は？',
            },
        ],
    },
    {
        id: 'middleschool',
        name: '中学生時代',
        emoji: '⚽',
        catchphrase: '変化と成長',
        graphAge: 15,
        minUserAge: 0,
        questions: [
            {
                id: 'middleschool_q1',
                text: '一番頑張ったことは？（部活・勉強・習い事など）',
            },
            {
                id: 'middleschool_q2',
                text: '一番悩んだことは？',
            },
            {
                id: 'middleschool_q3',
                text: '一番楽しかった思い出は？',
            },
        ],
    },
    {
        id: 'highschool',
        name: '高校生時代',
        emoji: '📚',
        catchphrase: '自分探しの日々',
        graphAge: 18,
        minUserAge: 16,
        questions: [
            {
                id: 'highschool_q1',
                text: '一番力を入れたことは？（部活・受験・趣味など）',
            },
            {
                id: 'highschool_q2',
                text: '一番迷った選択は？',
            },
            {
                id: 'highschool_q3',
                text: '一番成長を感じた経験は？',
            },
        ],
    },
    {
        id: 'college',
        name: '大学生時代',
        emoji: '🎓',
        catchphrase: '自由と責任',
        graphAge: 22,
        minUserAge: 19,
        questions: [
            {
                id: 'college_q1',
                text: '一番打ち込んだことは？（学業・サークル・バイトなど）',
            },
            {
                id: 'college_q2',
                text: '一番悩んだ決断は？',
            },
            {
                id: 'college_q3',
                text: '一番自分らしくいられた瞬間は？',
            },
        ],
    },
    {
        id: 'working',
        name: '社会人時代',
        emoji: '💼',
        catchphrase: '現在の自分',
        graphAge: null, // Use actual user age
        minUserAge: 23,
        questions: [
            {
                id: 'working_q1',
                text: '一番やりがいを感じた仕事・経験は？',
            },
            {
                id: 'working_q2',
                text: '一番困難だった状況は？',
            },
            {
                id: 'working_q3',
                text: '今の自分に一番影響を与えた出来事は？',
            },
        ],
    },
];

export function getErasForAge(userAge: number): EraConfig[] {
    return ERAS.filter((era) => userAge >= era.minUserAge);
}

export function getEraById(eraId: string): EraConfig | undefined {
    return ERAS.find((era) => era.id === eraId);
}
