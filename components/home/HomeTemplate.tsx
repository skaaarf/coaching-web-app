'use client';

import AppLayout from '@/components/layouts/AppLayout';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import OutputHighlights from '@/components/home/OutputHighlights';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { activities, modules } from '@/data/activities';
import { AudienceVariant, audienceConfigs } from '@/data/audienceVariants';
import { useCareerData } from '@/hooks/useCareerData';
import { useRouter } from 'next/navigation';

interface HomeTemplateProps {
    variant: AudienceVariant;
}

export default function HomeTemplate({ variant }: HomeTemplateProps) {
    const router = useRouter();
    const { lastActiveItem } = useCareerData();

    const config = audienceConfigs[variant];

    // MVP: Only show the single module and its activities (shared across variants)
    const mainModule = modules[0];
    const moduleActivities = mainModule.activityIds.map(id => activities[id]).filter(Boolean);
    const moduleDescription =
        variant === 'highschool'
            ? '進路や学校選びのヒントが見つかる自己理解モジュール。強みや価値観、活動タイプをチャットで整理します。'
            : mainModule.description;

    return (
        <AppLayout>
            <WelcomeHeader
                title={config.heroTitle}
                subtitle={config.heroSubtitle}
                variantLabel={config.label}
                switchHref={config.switchLink?.href}
                switchLabel={config.switchLink?.label}
            />

            <OutputHighlights config={config} />

            <section className="mb-12">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">自分を知る</h2>
                    <p className="text-sm text-gray-600 mt-1">チャットで深掘りしながら自己理解を進めましょう</p>
                </div>

                <div className="mb-8">
                    <Card
                        variant="horizontal"
                        title={mainModule.title}
                        description={moduleDescription}
                        imageUrl={mainModule.imageUrl}
                        emoji={mainModule.emoji}
                        tags={
                            <div className="flex gap-2">
                                <Badge variant="accent">{config.label}</Badge>
                                <Badge variant="secondary">{mainModule.duration}</Badge>
                            </div>
                        }
                        onClick={() => { }}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {moduleActivities.map((activity, index) => (
                        <Card
                            key={activity.id}
                            title={activity.title}
                            description={activity.summary || 'チャットで深掘り'}
                            emoji={activity.emoji}
                            tags={
                                <div className="flex gap-2">
                                    <Badge variant="default">STEP {index + 1}</Badge>
                                    <Badge variant="outline">{activity.duration || '5-10分'}</Badge>
                                </div>
                            }
                            onClick={() => router.push(`/activities/${activity.id}`)}
                        />
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}
