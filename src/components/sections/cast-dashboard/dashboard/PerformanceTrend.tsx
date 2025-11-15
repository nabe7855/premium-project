import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceTrendProps {
  data: Array<{
    month: string;
    level: number;
    reviews: number;
  }>;
}

export default function PerformanceTrend({ data }: PerformanceTrendProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        成長トレンド
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="level" 
              stroke="#ec4899" 
              strokeWidth={3}
              dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#ec4899' }}
              name="Sweet Level"
            />
            <Line 
              type="monotone" 
              dataKey="reviews" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#f59e0b' }}
              name="口コミ数"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">
            {data[data.length - 1]?.level || 0}
          </div>
          <div className="text-sm text-gray-600">
            Current Level
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {data.reduce((sum, item) => sum + item.reviews, 0)}
          </div>
          <div className="text-sm text-gray-600">
            Total Reviews
          </div>
        </div>
      </div>
    </div>
  );
}