'use client';

import { useParams, useRouter } from 'next/navigation';
import ActivityRunner from '@/components/activity/ActivityRunner';
import { a4_holiday_diagnosis } from '@/data/activities/a4_holiday_diagnosis';
import { a1_moyamoya } from '@/data/activities/a1_moyamoya';
import { a2_recent_success } from '@/data/activities/a2_recent_success';
import { a3_likes_dislikes } from '@/data/activities/a3_likes_dislikes';
import { a5_compass } from '@/data/activities/a5_compass';
import { ActivityDefinition } from '@/types/activity';
import { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import Button from '@/components/ui/Button';

const activities: Record<string, ActivityDefinition> = {
    'a4-holiday': a4_holiday_diagnosis,
    'a1-moyamoya': a1_moyamoya,
    'a2-recent-success': a2_recent_success,
    'a3-likes-dislikes': a3_likes_dislikes,
    'a5-compass': a5_compass,
};

export default function ActivityPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const activity = activities[id];
    const [isCompleted, setIsCompleted] = useState(false);
    const [results, setResults] = useState<any>(null);

    if (!activity) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Activity not found</p>
            </div>
        );
    }

    const handleComplete = (answers: any) => {
        console.log('Activity completed:', answers);
        setResults(answers);
        setIsCompleted(true);
        // Here we would calculate scores and save to backend/context
    };

    if (isCompleted) {
        return (
            <AppLayout>
                <div className="mx-auto max-w-2xl py-12 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">診断完了！</h2>
                    <p className="mb-8 text-gray-600">
                        回答ありがとうございました。<br />
                        あなたの価値観が見えてきました。
                    </p>

                    {/* Simple result display for A4 */}
                    {id === 'a4-holiday' && (
                        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm text-left">
                            <h3 className="mb-4 font-bold text-gray-900">あなたの価値観（仮）</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li>自分のペースを大切にする</li>
                                <li>成長を感じられる環境が好き</li>
                            </ul>
                        </div>
                    )}

                    <Button onClick={() => router.push('/activities')}>
                        ライブラリに戻る
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return <ActivityRunner activity={activity} onComplete={handleComplete} />;
}
