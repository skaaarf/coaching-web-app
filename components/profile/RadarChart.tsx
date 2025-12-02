import React from 'react';

interface RadarChartProps {
    data: { label: string; value: number; fullMark: number }[];
    color?: string;
    size?: number;
}

export default function RadarChart({ data, color = '#F97316', size = 300 }: RadarChartProps) {
    const numPoints = data.length;
    const radius = size / 2;
    const center = size / 2;
    const angleStep = (Math.PI * 2) / numPoints;

    // Helper to calculate coordinates
    const getCoordinates = (value: number, index: number, max: number) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const r = (value / max) * (radius - 40); // Leave some padding for labels
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y };
    };

    // Generate polygon points for the data
    const points = data
        .map((d, i) => {
            const { x, y } = getCoordinates(d.value, i, d.fullMark);
            return `${x},${y}`;
        })
        .join(' ');

    // Generate grid lines (e.g., 5 levels)
    const levels = 5;
    const gridPolygons = Array.from({ length: levels }).map((_, levelIndex) => {
        const levelFactor = (levelIndex + 1) / levels;
        const levelPoints = data
            .map((d, i) => {
                const { x, y } = getCoordinates(d.fullMark * levelFactor, i, d.fullMark);
                return `${x},${y}`;
            })
            .join(' ');
        return levelPoints;
    });

    // Generate axes
    const axes = data.map((d, i) => {
        const { x, y } = getCoordinates(d.fullMark, i, d.fullMark);
        return { x1: center, y1: center, x2: x, y2: y };
    });

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Grid */}
                {gridPolygons.map((points, i) => (
                    <polygon
                        key={i}
                        points={points}
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="1"
                    />
                ))}

                {/* Axes */}
                {axes.map((axis, i) => (
                    <line
                        key={i}
                        x1={axis.x1}
                        y1={axis.y1}
                        x2={axis.x2}
                        y2={axis.y2}
                        stroke="#E5E7EB"
                        strokeWidth="1"
                    />
                ))}

                {/* Data Polygon */}
                <polygon
                    points={points}
                    fill={color}
                    fillOpacity="0.2"
                    stroke={color}
                    strokeWidth="2"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const { x, y } = getCoordinates(d.value, i, d.fullMark);
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill={color}
                        />
                    );
                })}

                {/* Labels */}
                {data.map((d, i) => {
                    // Calculate label position with a bit more offset
                    const angle = i * angleStep - Math.PI / 2;
                    const labelRadius = radius - 15;
                    const x = center + labelRadius * Math.cos(angle);
                    const y = center + labelRadius * Math.sin(angle);

                    // Adjust text anchor based on position
                    let textAnchor = 'middle';
                    if (Math.abs(x - center) > 10) {
                        textAnchor = x > center ? 'start' : 'end';
                    }

                    // Adjust baseline
                    let dominantBaseline = 'middle';
                    if (Math.abs(y - center) > 10) {
                        dominantBaseline = y > center ? 'hanging' : 'auto';
                    }

                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor={textAnchor as "start" | "middle" | "end"}
                            dominantBaseline={dominantBaseline as "auto" | "middle" | "hanging"}
                            className="text-[10px] fill-gray-500 font-medium"
                            style={{ fontSize: '10px' }}
                        >
                            {d.label.split('\n').map((line, lineIndex) => (
                                <tspan key={lineIndex} x={x} dy={lineIndex === 0 ? 0 : '1.2em'}>
                                    {line}
                                </tspan>
                            ))}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
