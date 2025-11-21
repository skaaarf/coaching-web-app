import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { generateInsights } from '@/lib/insights';
import { migrateToSessions } from '@/lib/storage';
import { CAREER_MODULES } from '@/lib/modules';
import { ModuleProgress, InteractiveModuleProgress, UserInsights, ValueSnapshot } from '@/types';

export function useHomeData() {
    const router = useRouter();
    const storage = useStorage();
    const [allProgress, setAllProgress] = useState<Record<string, ModuleProgress>>({});
    const [allInteractiveProgress, setAllInteractiveProgress] = useState<Record<string, InteractiveModuleProgress>>({});
    const [insights, setInsights] = useState<UserInsights | null>(null);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [insightsError, setInsightsError] = useState<Error | null>(null);
    const [currentValues, setCurrentValues] = useState<ValueSnapshot | null>(null);
    const [previousValues, setPreviousValues] = useState<ValueSnapshot | null>(null);
    const [loadingValues, setLoadingValues] = useState(false);
    const [valuesError, setValuesError] = useState<Error | null>(null);
    const [activeTab, setActiveTab] = useState<'values' | 'insights'>('values');
    const [activeSection, setActiveSection] = useState<'analysis' | 'modules' | 'history'>('modules');
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [showModuleDialog, setShowModuleDialog] = useState(false);
    const [moduleSessions, setModuleSessions] = useState<ModuleProgress[]>([]);
    const [interactiveModuleSessions, setInteractiveModuleSessions] = useState<InteractiveModuleProgress[]>([]);
    const modulesSectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        migrateToSessions();

        const loadData = async () => {
            const progress = await storage.getAllModuleProgress();
            const interactiveProgress = await storage.getAllInteractiveModuleProgress();
            setAllProgress(progress);
            setAllInteractiveProgress(interactiveProgress);

            const savedInsights = await storage.getUserInsights();
            const hasProgress = Object.keys(progress).length > 0 || Object.keys(interactiveProgress).length > 0;

            if (hasProgress) {
                setInsights(savedInsights);
                regenerateInsights(progress);
            } else {
                setInsights(savedInsights);
            }

            fetchValues();
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storage]);

    const fetchValues = async () => {
        try {
            setLoadingValues(true);
            setValuesError(null);
            const snapshots = await storage.getAllValueSnapshots();

            if (snapshots && snapshots.length > 0) {
                setCurrentValues(snapshots[0]);
                setPreviousValues(snapshots.length > 1 ? snapshots[1] : null);
            } else {
                setCurrentValues(null);
                setPreviousValues(null);
            }
        } catch (err) {
            console.error('Error fetching values:', err);
            setValuesError(err instanceof Error ? err : new Error('価値観の読み込みに失敗しました'));
        } finally {
            setLoadingValues(false);
        }
    };

    const regenerateInsights = async (progress?: Record<string, ModuleProgress>) => {
        setIsLoadingInsights(true);
        setInsightsError(null);
        try {
            const progressToUse = progress || allProgress;
            const newInsights = await generateInsights(progressToUse);
            setInsights(newInsights);
            await storage.saveUserInsights(newInsights);
        } catch (error) {
            console.error('Failed to generate insights:', error);
            setInsightsError(error instanceof Error ? error : new Error('キャリア志向の分析に失敗しました'));
        } finally {
            setIsLoadingInsights(false);
        }
    };

    const instantModules = new Set(['persona-dictionary', 'career-dictionary', 'life-reflection']);

    const handleModuleClick = async (moduleId: string, moduleType: 'chat' | 'interactive') => {
        if (instantModules.has(moduleId)) {
            // Life Reflectionは常に同じセッションを使う（編集モード）
            if (moduleId === 'life-reflection') {
                const sessions = await storage.getInteractiveModuleSessions(moduleId);
                const sessionId = sessions.length > 0 ? sessions[0].sessionId : 'life-reflection-main';
                const path = `/interactive/${moduleId}?sessionId=${sessionId}`;
                router.push(path);
                return;
            }

            // Other instant modules
            const path = moduleType === 'chat'
                ? `/module/${moduleId}`
                : `/interactive/${moduleId}`;
            router.push(path);
            return;
        }

        if (moduleType === 'chat') {
            const sessions = await storage.getModuleSessions(moduleId);
            setModuleSessions(sessions);
            setInteractiveModuleSessions([]);
        } else {
            const sessions = await storage.getInteractiveModuleSessions(moduleId);
            setInteractiveModuleSessions(sessions);
            setModuleSessions([]);
        }

        setSelectedModule(moduleId);
        setShowModuleDialog(true);
    };

    const handleContinue = (sessionId?: string) => {
        if (!selectedModule) return;
        const moduleDefinition = CAREER_MODULES.find(m => m.id === selectedModule);
        if (!moduleDefinition) return;

        if (sessionId) {
            const path = moduleDefinition.moduleType === 'chat'
                ? `/module/${selectedModule}?sessionId=${sessionId}`
                : `/interactive/${selectedModule}?sessionId=${sessionId}`;
            router.push(path);
        } else {
            const path = moduleDefinition.moduleType === 'chat'
                ? `/module/${selectedModule}`
                : `/interactive/${selectedModule}`;
            router.push(path);
        }
        setShowModuleDialog(false);
    };

    const handleStartNew = () => {
        if (!selectedModule) return;
        const moduleDefinition = CAREER_MODULES.find(m => m.id === selectedModule);
        if (!moduleDefinition) return;

        const newSessionId = `session-${Date.now()}`;
        const path = moduleDefinition.moduleType === 'chat'
            ? `/module/${selectedModule}?sessionId=${newSessionId}`
            : `/interactive/${selectedModule}?sessionId=${newSessionId}`;
        router.push(path);
        setShowModuleDialog(false);
    };

    const hasAnyProgress = Object.keys(allProgress).length > 0 || Object.keys(allInteractiveProgress).length > 0;

    return {
        allProgress,
        allInteractiveProgress,
        insights,
        isLoadingInsights,
        insightsError,
        currentValues,
        previousValues,
        loadingValues,
        valuesError,
        activeTab,
        setActiveTab,
        activeSection,
        setActiveSection,
        selectedModule,
        showModuleDialog,
        setShowModuleDialog,
        moduleSessions,
        interactiveModuleSessions,
        modulesSectionRef,
        handleModuleClick,
        handleContinue,
        handleStartNew,
        hasAnyProgress,
        router, // Export router if needed, though mostly handled internally
    };
}
