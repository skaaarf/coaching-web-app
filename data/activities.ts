export interface Activity {
    id: string;
    title: string;
    duration: string; // e.g. "5-10 min"
    summary: string;
    description: string;
    imageUrl?: string;
    emoji?: string;
    category: 'self-analysis' | 'job-research' | 'application' | 'interview';
    tags: string[];
}

export interface Module {
    id: string;
    title: string;
    duration: string; // e.g. "60-90 min"
    summary: string;
    description: string;
    imageUrl?: string;
    emoji?: string;
    activityIds: string[];
    progress?: number; // 0-100
}

export const activities: Activity[] = [
    {
        id: 'act-1',
        title: '自分のスキルを職種とマッチング',
        duration: '10-15 分',
        summary: '自分の興味に合った役割を知る。',
        description: '自分の興味、スキル、経験に最もマッチする役割、職種、ポジションについて学びます。',
        emoji: '🧩',
        category: 'self-analysis',
        tags: ['自己分析', 'キャリアパス'],
    },
    {
        id: 'act-2',
        title: '学校での学びをキャリアに活かす',
        duration: '5-20 分',
        summary: '学校の科目がどう仕事につながるか発見する。',
        description: '学校での科目が将来のキャリアへの足がかりとなることを発見します。学問的な学びと実社会での応用のギャップを埋める方法を学びます。',
        emoji: '🏫',
        category: 'self-analysis',
        tags: ['教育', 'モチベーション'],
    },
    {
        id: 'act-3',
        title: '自分に合った職業を見つける',
        duration: '15-20 分',
        summary: '興味や得意なことから職業を探す。',
        description: '自分の興味や得意なことと一致する職業について学びます。',
        emoji: '🔍',
        category: 'job-research',
        tags: ['仕事探し', 'リサーチ'],
    },
    {
        id: 'act-4',
        title: '奨学金申請フォームの記入',
        duration: '20-30 分',
        summary: '専門家のガイダンスで申請プロセスを簡素化。',
        description: '専門家のガイダンスで奨学金申請プロセスを簡素化し、経済的支援のオプションを最大限に活用できるようにします。',
        emoji: '📝',
        category: 'application',
        tags: ['奨学金', '大学'],
    },
    {
        id: 'act-5',
        title: '自分に合う大学を見つける',
        duration: '10-15 分',
        summary: '希望に合う大学を探索する。',
        description: '学業や個人的な希望にマッチする大学を探索します。',
        emoji: '🎓',
        category: 'job-research',
        tags: ['大学', 'リサーチ'],
    },
];

export const modules: Module[] = [
    {
        id: 'mod-1',
        title: '学校と未来をつなぐ',
        duration: '25-50 分',
        summary: '現在の学びを将来のキャリアにリンクさせる。',
        description: '現在の学業での学びを将来のキャリアの機会にリンクさせます。学校の科目が様々な職業にどのように関連しているかを発見し、必要なキャリアスキルを特定し、効果的に学習を整理する方法を学びます。',
        emoji: '🚀',
        activityIds: ['act-2', 'act-5'],
        progress: 30,
    },
    {
        id: 'mod-2',
        title: 'キャリア開発スキルを磨く',
        duration: '85-165 分',
        summary: 'キャリア開発に不可欠なスキルを開発する。',
        description: 'キャリア開発に不可欠なスキルを開発します。このモジュールでは、時間管理、コミュニケーション、対人スキルをカバーし、効果的なネットワーキングとパーソナルブランディングの基礎を提供します。',
        emoji: '🛠️',
        activityIds: ['act-1', 'act-3'],
        progress: 0,
    },
    {
        id: 'mod-3',
        title: '就職面接の準備',
        duration: '65-115 分',
        summary: '面接スキルを磨き、好印象を与える。',
        description: '面接スキルを磨き、潜在的な雇用主に永続的な印象を与えるようにします。',
        emoji: '👔',
        activityIds: [],
        progress: 0,
    },
];
