export type AudienceVariant = 'university' | 'highschool';

export interface AudienceConfig {
    id: AudienceVariant;
    label: string;
    heroTitle: string;
    heroSubtitle: string;
    purpose: string;
    outputs: string[];
    toneNote: string;
    switchLink?: {
        label: string;
        href: string;
    };
}

export const audienceConfigs: Record<AudienceVariant, AudienceConfig> = {
    university: {
        id: 'university',
        label: '大学生版',
        heroTitle: '就活の自己理解をサポートします',
        heroSubtitle: '強み・価値観・向いている業界を明確にしよう',
        purpose: '就職活動の意思決定に必要な自己理解を短時間で整理します。',
        outputs: [
            '強み',
            '働き方の価値観',
            'キャリアアンカー',
            '向いている業界・職種',
            '経験に基づく ES/面接用ストーリー',
            'キャリアビジョン',
        ],
        toneNote: 'ビジネス寄りのトーンで、論理的に整理しながら意思決定を後押しします。',
        switchLink: {
            label: '高校生版を見る',
            href: '/highschool',
        },
    },
    highschool: {
        id: 'highschool',
        label: '高校生版',
        heroTitle: '進路のモヤモヤを言語化しよう',
        heroSubtitle: 'あなたに合う学び方・活動タイプを見つけよう',
        purpose: '進路選択に向けて、自分の良さと可能性を広く掘り起こします。',
        outputs: [
            '強み（大学生版と同じ基準）',
            '価値観（学習スタイル / 人間関係 / 生活リズム）',
            '活動タイプ（探究 / 実践 / 協働 / クリエイティブ）',
            '進路カテゴリ（文系 / 理系 / 芸術 / IT / 社会科学 など）',
            '伸びる学校環境（部活 / 係 / 役割）',
            '志望理由書の素材（ES 相当）',
        ],
        toneNote: '自己肯定感を重視し、例えや補足を増やして「可能性を広げる」方向に寄せます。',
        switchLink: {
            label: '大学生版を見る',
            href: '/',
        },
    },
};
