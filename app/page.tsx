'use client';

import AppLayout from '@/components/layouts/AppLayout';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { activities, modules } from '@/data/activities';
import { useCareerData } from '@/hooks/useCareerData';
import Link from 'next/link';

export default function Home() {
  const { lastActiveItem } = useCareerData();

  return (
    <AppLayout>
      <WelcomeHeader />

      {/* Pick up where you left off */}
      {lastActiveItem && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">続きから</h2>
            <Link href="/history" className="text-sm font-medium text-primary hover:text-primary/80">
              すべて見る
            </Link>
          </div>
          <Card
            variant="horizontal"
            title={lastActiveItem.title}
            description={lastActiveItem.summary}
            imageUrl={lastActiveItem.imageUrl}
            emoji={lastActiveItem.emoji}
            tags={
              <div className="flex gap-2">
                <Badge variant="accent">モジュール</Badge>
                <Badge variant="secondary">{lastActiveItem.duration}</Badge>
              </div>
            }
            footer={
              <div className="w-full rounded-full bg-gray-200 h-1.5 mt-2">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: `${lastActiveItem.progress}%` }}
                />
              </div>
            }
            onClick={() => console.log('Resume module', lastActiveItem.id)}
          />
        </section>
      )}

      {/* Recommended Modules */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">おすすめのモジュール</h2>
          <Link href="/activities?tab=modules" className="text-sm font-medium text-primary hover:text-primary/80">
            すべて見る
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {modules.map((module) => (
            <div key={module.id} className="w-72 flex-shrink-0">
              <Card
                title={module.title}
                description={module.summary}
                imageUrl={module.imageUrl}
                emoji={module.emoji}
                tags={
                  <div className="flex gap-2">
                    <Badge variant="accent">モジュール</Badge>
                    <Badge variant="secondary">{module.duration}</Badge>
                  </div>
                }
                onClick={() => console.log('Open module', module.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Activities */}
      <section className="mb-20 lg:mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">おすすめのアクティビティ</h2>
          <Link href="/activities" className="text-sm font-medium text-primary hover:text-primary/80">
            すべて見る
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {activities.map((activity) => (
            <div key={activity.id} className="w-72 flex-shrink-0">
              <Card
                title={activity.title}
                description={activity.summary}
                imageUrl={activity.imageUrl}
                emoji={activity.emoji}
                tags={
                  <div className="flex gap-2">
                    <Badge variant="default">アクティビティ</Badge>
                    <Badge variant="secondary">{activity.duration}</Badge>
                  </div>
                }
                onClick={() => console.log('Open activity', activity.id)}
              />
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
