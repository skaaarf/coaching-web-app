'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Clock, CheckCircle2, PlayCircle } from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import Badge from '@/components/ui/Badge';
import { modules, activities } from '@/data/activities';

export default function ModuleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const module = modules.find((m) => m.id === id);

    if (!module) {
        return (
            <AppLayout>
                <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-500">Module not found</p>
                </div>
            </AppLayout>
        );
    }

    // Get related activities
    const moduleActivities = module.activityIds.map((actId) =>
        activities[actId]
    ).filter(Boolean);

    // Mock similar modules (excluding current one)
    const similarModules = modules.filter((m) => m.id !== id).slice(0, 2);

    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    戻る
                </button>

                {/* Hero Section with Image */}
                <div className="mb-10 overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-lg">
                    <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-blue-100 via-teal-50 to-blue-50 sm:h-96">
                        {module.imageUrl ? (
                            <Image
                                src={module.imageUrl}
                                alt={module.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-8xl">
                                {module.emoji || '📦'}
                            </div>
                        )}
                    </div>
                    <div className="p-8">
                        <div className="mb-4 flex gap-3">
                            <Badge variant="default">モジュール</Badge>
                            <Badge variant="outline">
                                <Clock className="mr-1 h-3 w-3 inline" />
                                {module.duration}
                            </Badge>
                        </div>
                        <h1 className="mb-4 text-4xl font-bold text-gray-900">{module.title}</h1>
                        <p className="text-lg leading-relaxed text-gray-600 max-w-3xl">{module.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Main Content - Activities List */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">このモジュールのアクティビティ</h2>
                                <p className="text-sm text-gray-600 mt-1">{moduleActivities.length}個のアクティビティ</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {moduleActivities.map((activity, index) => (
                                <div
                                    key={activity!.id}
                                    id={`activity-card-${activity!.id}`}
                                    onClick={() => router.push(`/activities/${activity!.id}`)}
                                    className="group flex cursor-pointer gap-5 rounded-2xl bg-white border border-gray-200 p-6 transition-all hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 text-3xl group-hover:scale-110 transition-transform">
                                        {activity!.emoji || '📝'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                                                    {index + 1}
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {activity!.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="mb-3 flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                <Clock className="mr-1 h-3 w-3 inline" />
                                                {activity!.duration}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                            {activity!.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center self-center">
                                        <div className="rounded-full bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <PlayCircle className="h-6 w-6" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Similar Modules */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-4 text-xl font-bold text-gray-900">関連モジュール</h3>
                            <div className="space-y-4">
                                {similarModules.map((simModule) => (
                                    <div
                                        key={simModule.id}
                                        onClick={() => router.push(simModule.link || `/modules/${simModule.id}`)}
                                        className="group cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all hover:border-blue-300 hover:shadow-lg"
                                    >
                                        <div className="relative h-40 w-full bg-gradient-to-br from-blue-50 to-teal-50">
                                            {simModule.imageUrl ? (
                                                <Image
                                                    src={simModule.imageUrl}
                                                    alt={simModule.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-5xl">
                                                    {simModule.emoji}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-2 flex gap-2">
                                                <Badge variant="default" className="text-xs">モジュール</Badge>
                                                <Badge variant="outline" className="text-xs">{simModule.duration}</Badge>
                                            </div>
                                            <h4 className="mb-2 font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {simModule.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                {simModule.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
