import Image from 'next/image';
import { Module, ModuleProgress, InteractiveModuleProgress } from '@/types';

interface ModuleCardProps {
  module: Module;
  progress?: ModuleProgress;
  interactiveProgress?: InteractiveModuleProgress;
  onClick?: () => void;
}

export default function ModuleCard({ module, progress, interactiveProgress, onClick }: ModuleCardProps) {
  // Handle both chat and interactive modules
  const isInteractive = module.moduleType === 'interactive';
  const messageCount = progress?.messages.length || 0;
  const lastUpdatedLabel = interactiveProgress?.lastUpdated
    ? `${new Date(interactiveProgress.lastUpdated).toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric'
    })} 更新`
    : null;
  const dialogueMeta = !isInteractive && messageCount > 0 ? `${messageCount}件の対話` : null;

  return (
    <button onClick={onClick} className="w-full text-left group h-full">
      <article className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-[0_14px_38px_rgba(15,23,42,0.08)] backdrop-blur transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] h-full flex flex-row min-h-[220px]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/[0.03] via-transparent to-transparent opacity-0 transition group-hover:opacity-100 pointer-events-none z-20" />

        {/* Left: Image Area */}
        <div className="w-5/12 relative bg-gray-50 border-r border-gray-100">
          {module.icon.startsWith('/') ? (
            <Image
              src={module.icon}
              alt={module.title}
              fill
              sizes="(max-width: 1024px) 45vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {module.icon}
            </div>
          )}
        </div>

        {/* Right: Text Area */}
        <div className="w-7/12 p-6 flex flex-col justify-center relative z-10">
          <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3">
            {module.title}
          </h3>
          <p
            className="text-sm text-gray-600 leading-relaxed mb-4"
          >
            {module.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100/50 mt-auto">
            <div className="flex items-center gap-1.5 font-semibold text-gray-700">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{module.estimatedTime}</span>
            </div>
            {lastUpdatedLabel && <span>{lastUpdatedLabel}</span>}
            {dialogueMeta && <span>{dialogueMeta}</span>}
          </div>
        </div>
      </article>
    </button>
  );
}
