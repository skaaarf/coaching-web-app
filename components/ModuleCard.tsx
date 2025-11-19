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
    <button onClick={onClick} className="w-full text-left group">
      <article className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-4 shadow-[0_14px_38px_rgba(15,23,42,0.08)] backdrop-blur transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/[0.03] via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="relative z-10 flex gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-900/5 text-3xl">
            {module.icon}
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 leading-snug">
              {module.title}
            </h3>
            <p
              className="text-sm text-gray-600 leading-snug min-h-[2.6rem]"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {module.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
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
        </div>
      </article>
    </button>
  );
}
