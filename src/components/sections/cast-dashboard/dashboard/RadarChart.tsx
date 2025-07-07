import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { CastPerformance } from '@/types/cast-dashboard';

interface RadarChartProps {
  data: CastPerformance;
}

export default function RadarChartComponent({ data }: RadarChartProps) {
  const chartData = [
    { subject: 'イケメン度', A: data.イケメン度, fullMark: 5 },
    { subject: 'ユーモア力', A: data.ユーモア力, fullMark: 5 },
    { subject: '傾聴力', A: data.傾聴力, fullMark: 5 },
    { subject: 'テクニック', A: data.テクニック, fullMark: 5 },
    { subject: '癒し度', A: data.癒し度, fullMark: 5 },
    { subject: '余韻力', A: data.余韻力, fullMark: 5 },
  ];

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
            <span className="font-semibold text-pink-600">{item.A.toFixed(1)}/5</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        ※ 過去のお客様からの評価を基に算出しています
      </p>
    </div>
  );
}
