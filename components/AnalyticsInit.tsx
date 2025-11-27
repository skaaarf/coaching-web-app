'use client';

import { useEffect } from 'react';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { firebaseApp } from '@/lib/firebase-client';

export default function AnalyticsInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (!firebaseApp) return;
      const analytics = getAnalytics(firebaseApp);
      logEvent(analytics, 'page_view');
      logEvent(analytics, 'debug_test_event');
    } catch (error) {
      // Analytics is optional; fail silently in dev.
      console.warn('Analytics init skipped:', error);
    }
  }, []);

  return null;
}
