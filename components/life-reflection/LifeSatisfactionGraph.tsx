'use client';

import { useMemo } from 'react';
import { LifeReflectionData, TurningPoint } from '@/types';
import { getErasForAge } from '@/lib/lifeReflectionData';

interface Props {
    data: LifeReflectionData;
    onAddTurningPoint: () => void;
    onBack: () => void;
}

interface ChartPoint {
    age: number;
    satisfaction: number;
    label: string;
}

export default function LifeSatisfactionGraph({
    data,
    onAddTurningPoint,
    onBack,
}: Props) {
    const availableEras = getErasForAge(data.userAge);

    // Build chart points from era data
    const chartPoints: ChartPoint[] = useMemo(() => {
        const points: ChartPoint[] = [];

        availableEras.forEach((era) => {
            const eraData = data.eras[era.id];
            if (
                eraData?.satisfaction !== null &&
                eraData?.satisfaction !== undefined
            ) {
                const age = era.graphAge ?? data.userAge;
                points.push({
                    age,
                    satisfaction: eraData.satisfaction,
                    label: era.name,
                });
            }
        });

        // Sort by age
        return points.sort((a, b) => a.age - b.age);
    }, [data, availableEras]);

    if (chartPoints.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-6">
                <p>No data to display</p>
            </div>
        );
    }

    // Chart dimensions and scales
    const width = 600;
    const height = 400;
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const minAge = Math.min(...chartPoints.map((p) => p.age));
    const maxAge = Math.max(...chartPoints.map((p) => p.age));
    const minSatisfaction = 0;
    const maxSatisfaction = 10;

    // Scale functions
    const scaleX = (age: number) =>
        padding.left +
        ((age - minAge) / (maxAge - minAge)) * chartWidth;

    const scaleY = (satisfaction: number) =>
        padding.top +
        chartHeight -
        ((satisfaction - minSatisfaction) / (maxSatisfaction - minSatisfaction)) *
        chartHeight;

    // Generate path for line
    const linePath = chartPoints
        .map((point, i) => {
            const x = scaleX(point.age);
            const y = scaleY(point.satisfaction);
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        })
        .join(' ');

    // Y-axis labels
    const yAxisLabels = [0, 2, 4, 6, 8, 10];

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 flex items-center gap-1"
                >
                    ← 時代一覧に戻る
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    人生の満足度グラフ
                </h2>
                <p className="text-sm text-gray-600">
                    これまでの人生を振り返った結果です
                </p>
            </div>

            {/* Graph */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg mb-6">
                <div className="overflow-x-auto">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full"
                        style={{ maxWidth: '600px', margin: '0 auto', display: 'block' }}
                    >
                        {/* Grid lines */}
                        {yAxisLabels.map((value) => (
                            <line
                                key={value}
                                x1={padding.left}
                                y1={scaleY(value)}
                                x2={width - padding.right}
                                y2={scaleY(value)}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                            />
                        ))}

                        {/* Y-axis */}
                        <line
                            x1={padding.left}
                            y1={padding.top}
                            x2={padding.left}
                            y2={height - padding.bottom}
                            stroke="#6b7280"
                            strokeWidth="2"
                        />

                        {/* X-axis */}
                        <line
                            x1={padding.left}
                            y1={height - padding.bottom}
                            x2={width - padding.right}
                            y2={height - padding.bottom}
                            stroke="#6b7280"
                            strokeWidth="2"
                        />

                        {/* Y-axis labels */}
                        {yAxisLabels.map((value) => (
                            <text
                                key={value}
                                x={padding.left - 10}
                                y={scaleY(value)}
                                textAnchor="end"
                                dominantBaseline="middle"
                                fontSize="12"
                                fill="#6b7280"
                            >
                                {value}
                            </text>
                        ))}

                        {/* Y-axis title */}
                        <text
                            x={20}
                            y={padding.top - 10}
                            fontSize="12"
                            fill="#374151"
                            fontWeight="600"
                        >
                            満足度
                        </text>

                        {/* X-axis title */}
                        <text
                            x={width / 2}
                            y={height - 15}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#374151"
                            fontWeight="600"
                        >
                            年齢
                        </text>

                        {/* Line path */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0ea5e9" />
                                <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                        </defs>

                        {/* Data points */}
                        {chartPoints.map((point, i) => (
                            <g key={i}>
                                <circle
                                    cx={scaleX(point.age)}
                                    cy={scaleY(point.satisfaction)}
                                    r="6"
                                    fill="#3b82f6"
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                />
                                {/* Age label */}
                                <text
                                    x={scaleX(point.age)}
                                    y={height - padding.bottom + 20}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill="#4b5563"
                                    fontWeight="600"
                                >
                                    {point.age}歳
                                </text>
                                {/* Era label */}
                                <text
                                    x={scaleX(point.age)}
                                    y={height - padding.bottom + 35}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fill="#9ca3af"
                                >
                                    {point.label.replace('時代', '')}
                                </text>
                            </g>
                        ))}

                        {/* Turning points */}
                        {data.turningPoints.map((tp, i) => {
                            // Find satisfaction at this age (interpolate if needed)
                            let satisfaction = 5; // default
                            const exactPoint = chartPoints.find((p) => p.age === tp.age);
                            if (exactPoint) {
                                satisfaction = exactPoint.satisfaction;
                            } else {
                                // Simple interpolation
                                const before = chartPoints
                                    .filter((p) => p.age < tp.age)
                                    .sort((a, b) => b.age - a.age)[0];
                                const after = chartPoints
                                    .filter((p) => p.age > tp.age)
                                    .sort((a, b) => a.age - b.age)[0];

                                if (before && after) {
                                    const ratio = (tp.age - before.age) / (after.age - before.age);
                                    satisfaction =
                                        before.satisfaction +
                                        ratio * (after.satisfaction - before.satisfaction);
                                } else if (before) {
                                    satisfaction = before.satisfaction;
                                } else if (after) {
                                    satisfaction = after.satisfaction;
                                }
                            }

                            return (
                                <g key={tp.id}>
                                    <text
                                        x={scaleX(tp.age)}
                                        y={scaleY(satisfaction) - 15}
                                        textAnchor="middle"
                                        fontSize="20"
                                    >
                                        ⭐
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Turning Points List */}
            {data.turningPoints.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-5 mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span>⭐</span>
                        <span>人生の転機</span>
                    </h3>
                    <div className="space-y-2">
                        {data.turningPoints.map((tp) => (
                            <div
                                key={tp.id}
                                className="bg-white rounded-lg p-3 border border-amber-200"
                            >
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded flex-shrink-0">
                                        {tp.age}歳
                                    </span>
                                    <p className="text-sm text-gray-800 flex-1">
                                        {tp.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Turning Point Button */}
            <button
                onClick={onAddTurningPoint}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white py-3 px-6 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 mb-4"
            >
                ⭐ 転機を追加する
            </button>
        </div>
    );
}
