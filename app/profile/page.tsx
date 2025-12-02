'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Badge from '@/components/ui/Badge';
import { User, Award, Zap, BookOpen } from 'lucide-react';
import AIAptitudeResults from '@/components/profile/AIAptitudeResults';

export default function ProfilePage() {
    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">マイプロフィール</h1>
            </div>

            {/* User Info Card */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">凌太朗</h2>
                        <p className="text-sm text-gray-500">高校2年生</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="mb-2 text-sm font-medium text-gray-500">一言サマリー</h3>
                    <p className="text-base text-gray-900">
                        "学業と両立しながら、クリエイティブな分野を探求中。"
                    </p>
                </div>
            </div>

            {/* Stats/Tags */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Strengths */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-accent" />
                        <h3 className="font-bold text-gray-900">強み</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">創造的思考</Badge>
                        <Badge variant="secondary">共感力</Badge>
                        <Badge variant="secondary">問題解決</Badge>
                    </div>
                </div>

                {/* Values */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-gray-900">価値観</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">自律性</Badge>
                        <Badge variant="secondary">創造性</Badge>
                        <Badge variant="secondary">成長</Badge>
                    </div>
                </div>
            </div>

            {/* Career Candidates */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm mb-8">
                <div className="mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gray-700" />
                    <h3 className="font-bold text-gray-900">キャリア候補</h3>
                </div>
                <ul className="space-y-3">
                    <li className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span>グラフィックデザイナー</span>
                        <Badge variant="outline">マッチ度: 高</Badge>
                    </li>
                    <li className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span>UXリサーチャー</span>
                        <Badge variant="outline">マッチ度: 中</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                        <span>美術教師</span>
                        <Badge variant="outline">マッチ度: 中</Badge>
                    </li>
                </ul>
            </div>

            {/* AI Aptitude Results */}
            <div className="mb-20 lg:mb-10">
                <AIAptitudeResults data={mockAIAptitudeData} />
            </div>
        </AppLayout>
    );
}

const mockAIAptitudeData = {
    suitableOccupations: ['プロジェクトマネージャー', '経営企画職', '組織開発コンサルタント'],
    suitableCulture: '成果主義と自律性を重視し、チームワークと継続的改善を推奨する組織文化',
    overallEvaluation: [
        { label: '前に踏み出す力（アクション）', value: 20, fullMark: 20 },
        { label: '考え抜く力（シンキング）', value: 18, fullMark: 18 },
        { label: 'チームで働く力（チームワーク）', value: 25, fullMark: 25 },
        { label: '自己マネジメント力（セルフコントロール）', value: 19, fullMark: 20 },
        { label: 'キャリア志向・価値観', value: 18, fullMark: 18 },
    ],
    competencyRadar: [
        { label: '主体性', value: 5, fullMark: 5 },
        { label: '働きかけ力', value: 5, fullMark: 5 },
        { label: '実行力', value: 5, fullMark: 5 },
        { label: '課題発見力', value: 5, fullMark: 5 },
        { label: '計画力', value: 4, fullMark: 5 },
        { label: '創造力', value: 3, fullMark: 5 },
        { label: '発信力', value: 5, fullMark: 5 },
        { label: '傾聴力', value: 5, fullMark: 5 },
        { label: '柔軟性', value: 5, fullMark: 5 },
        { label: '情況把握力', value: 5, fullMark: 5 },
        { label: '規律性', value: 5, fullMark: 5 },
        { label: 'ストレスコントロール力', value: 4, fullMark: 5 },
    ],
    valuesRadar: [
        { label: 'ストレスコントロール力', value: 4, fullMark: 5 },
        { label: '自己管理力', value: 5, fullMark: 5 },
        { label: '情緒安定性', value: 5, fullMark: 5 },
        { label: 'ワークライフバランス志向', value: 3, fullMark: 5 },
        { label: '社会貢献志向', value: 4, fullMark: 5 },
    ],
    detailedAptitude: {
        strengths: {
            title: 'チーム全体を巻き込みながら目標達成に向けて主体的に行動すること',
            description: '自ら課題を発見し改善提案を実行できる。困難な状況でも冷静さを保ち、周囲を巻き込んで協力体制を構築し、粘り強く目標を達成する能力に優れている。',
        },
        weaknesses: {
            title: '専門的な技術知識やデータ分析への深い関心',
            description: '技術的スキルやデータドリブンな分析への取り組みをさらに強化することで、より説得力のある意思決定が可能になります。',
        },
        suitableJobs: 'プロジェクトマネージャー 事業開発職',
        suitableWorkStyle: '裁量権が大きく、複数のステークホルダーと協働しながら戦略的に推進できる環境',
        unsuitableJobs: 'データサイエンティスト システムエンジニア',
        unsuitableWorkStyle: '専門的な技術知識やデータ分析への深い関心',
    },
    aiComment: 'あなたは社会人基礎コンピテンシーにおいて、特にチームワーク領域で満点の評価を獲得しており、発信力・傾聴力・柔軟性・情況把握力・規律性のすべてで高い適性を示しています。これは、組織内で信頼される協働者として機能できることを意味します。加えて、主体性と実行力も高く、自ら課題を発見して改善を推進する姿勢が強いことが特徴です。 自己基盤においても、情緒安定性と自己管理力が優れており、プレッシャー下でも冷静に判断できる適性があります。キャリア成長志向も高く、長期的な目標を持って一貫して行動する傾向が見られます。一方、職業適性の技術志向やクリエイティブ力の項目では、特定の強い指向性が見られないため、これらの領域を必須とする職種よりも、人間関係構築と戦略的思考を活かせる職種が適合します。 推奨職種としては、プロジェクトマネージャーや経営企画職、組織開発コンサルタントなど、複数の関係者を調整しながら目標達成を推進する職種が最適です。これらの職種では、あなたの主体性、チームワーク能力、冷静な判断力が大きな強みとなります。今後は、データ分析やシステム思考をさらに磨くことで、より戦略的な意思決定ができるようになり、キャリアの幅が広がるでしょう。',
};
