'use client';

interface ValueSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  leftEmoji: string;
  rightEmoji: string;
  value: number;
  previousValue?: number;
  description: string;
  reason?: string;
  confidence?: number;
}

export default function ValueSlider({
  label,
  leftLabel,
  rightLabel,
  leftEmoji,
  rightEmoji,
  value,
  previousValue,
  description,
  reason,
  confidence,
}: ValueSliderProps) {
  const change = previousValue !== undefined ? value - previousValue : 0;
  const hasChange = change !== 0;

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Label and value */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">{label}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">{value}%</span>
          {confidence !== undefined && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              信頼度: {confidence}%
            </span>
          )}
        </div>
      </div>

      {/* Slider track */}
      <div className="relative h-8 mb-2">
        {/* Background track */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full" />

        {/* Left label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 text-lg">
          {leftEmoji}
        </div>

        {/* Right label */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-lg">
          {rightEmoji}
        </div>

        {/* Previous value marker (if exists) */}
        {previousValue !== undefined && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full border-2 border-white z-10"
            style={{ left: `${previousValue}%` }}
            title={`前回: ${previousValue}%`}
          />
        )}

        {/* Current value marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white z-20 shadow-md"
          style={{ left: `${value}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-600 mb-2 px-4">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>

      {/* Description */}
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm font-medium text-gray-700">{description}</p>
        {hasChange && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded ${
              change > 0
                ? 'text-red-600 bg-red-50'
                : 'text-blue-600 bg-blue-50'
            }`}
          >
            {change > 0 ? '▲' : '▼'} {Math.abs(change)}%{' '}
            {change > 0 ? '増加' : '減少'}
          </span>
        )}
      </div>

      {/* Reason */}
      {reason && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-4 border-blue-400">
          💡 {reason}
        </div>
      )}
    </div>
  );
}
