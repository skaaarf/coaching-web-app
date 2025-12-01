'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useCareerData } from '@/hooks/useCareerData';

export default function HistoryPage() {
    const { inProgressModules, completedActivities } = useCareerData();

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">履歴</h1>
            </div>

            {/* In Progress */}
            {inProgressModules.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-4 text-lg font-bold text-gray-900">進行中</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {inProgressModules.filter(item => item !== null).map((item) => (
                            <Card
                                key={item.id}
                                title={item.title}
                                description={item.summary}
                                imageUrl={item.imageUrl}
                                emoji={item.emoji}
                                tags={
                                    <div className="flex gap-2">
                                        <Badge variant="accent">モジュール</Badge>
                                        <Badge variant="secondary">進行中</Badge>
                                    </div>
                                }
                                footer={
                                    <div className="w-full rounded-full bg-gray-200 h-1.5 mt-2">
                                        <div
                                            className="bg-primary h-1.5 rounded-full"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                }
                                onClick={() => console.log('Resume item', item.id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Completed */}
            <section className="mb-20 lg:mb-10">
                <h2 className="mb-4 text-lg font-bold text-gray-900">完了済み</h2>
                {completedActivities.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {completedActivities.map((item) => (
                            <Card
                                key={item.id}
                                title={item.title}
                                description={item.summary}
                                imageUrl={item.imageUrl}
                                emoji={item.emoji}
                                tags={
                                    <div className="flex gap-2">
                                        <Badge variant="default">アクティビティ</Badge>
                                        <Badge variant="secondary">完了</Badge>
                                    </div>
                                }
                                onClick={() => console.log('View item', item.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl bg-gray-50 p-8 text-center text-gray-500">
                        完了したアクティビティはまだありません。
                    </div>
                )}
            </section>
        </AppLayout>
    );
}
