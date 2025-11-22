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
        placeholder?: string;
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
                text: '夢中になったこと',
                placeholder: '休み時間や放課後、何をして遊ぶのが一番楽しかった？（例）サッカー、ゲーム、工作、読書',
            },
            {
                id: 'elementary_q2',
                text: '得意だったこと',
                placeholder: '学校や家で「これは得意だな」と思っていたことは？（例）計算、絵を描くこと、友達を作ること',
            },
            {
                id: 'elementary_q3',
                text: '小学生時代を一言で表すと',
                placeholder: '（例）無邪気、好奇心旺盛、引っ込み思案',
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
                text: '部活・習い事での思い出',
                placeholder: '一番印象に残っている出来事は？（例）大会で勝った、仲間と喧嘩した、引退試合',
            },
            {
                id: 'middleschool_q2',
                text: '友達との過ごし方',
                placeholder: 'どんなことをして過ごしていた？（例）放課後カラオケ、一緒に勉強、部活',
            },
            {
                id: 'middleschool_q3',
                text: '得意/苦手だった科目',
                placeholder: '得意だった科目と苦手だった科目は？ それはなぜ？（例）数学が得意。パズルみたいで楽しかった',
            },
            {
                id: 'middleschool_q4',
                text: '中学生時代を一言で表すと',
                placeholder: '（例）反抗期、部活一筋、友達が全て',
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
                text: '進路選択の決め手',
                placeholder: '高校や文理選択をどう決めた？（例）友達と同じ、将来やりたいことがあって',
            },
            {
                id: 'highschool_q2',
                text: '本気で取り組んだこと',
                placeholder: '一番本気で取り組んだことは？（例）受験勉強、バンド活動、部活で全国大会',
            },
            {
                id: 'highschool_q3',
                text: '影響を受けた人',
                placeholder: 'どんな影響を受けた？（例）顧問の先生。諦めない姿勢を教えてくれた',
            },
            {
                id: 'highschool_q4',
                text: '後悔していること',
                placeholder: '「あの時こうすればよかった」と思うことは？',
            },
            {
                id: 'highschool_q5',
                text: '高校生時代を一言で表すと',
                placeholder: '（例）迷走、青春、受験漬け、自分探し',
            },
        ],
    },
    {
        id: 'working',
        name: '大学生・社会人時代',
        emoji: '🎓',
        catchphrase: '今の自分',
        graphAge: null, // Use actual user age
        minUserAge: 18,
        questions: [
            {
                id: 'working_q1',
                text: '専攻・職業選択の理由',
                placeholder: '今の専攻や職業を選んだ理由は？（例）経済学に興味があった、安定した職に就きたかった',
            },
            {
                id: 'working_q2',
                text: 'ターニングポイント',
                placeholder: '人生の方向性が変わった出来事は？（例）留学した、起業した、就活に失敗した',
            },
            {
                id: 'working_q3',
                text: '今大切にしている価値観',
                placeholder: '今、一番大切にしている価値観は？いつ頃気づいた？（例）自由、成長、人との繋がり',
            },
            {
                id: 'working_q4',
                text: '挑戦したこと',
                placeholder: 'リスクを取って挑戦したことは？結果は？（例）起業、海外インターン、未経験への転職',
            },
            {
                id: 'working_q5',
                text: '今の自分を一言で表すと',
                placeholder: '（例）模索中、挑戦者、現実主義者',
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
