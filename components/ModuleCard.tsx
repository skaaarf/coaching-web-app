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
  const isStarted = isInteractive
    ? !!interactiveProgress
    : messageCount > 0;
  const moduleLabel = isInteractive ? 'Interactive' : 'Dialogue';
  const progressPercent = isInteractive
    ? (interactiveProgress ? 100 : 0)
    : Math.min(100, (messageCount / 10) * 100);

  return (
    <button onClick={onClick} className="w-full text-left group">
      <article className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-4 shadow-[0_14px_38px_rgba(15,23,42,0.08)] backdrop-blur transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/[0.03] via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="relative z-10 flex gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-900/5 text-3xl">
            {module.icon}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gray-400">{module.estimatedTime}</p>
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                  {module.title}
                </h3>
              </div>
              <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-gray-500">
                {moduleLabel}
              </span>
            </div>
            <p
              className="text-sm text-gray-600 leading-snug"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {module.description}
            </p>
            <div className="flex items-center gap-3 text-[0.75rem] text-gray-500">
              <div className="flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 font-semibold text-gray-700">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {module.estimatedTime}
              </div>
              {isInteractive && interactiveProgress?.lastUpdated && (
                <span>
                  {new Date(interactiveProgress.lastUpdated).toLocaleDateString('ja-JP', {
                    month: 'numeric',
                    day: 'numeric'
                  })} 更新
                </span>
              )}
              {!isInteractive && isStarted && (
                <span>{messageCount}件の対話</span>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between text-[0.75rem] text-gray-500">
                <span className="font-semibold text-gray-900">
                  {isStarted ? '進行中' : 'まだ未体験'}
                </span>
                <span>
                  {isInteractive
                    ? (interactiveProgress ? 'プレイ履歴あり' : '未プレイ')
                    : isStarted
                      ? `${messageCount}件`
                      : '記録なし'}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${isInteractive ? 'bg-gradient-to-r from-indigo-500 to-sky-500' : 'bg-gradient-to-r from-gray-900 to-gray-500'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </button>
  );
}
