'use client';

import AppLayout from '@/components/layouts/AppLayout';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { activities, modules } from '@/data/activities';
import { useCareerData } from '@/hooks/useCareerData';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { lastActiveItem } = useCareerData();

  // MVP: Only show the single module and its activities
  const mainModule = modules[0];
  const moduleActivities = mainModule.activityIds.map(id => activities[id]).filter(Boolean);

  return (
    <AppLayout>
      <WelcomeHeader />

      {/* Main Module Section */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">自分を知る</h2>
          <p className="text-sm text-gray-600 mt-1">就活に必要な自己分析はこれだけでOK</p>
        </div>

        <div className="mb-8">
          <Card
            variant="horizontal"
            title={mainModule.title}
            description={mainModule.description}
            imageUrl={mainModule.imageUrl}
            emoji={mainModule.emoji}
            tags={
              <div className="flex gap-2">
                <Badge variant="accent">モジュール</Badge>
                <Badge variant="secondary">{mainModule.duration}</Badge>
              </div>
            }
            onClick={() => { }} // No specific action for module card itself in this view, or maybe scroll to activities
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
