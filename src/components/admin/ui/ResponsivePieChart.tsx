import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { TimeSeriesData } from '@/types/dashboard';

interface ResponsivePieChartProps {
  data: TimeSeriesData[];
}

// Define a color palette consistent with the app's theme
const COLORS = ['#3E7BFA', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const RADIAN = Math.PI / 180;
// Custom label component to render percentages on the pie slices
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Avoid rendering label if the slice is too small
  if (percent < 0.05) {
    return null;
  }

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// A responsive pie chart component using Recharts
export default function ResponsivePieChart({ data }: ResponsivePieChartProps) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={110} // Increased size for better visibility
            innerRadius={40}  // Create a donut chart effect
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            paddingAngle={2} // Add some spacing between slices
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            contentStyle={{
              backgroundColor: '#1E1E3F',
              borderColor: '#374151',
              borderRadius: '0.5rem',
            }}
            itemStyle={{ color: '#FFFFFF' }}
            labelStyle={{ color: '#A0AEC0' }}
            formatter={(value: number, name: string) => [`${value}件`, name]}
          />
          <Legend 
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ top: '90%', left: '50%', transform: 'translateX(-50%)', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
