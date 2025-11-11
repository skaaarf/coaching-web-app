'use client';

interface AnalyzingAnimationProps {
  progress?: number; // 0-100
}

export default function AnalyzingAnimation({ progress = 50 }: AnalyzingAnimationProps) {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm w-full mx-4">
      <div className="flex items-center gap-3">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-800 mb-1">
            価値観を分析中...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
