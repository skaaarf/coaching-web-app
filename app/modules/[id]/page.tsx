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
            <div className="mx-auto max-w-6xl">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                </button>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Hero Section */}
                        <div className="mb-8">
                            <div className="relative mb-6 h-64 w-full overflow-hidden rounded-3xl bg-gray-100 sm:h-80">
                                {module.imageUrl ? (
                                    <Image
                                        src={module.imageUrl}
                                        alt={module.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-6xl">
                                        {module.emoji || '📦'}
                                    </div>
                                )}
                            </div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900">{module.title}</h1>
                            <p className="text-lg leading-relaxed text-gray-600">{module.description}</p>
                        </div>

                        {/* Activities List */}
                        <div>
                            <h2 className="mb-6 text-xl font-bold text-gray-900">Activities in this Module</h2>
                            <div className="space-y-4">
                                {moduleActivities.map((activity, index) => (
                                    <div
                                        key={activity!.id}
                                        id={`activity-card-${activity!.id}`}
                                        onClick={() => router.push(`/activities/${activity!.id}`)}
                                        className="group flex cursor-pointer gap-4 rounded-2xl bg-gray-50 p-5 transition-all hover:bg-white hover:shadow-md"
                                    >
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm group-hover:bg-primary/10">
                                            {activity!.emoji || '📝'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900 group-hover:text-primary">
                                                    {activity!.title}
                                                </h3>
                                            </div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {activity!.duration}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {activity!.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center self-center">
                                            <div className="rounded-full bg-white p-2 text-gray-400 shadow-sm group-hover:text-primary">
                                                <PlayCircle className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-orange-500">Similar modules</h3>
                            <div className="space-y-4">
                                {similarModules.map((simModule) => (
                                    <div
                                        key={simModule.id}
                                        onClick={() => router.push(`/modules/${simModule.id}`)}
                                        className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="relative h-32 w-full bg-gray-100">
                                            {simModule.imageUrl ? (
                                                <Image
                                                    src={simModule.imageUrl}
                                                    alt={simModule.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-4xl">
                                                    {simModule.emoji}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-2 flex gap-2">
                                                <Badge variant="accent" className="text-xs">Module</Badge>
                                                <Badge variant="secondary" className="text-xs">{simModule.duration}</Badge>
                                            </div>
                                            <h4 className="mb-1 font-bold text-gray-900 line-clamp-2 group-hover:text-primary">
                                                {simModule.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 line-clamp-3">
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
