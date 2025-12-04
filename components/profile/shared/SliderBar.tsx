interface SliderBarProps {
  score: number; // 1-10
  leftLabel: string;
  rightLabel: string;
  showScore?: boolean;
}

export default function SliderBar({ score, leftLabel, rightLabel, showScore = true }: SliderBarProps) {
  // スコア1-10を0-100%の位置に変換
  const position = ((score - 1) / 9) * 100;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="shrink-0 w-16 text-left font-medium text-gray-700">{leftLabel}</span>
      <div className="relative flex-1 flex items-center">
        {/* バー全体 */}
        <div className="absolute inset-0 flex items-center">
          <div className="h-1 w-full rounded-full bg-gray-200" />
        </div>
        {/* スライダーポイント */}
        <div
          className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-sm transition-all duration-300"
          style={{ left: `${position}%` }}
        />
      </div>
      <span className="shrink-0 w-16 text-right font-medium text-gray-700">{rightLabel}</span>
      {showScore && <span className="shrink-0 w-12 text-right text-gray-500">({score}/10)</span>}
    </div>
  );
}
