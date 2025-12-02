'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layouts/AppLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { activities, modules } from '@/data/activities';
import { Search } from 'lucide-react';

export default function ActivitiesPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'activities' | 'modules'>('activities');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = activeTab === 'activities'
        ? Object.values(activities).filter(a => a.title.includes(searchQuery))
        : modules.filter(m => m.title.includes(searchQuery));

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">アクティビティライブラリ</h1>
            </div>

            {/* Search and Tabs */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        placeholder={`${activeTab === 'activities' ? 'アクティビティ' : 'モジュール'}を検索...`}
                    />
                </div>

                <div className="flex rounded-xl bg-gray-100 p-1">
                    <button
                        onClick={() => setActiveTab('activities')}
                        className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all sm:flex-none ${activeTab === 'activities'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        アクティビティ
                    </button>
                    <button
                        onClick={() => setActiveTab('modules')}
                        className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all sm:flex-none ${activeTab === 'modules'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        モジュール
                    </button>
                </div>
            </div>

            {/* Suggested Section */}
            <section className="mb-10">
                <h2 className="mb-4 text-lg font-bold text-gray-900 text-primary">あなたへのおすすめ</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.slice(0, 2).map((item) => (
                        <Card
                            key={item.id}
                            title={item.title}
                            description={item.summary || item.description} // Fallback to description if summary is missing
                            imageUrl={item.imageUrl}
                            emoji={item.emoji}
                            tags={
                                <div className="flex gap-2">
                                    <Badge variant={activeTab === 'activities' ? 'default' : 'accent'}>
                                        {activeTab === 'activities' ? 'アクティビティ' : 'モジュール'}
                                    </Badge>
                                    <Badge variant="secondary">{item.duration}</Badge>
                                </div>
                            }
                            onClick={() => {
                                if (activeTab === 'activities') {
                                    router.push(`/activities/${item.id}`);
                                } else {
                                    // For modules, we might want to go to a module detail page or the first activity
                                    console.log('Open module', item.id);
                                }
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* All Items Section */}
            <section className="mb-20 lg:mb-10">
                <h2 className="mb-4 text-lg font-bold text-gray-900 text-primary">すべての{activeTab === 'activities' ? 'アクティビティ' : 'モジュール'}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item) => (
                        <Card
                            key={item.id}
                            title={item.title}
                            description={item.summary || item.description}
                            imageUrl={item.imageUrl}
                            emoji={item.emoji}
                            tags={
                                <div className="flex gap-2">
                                    <Badge variant={activeTab === 'activities' ? 'default' : 'accent'}>
                                        {activeTab === 'activities' ? 'アクティビティ' : 'モジュール'}
                                    </Badge>
                                    <Badge variant="secondary">{item.duration}</Badge>
                                </div>
                            }
                            onClick={() => {
                                if (activeTab === 'activities') {
                                    router.push(`/activities/${item.id}`);
                                } else {
                                    console.log('Open module', item.id);
                                }
                            }}
                        />
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}
