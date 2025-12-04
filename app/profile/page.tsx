'use client';

import AppLayout from '@/components/layouts/AppLayout';
import AnalysisResults from '@/components/profile/analysis/AnalysisResults';
import { mockProfileAnalysisData } from '@/data/mockProfileAnalysis';

export default function ProfilePage() {
    return (
        <AppLayout>
            {/* New Analysis Results */}
            <div className="mb-20 lg:mb-10">
                <AnalysisResults data={mockProfileAnalysisData} />
            </div>
        </AppLayout>
    );
}
