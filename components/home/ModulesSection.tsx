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
    return (
        <>
            <div ref={modulesSectionRef} className="scroll-mt-24 mt-6">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">モジュール</h2>
                    <p className="text-sm text-gray-500 mt-1">対話とゲームで、自分の意志を磨こう</p>
                </div>

                <div className="space-y-5">
                    {CAREER_MODULES.filter(m => m.moduleType === 'chat').map(moduleDefinition => (
                        <ModuleCard
                            key={moduleDefinition.id}
                            module={moduleDefinition}
                            progress={allProgress[moduleDefinition.id]}
                            interactiveProgress={allInteractiveProgress[moduleDefinition.id]}
                            onClick={() => onModuleClick(moduleDefinition.id, moduleDefinition.moduleType || 'chat')}
                        />
                    ))}
                    {CAREER_MODULES.filter(m => m.moduleType === 'interactive').map(moduleDefinition => (
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

            <section className="mt-10 overflow-hidden rounded-[32px] border border-gray-900/10 bg-gradient-to-br from-gray-900 via-[#0d1422] to-black px-6 py-8 text-white shadow-[0_40px_90px_rgba(10,10,10,0.6)]">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="flex-1 space-y-3">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Mikata signal</p>
                        <h3 className="text-2xl font-semibold">気になることを見つけたら、いつでも声をかけてね</h3>
                        <p className="text-sm text-white/70">
                            モジュールの途中でも質問があれば「ヒントがほしい」と送ってみよう。みかたくんが次の一歩を一緒に考えます。
                        </p>
                    </div>
                    <div className="relative h-32 w-32 flex-shrink-0">
                        <Image
                            src="/mascot/coach-standing.png"
                            alt="みかたくん"
                            fill
                            sizes="128px"
                            className="object-contain drop-shadow-[0_20px_40px_rgba(32,32,32,0.45)]"
                        />
                    </div>
                </div>
                <div className="mt-6 text-xs text-white/60">
                    対話の中で価値観が見えてきたら、「価値観バトル」にも挑戦してみよう！
                </div>
            </section>
        </>
    );
}
