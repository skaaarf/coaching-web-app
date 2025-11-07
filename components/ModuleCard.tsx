import Link from 'next/link';
import { Module, ModuleProgress, InteractiveModuleProgress } from '@/types';

interface ModuleCardProps {
  module: Module;
  progress?: ModuleProgress;
  interactiveProgress?: InteractiveModuleProgress;
}

export default function ModuleCard({ module, progress, interactiveProgress }: ModuleCardProps) {
  // Handle both chat and interactive modules
  const isInteractive = module.moduleType === 'interactive';
  const relevantProgress = isInteractive ? interactiveProgress : progress;

  const messageCount = progress?.messages.length || 0;
  const isStarted = isInteractive
    ? !!interactiveProgress
    : messageCount > 0;
  const isCompleted = relevantProgress?.completed || false;

  // Determine the correct path based on module type
  const modulePath = isInteractive
    ? `/interactive/${module.id}`
    : `/module/${module.id}`;

  return (
    <Link href={modulePath}>
      <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-300 bg-white p-5 sm:p-6 shadow-md transition-all duration-200 hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 touch-manipulation">
        {/* Progress indicator */}
        {isStarted && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200">
            <div
              className={`h-full ${module.color} transition-all duration-300 shadow-sm`}
              style={{ width: isCompleted ? '100%' : '50%' }}
            />
          </div>
        )}

        {/* Icon and status */}
        <div className="flex items-start justify-between mb-4">
          <div className={`text-5xl sm:text-4xl transition-all duration-200 ${isCompleted ? 'opacity-100 scale-110' : 'opacity-90'} group-hover:scale-125`}>
            {module.icon}
          </div>
          {isCompleted && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border-2 border-green-300 animate-fade-in shadow-sm">
              完了
            </span>
          )}
          {isStarted && !isCompleted && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border-2 border-blue-300 animate-fade-in shadow-sm">
              進行中
            </span>
          )}
        </div>

        {/* Title and description */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors leading-tight">
          {module.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-700 mb-4 line-clamp-3 leading-relaxed font-medium">
          {module.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 font-medium">
          <span className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
            <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {module.estimatedTime}
          </span>
          {isStarted && !isInteractive && (
            <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              {messageCount}件の対話
            </span>
          )}
          {isStarted && isInteractive && (
            <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              保存済み
            </span>
          )}
        </div>

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
    </Link>
  );
}
