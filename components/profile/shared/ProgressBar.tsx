interface ProgressBarProps {
  value: number; // 0-100
  color?: string; // Tailwind class
  showLabel?: boolean;
  label?: string;
  height?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({
  value,
  color = 'bg-accent',
  showLabel = true,
  label,
  height = 'md',
}: ProgressBarProps) {
  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[height];

  return (
    <div>
      {showLabel && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-bold text-gray-900">{label}</span>
          <span className="text-gray-700">{value}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-gray-100 ${heightClass}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
