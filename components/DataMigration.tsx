'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/SessionProvider';
import { migrateLocalStorageToFirebase, hasLocalStorageData } from '@/lib/migration';

/**
 * Component that handles automatic data migration from localStorage to Supabase
 * when user logs in for the first time
 */
export function DataMigration() {
  const { userId } = useAuth();
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'completed' | 'error'>('idle');
  const [migrationDetails, setMigrationDetails] = useState<{
    migratedModules: number;
    migratedInteractiveModules: number;
    migratedInsights: boolean;
  } | null>(null);

  useEffect(() => {
    // Only attempt migration if user is logged in and has local data
    if (!userId || !hasLocalStorageData() || migrationStatus !== 'idle') {
      return;
    }

    const performMigration = async () => {
      setMigrationStatus('migrating');
      console.log('Starting data migration from localStorage to Supabase...');

      const result = await migrateLocalStorageToFirebase(userId);

      if (result.success) {
        setMigrationStatus('completed');
        setMigrationDetails({
          migratedModules: result.migratedModules,
          migratedInteractiveModules: result.migratedInteractiveModules,
          migratedInsights: result.migratedInsights
        });
        console.log('Data migration completed successfully:', result);
      } else {
        setMigrationStatus('error');
        console.error('Data migration failed:', result.error);
      }
    };

    performMigration();
  }, [userId, migrationStatus]);

  // Show migration notification
  if (migrationStatus === 'migrating') {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>データを同期中...</span>
        </div>
      </div>
    );
  }

  if (migrationStatus === 'completed' && migrationDetails) {
    const totalMigrated = migrationDetails.migratedModules + migrationDetails.migratedInteractiveModules;
    if (totalMigrated > 0 || migrationDetails.migratedInsights) {
      return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>データをクラウドに保存しました</span>
          </div>
        </div>
      );
    }
  }

  if (migrationStatus === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>データの同期に失敗しました</span>
        </div>
      </div>
    );
  }

  return null;
}
