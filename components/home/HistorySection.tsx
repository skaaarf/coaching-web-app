import { ModuleProgress } from '@/types';
import DialogueHistoryHome from '@/components/DialogueHistoryHome';

interface HistorySectionProps {
    allProgress: Record<string, ModuleProgress>;
    onSessionClick: (moduleId: string, sessionId: string) => void;
}

export default function HistorySection({
    allProgress,
    onSessionClick,
}: HistorySectionProps) {
    return (
        <div className="mt-6">
            <DialogueHistoryHome
                chatProgress={allProgress}
                onSessionClick={onSessionClick}
            />
        </div>
    );
}
