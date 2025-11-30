import Image from 'next/image';
import { CAREER_MODULES } from '@/lib/modules';
import { ModuleProgress, InteractiveModuleProgress } from '@/types';
import ModuleCard from '@/components/ModuleCard';

interface ModulesSectionProps {
    modulesSectionRef: React.RefObject<HTMLDivElement | null>;
    allProgress: Record<string, ModuleProgress>;
    allInteractiveProgress: Record<string, InteractiveModuleProgress>;
    onModuleClick: (moduleId: string, moduleType: 'chat' | 'interactive') => void;
}

export default function ModulesSection({
    modulesSectionRef,
    allProgress,
    allInteractiveProgress,
    onModuleClick,
}: ModulesSectionProps) {
    const interactiveModules = CAREER_MODULES
        .filter(m => m.moduleType === 'interactive')
        .sort((a, b) => {
            if (a.id === 'life-reflection') return -1;
            if (b.id === 'life-reflection') return 1;
            return 0;
        });

    return (
        <>
            <div ref={modulesSectionRef} className="scroll-mt-24 mt-6">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">モジュール</h2>
                    <p className="text-sm text-gray-500 mt-1">対話とゲームで、自分の意志を磨こう</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {CAREER_MODULES.filter(m => m.moduleType === 'chat').map(moduleDefinition => (
                        <ModuleCard
                            key={moduleDefinition.id}
                            module={moduleDefinition}
                            progress={allProgress[moduleDefinition.id]}
                            interactiveProgress={allInteractiveProgress[moduleDefinition.id]}
                            onClick={() => onModuleClick(moduleDefinition.id, moduleDefinition.moduleType || 'chat')}
                        />
                    ))}
                    {interactiveModules.map(moduleDefinition => (
                        <ModuleCard
                            key={moduleDefinition.id}
                            module={moduleDefinition}
                            progress={allProgress[moduleDefinition.id]}
                            interactiveProgress={allInteractiveProgress[moduleDefinition.id]}
                            onClick={() => onModuleClick(moduleDefinition.id, moduleDefinition.moduleType || 'interactive')}
                        />
                    ))}
                </div>
            </div>


        </>
    );
}
