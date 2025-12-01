'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Badge from '@/components/ui/Badge';
import { User, Award, Zap, BookOpen } from 'lucide-react';

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
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm mb-20 lg:mb-10">
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
        </AppLayout>
    );
}
