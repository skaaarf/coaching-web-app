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
  const relevantProgress = isInteractive ? interactiveProgress : progress;

  const messageCount = progress?.messages.length || 0;
  const isStarted = isInteractive
    ? !!interactiveProgress
    : messageCount > 0;
  const isCompleted = relevantProgress?.completed || false;

  return (
    <button
      onClick={onClick}
      className="w-full text-left"
    >
      <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:border-blue-400 active:scale-98 touch-manipulation">

        {/* Icon and status */}
        <div className="flex items-start justify-between mb-5">
          <div className={`text-7xl transition-all duration-200 ${isCompleted ? 'opacity-100' : 'opacity-90'}`}>
            {module.icon}
          </div>
          {isCompleted && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 border-2 border-green-300 animate-fade-in shadow-sm">
              完了
            </span>
          )}
        </div>

        {/* Title and description */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">
          {module.title}
        </h3>
        <p className="text-base text-gray-700 mb-5 leading-relaxed font-medium">
          {module.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
          <span className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            <svg className="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {module.estimatedTime}
          </span>
          {isStarted && !isInteractive && (
            <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              {messageCount}件の対話
            </span>
          )}
          {isStarted && isInteractive && interactiveProgress?.lastUpdated && (
            <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              {new Date(interactiveProgress.lastUpdated).toLocaleDateString('ja-JP', {
                month: 'numeric',
                day: 'numeric'
              })}にプレイ
            </span>
          )}
        </div>

        {/* Game history for interactive modules */}
        {isInteractive && isStarted && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-semibold">プレイ履歴</p>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700">
                  {interactiveProgress?.lastUpdated && (
                    <>
                      最終プレイ: {new Date(interactiveProgress.lastUpdated).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric'
                      })}
                    </>
                  )}
                </span>
                {isCompleted && (
                  <span className="text-green-700 font-semibold">✓ 完了済み</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hover effect */}
        <div className="absolute inset-0 border-3 border-transparent group-hover:border-blue-300 rounded-2xl pointer-events-none transition-colors" />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </button>
  );
}
