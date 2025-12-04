'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { activities, modules } from '@/data/activities';
import { useRouter } from 'next/navigation';

export default function ActivitiesPage() {
  const router = useRouter();
  const mainModule = modules[0];
  const moduleActivities = mainModule.activityIds.map((id) => activities[id]).filter(Boolean);

  return (
    <AppLayout>
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">アクティビティ一覧</h1>
        <p className="text-sm text-gray-600 mt-1">自己分析に必要なチャット型アクティビティをまとめました</p>
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
    </AppLayout>
  );
}
