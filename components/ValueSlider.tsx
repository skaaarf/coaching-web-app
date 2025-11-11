'use client';

import { useState } from 'react';

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
  tooltip?: string;
  onChange?: (newValue: number) => void;
  editable?: boolean;
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
  tooltip,
  onChange,
  editable = false,
}: ValueSliderProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const change = previousValue !== undefined ? value - previousValue : 0;
  const hasChange = change !== 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(Number(e.target.value));
    }
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Label and value */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-800">{label}</h3>
          {tooltip && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="詳細を表示"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-6 z-30 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                  {tooltip}
                  <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 transform rotate-45" />
                </div>
              )}
            </div>
          )}
        </div>
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
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Gradient fill up to current value */}
          <div
            className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${value}%` }}
          />
        </div>

        {/* Invisible input range slider (when editable) */}
        {editable && (
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleSliderChange}
            className="absolute top-1/2 -translate-y-1/2 w-full h-8 opacity-0 cursor-pointer z-30"
            aria-label={label}
          />
        )}

        {/* Left label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 text-lg pointer-events-none">
          {leftEmoji}
        </div>

        {/* Right label */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-lg pointer-events-none">
          {rightEmoji}
        </div>

        {/* Previous value marker (if exists) */}
        {previousValue !== undefined && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full border-2 border-white z-10 transition-all duration-300 pointer-events-none"
            style={{ left: `${previousValue}%` }}
            title={`前回: ${previousValue}%`}
          />
        )}

        {/* Current value marker */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full border-3 border-blue-600 z-20 shadow-lg transition-all duration-300 pointer-events-none ${editable ? 'hover:scale-110' : ''}`}
          style={{ left: `${value}%` }}
        >
          <div className="absolute inset-1 bg-blue-600 rounded-full" />
        </div>
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
