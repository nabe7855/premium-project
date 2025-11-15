import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface RadarChartProps {
  // Record<string, number> を受け取る
  data: Record<string, number>;
}

export default function RadarChartComponent({ data }: RadarChartProps) {
  // DBからのカテゴリを chartData に変換
  const chartData = Object.entries(data).map(([category, score]) => ({
    subject: category,
    A: score,
    fullMark: 5,
  }));

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
        セラピスト能力チャート
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#f3f4f6" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              className="text-sm"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickCount={6}
            />
            <Radar
              name="評価"
              dataKey="A"
              stroke="#ec4899"
              fill="#fce7f3"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        {chartData.map((item) => (
          <div key={item.subject} className="flex items-center justify-between">
            <span className="text-gray-600">{item.subject}</span>
            <span className="font-semibold text-pink-600">
              {item.A.toFixed(1)}/5
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        ※ 過去のお客様からの評価を基に算出しています
      </p>
    </div>
  );
}
