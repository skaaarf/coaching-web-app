'use client';

import AppLayout from '@/components/layouts/AppLayout';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { activities, modules } from '@/data/activities';
import { useCareerData } from '@/hooks/useCareerData';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { lastActiveItem } = useCareerData();

  return (
    <AppLayout>
      <WelcomeHeader />

      {/* Pick up where you left off */}
      {lastActiveItem && (
        <section className="mb-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">続きから</h2>
            <Link href="/history" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
              すべて見る
              <span className="text-lg">→</span>
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
              <div className="w-full rounded-full bg-gray-200 h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full transition-all"
                  style={{ width: `${lastActiveItem.progress}%` }}
                />
              </div>
            }
            onClick={() => console.log('Resume module', lastActiveItem.id)}
          />
        </section>
      )}

      {/* Recommended Modules */}
      <section className="mb-12">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">おすすめのモジュール</h2>
            <p className="text-sm text-gray-600 mt-1">体系的に学べるコース</p>
          </div>
          <Link href="/activities?tab=modules" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
            すべて見る
            <span className="text-lg">→</span>
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {modules.map((module) => (
            <div key={module.id} className="w-80 flex-shrink-0">
              <Card
                title={module.title}
                description={module.summary}
                imageUrl={module.imageUrl}
                emoji={module.emoji}
                tags={
                  <div className="flex gap-2">
                    <Badge variant="default">モジュール</Badge>
                    <Badge variant="outline">{module.duration}</Badge>
                  </div>
                }
                onClick={() => router.push(module.link || `/modules/${module.id}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Activities */}
      <section className="mb-20 lg:mb-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">おすすめのアクティビティ</h2>
            <p className="text-sm text-gray-600 mt-1">すぐに始められる短時間学習</p>
          </div>
          <Link href="/activities" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
            すべて見る
            <span className="text-lg">→</span>
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {Object.values(activities).map((activity) => (
            <div key={activity.id} className="w-80 flex-shrink-0">
              <Card
                title={activity.title}
                description={activity.summary}
                imageUrl={activity.imageUrl}
                emoji={activity.emoji}
                tags={
                  <div className="flex gap-2">
                    <Badge variant="secondary">アクティビティ</Badge>
                    <Badge variant="outline">{activity.duration}</Badge>
                  </div>
                }
                onClick={() => router.push(`/activities/${activity.id}`)}
              />
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
