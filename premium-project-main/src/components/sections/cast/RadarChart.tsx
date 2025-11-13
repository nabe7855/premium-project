'use client';
import React from 'react';

interface RadarChartProps {
  data: {
    label: string;
    value: number;
    emoji: string;
  }[];
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = size / 2 - 40;
  const maxValue = 5;

  // 各項目の角度を計算（6項目なので60度ずつ）
  const angleStep = (2 * Math.PI) / data.length;

  // 座標計算関数
  const getCoordinates = (angle: number, distance: number) => {
    const x = center + distance * Math.cos(angle - Math.PI / 2);
    const y = center + distance * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  // レーダーチャートの背景グリッドを生成
  const generateGridLines = () => {
    const lines = [];
    const levels = 5;

    // 同心円を描画
    for (let i = 1; i <= levels; i++) {
      const r = (radius * i) / levels;
      lines.push(
        <circle
          key={`circle-${i}`}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity={0.5}
        />
      );
    }

    // 軸線を描画
    data.forEach((_, index) => {
      const angle = angleStep * index;
      const { x, y } = getCoordinates(angle, radius);
      lines.push(
        <line
          key={`line-${index}`}
          x1={center}
          y1={center}
          x2={x}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity={0.5}
        />
      );
    });

    return lines;
  };

  // データポイントの座標を計算
  const dataPoints = data.map((item, index) => {
    const angle = angleStep * index;
    const distance = (radius * item.value) / maxValue;
    return getCoordinates(angle, distance);
  });

  // レーダーチャートのパスを生成
  const radarPath = dataPoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ') + ' Z';

  // ラベルの座標を計算
  const labelPoints = data.map((item, index) => {
    const angle = angleStep * index;
    const distance = radius + 25;
    const coords = getCoordinates(angle, distance);
    return { ...coords, ...item };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* 背景グリッド */}
        {generateGridLines()}
        
        {/* レーダーチャートエリア */}
        <path
          d={radarPath}
          fill="rgba(220, 20, 60, 0.2)"
          stroke="#DC143C"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* データポイント */}
        {dataPoints.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#DC143C"
            stroke="white"
            strokeWidth="2"
          />
        ))}
        
        {/* ラベル */}
        {labelPoints.map((point, index) => (
          <g key={`label-${index}`}>
            <text
              x={point.x}
              y={point.y - 8}
              textAnchor="middle"
              className="text-xs font-medium fill-neutral-700"
            >
              {point.emoji}
            </text>
            <text
              x={point.x}
              y={point.y + 8}
              textAnchor="middle"
              className="text-xs fill-neutral-600"
            >
              {point.label}
            </text>
            <text
              x={point.x}
              y={point.y + 20}
              textAnchor="middle"
              className="text-xs font-bold fill-primary"
            >
              {data[index].value}/5
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default RadarChart;