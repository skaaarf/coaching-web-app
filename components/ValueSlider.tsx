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
    <div className="border-b border-gray-100 py-4 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-900">
          <h3 className="text-sm font-semibold">{label}</h3>
          {tooltip && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="詳細を表示"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-6 z-30 w-60 rounded-lg bg-gray-900 p-3 text-[0.65rem] text-white shadow-lg">
                  {tooltip}
                  <div className="absolute -top-1 left-2 h-2 w-2 rotate-45 bg-gray-900" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-[0.65rem] text-gray-600">
          <span className="font-semibold text-gray-900">{value}%</span>
          {confidence !== undefined && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5">
              信頼度 {confidence}%
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-3 h-5">
        <div className="absolute top-1/2 h-[6px] w-full -translate-y-1/2 rounded-full bg-gray-200/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600"
            style={{ width: `${value}%` }}
          />
        </div>

        {editable && (
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleSliderChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={label}
          />
        )}

        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 text-base">
          {leftEmoji}
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-base">
          {rightEmoji}
        </div>

        {previousValue !== undefined && (
          <div
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white bg-gray-400 shadow-sm"
            style={{ left: `${previousValue}%` }}
            title={`前回: ${previousValue}%`}
          />
        )}

        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-blue-600 bg-white ${editable ? 'shadow-md' : 'shadow-sm'}`}
          style={{ left: `${value}%`, width: '14px', height: '14px' }}
        >
          <div className="absolute inset-[2px] rounded-full bg-blue-600" />
        </div>
      </div>

      <div className="mt-2 flex justify-between text-[0.65rem] text-gray-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-gray-700">
        <p className="flex-1">{description}</p>
        {hasChange && (
          <span
            className={`rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold ${
              change > 0 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}
          >
            {change > 0 ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
      </div>

      {reason && (
        <div className="mt-2 rounded-xl bg-gray-50 px-3 py-2 text-[0.7rem] text-gray-600">
          💡 {reason}
        </div>
      )}
    </div>
  );
}
