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
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
        {/* Progress indicator */}
        {isStarted && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
            <div
              className={`h-full ${module.color} transition-all duration-300`}
              style={{ width: isCompleted ? '100%' : '50%' }}
            />
          </div>
        )}

        {/* Icon and status */}
        <div className="flex items-start justify-between mb-4">
          <div className={`text-4xl transition-all duration-200 ${isCompleted ? 'opacity-100 scale-110' : 'opacity-80'} group-hover:scale-110`}>
            {module.icon}
          </div>
          {isCompleted && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-fade-in">
              完了
            </span>
          )}
          {isStarted && !isCompleted && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-fade-in">
              進行中
            </span>
          )}
        </div>

        {/* Title and description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
          {module.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {module.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {module.estimatedTime}
          </span>
          {isStarted && !isInteractive && (
            <span className="text-gray-400">
              {messageCount}件の対話
            </span>
          )}
          {isStarted && isInteractive && (
            <span className="text-gray-400">
              保存済み
            </span>
          )}
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 rounded-2xl pointer-events-none transition-colors" />
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
