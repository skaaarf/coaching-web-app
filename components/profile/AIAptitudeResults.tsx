import React from 'react';
import { TrendingUp, TrendingDown, User } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import RadarChart from './RadarChart';

interface AIAptitudeResultsProps {
    data: {
        suitableOccupations: string[];
        suitableCulture: string;
        overallEvaluation: {
            label: string;
            value: number;
            fullMark: number;
        }[];
        competencyRadar: {
            label: string;
            value: number;
            fullMark: number;
        }[];
        valuesRadar: {
            label: string;
            value: number;
            fullMark: number;
        }[];
        detailedAptitude: {
            strengths: {
                title: string;
                description: string;
            };
            weaknesses: {
                title: string;
                description: string;
            };
            suitableJobs: string;
            suitableWorkStyle: string;
            unsuitableJobs: string;
            unsuitableWorkStyle: string;
        };
        aiComment: string;
    };
}

export default function AIAptitudeResults({ data }: AIAptitudeResultsProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">AI適性検査結果</h2>

            {/* Top Summary Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="font-bold text-gray-900">適性職種：</span>
                    <div className="flex flex-wrap gap-2">
                        {data.suitableOccupations.map((job, index) => (
                            <Badge key={index} variant="secondary" className="bg-orange-50 text-orange-600 hover:bg-orange-100">
                                {job}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="shrink-0 font-bold text-gray-900">適性社風：</span>
                    <p className="text-gray-700">{data.suitableCulture}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Overall Evaluation - Progress Bars */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-6 font-bold text-gray-900">全体の評価</h3>
                    <div className="space-y-6">
                        {data.overallEvaluation.map((item, index) => (
                            <div key={index}>
                                <div className="mb-2 flex justify-between text-sm font-bold text-gray-900">
                                    <span>{item.label}</span>
                                    <span>{item.value}/{item.fullMark}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-orange-500 transition-all duration-500"
                                        style={{ width: `${(item.value / item.fullMark) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Radar Chart 1 */}
                <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col items-center">
                    <h3 className="mb-4 font-bold text-gray-900 text-center">
                        社会人基礎コンピテンシーの構成比<br />（実行・思考・協働）
                    </h3>
                    <RadarChart data={data.competencyRadar} color="#F97316" />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Detailed Aptitude */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 font-bold text-gray-900">詳細適性</h3>

                    <div className="mb-6 rounded-xl border border-green-100 bg-green-50/50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-green-600">
                            <TrendingUp className="h-5 w-5" />
                            <span className="font-bold">得意なこと</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-green-700">得意なこと</h4>
                                <p className="text-sm text-gray-700">{data.detailedAptitude.strengths.title}</p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-green-700">長所</h4>
                                <p className="text-sm text-gray-700">{data.detailedAptitude.strengths.description}</p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-green-700">適している職種</h4>
                                <p className="text-sm text-gray-700">{data.detailedAptitude.suitableJobs}</p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-green-700">適している働き方</h4>
                                <p className="text-sm text-gray-700">{data.detailedAptitude.suitableWorkStyle}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-gray-600">
                            <TrendingDown className="h-5 w-5" />
                            <span className="font-bold">不得意なこと</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-gray-700">不得意なこと</h4>
                                <p className="text-sm text-gray-700">{data.detailedAptitude.weaknesses.title}</p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-gray-700">短所</h4>
                                <p className="text-sm text-gray-700">{data.detailedAptitude.weaknesses.description}</p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-gray-700">向いてない職種</h4>
                                <p className="text-sm text-gray-700">{data.detailedAptitude.unsuitableJobs}</p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-gray-700">向いてない働き方</h4>
                                <p className="text-sm text-gray-700">{data.detailedAptitude.unsuitableWorkStyle}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Radar Chart 2 & AI Comment */}
                <div className="space-y-6">
                    <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col items-center">
                        <h3 className="mb-4 font-bold text-gray-900 text-center">
                            自己基盤・価値観コンピテンシーの構成比<br />（セルフコントロール・志向）
                        </h3>
                        <RadarChart data={data.valuesRadar} color="#F97316" />
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-gray-900">AIによる総評コメント</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-700">
                            {data.aiComment}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
