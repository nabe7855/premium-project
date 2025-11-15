import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush
} from 'recharts';

interface ResponsiveChartProps {
  data: any[]; // Allow various data structures
  type: 'line' | 'bar';
  dataKeys: { key: string; name: string; fill: string }[];
  unit?: string;
}

// An interactive and responsive chart component using Recharts, now supporting multiple data keys
export default function ResponsiveChart({ data, type, dataKeys, unit = '' }: ResponsiveChartProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  
  const ChartElements = dataKeys.map(dk => {
    if (type === 'line') {
      return (
        <Line 
          key={dk.key}
          type="monotone" 
          dataKey={dk.key} 
          name={dk.name}
          stroke={dk.fill} 
          strokeWidth={2}
          dot={{ r: 2, fill: dk.fill, strokeWidth: 0 }}
          activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 1, fill: dk.fill }} 
        />
      );
    } else { // bar chart
      return (
        <Bar key={dk.key} dataKey={dk.key} name={dk.name} fill={dk.fill} />
      );
    }
  });


  const valueFormatter = (value: number, name: string) => {
    const formattedValue = new Intl.NumberFormat('ja-JP').format(value);
    const fullUnit = name.includes('率') ? '%' : unit;
    // Place '¥' at the beginning, '%' at the end
    return fullUnit === '¥' ? `${fullUnit}${formattedValue}` : `${formattedValue}${fullUnit}`;
  };

  return (
    // Height increased to accommodate the Brush component
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ChartComponent 
          data={data} 
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }} 
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#A0AEC0' }} 
            fontSize={12} 
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            tick={{ fill: '#A0AEC0' }} 
            fontSize={12}
            tickFormatter={(value) => typeof value === 'number' ? `${new Intl.NumberFormat('ja-JP', { notation: 'compact', compactDisplay: 'short' }).format(value)}` : value}
            width={unit === '¥' ? 80 : 60} // Wider margin for larger currency numbers
          />
          <Tooltip
            cursor={{ fill: 'rgba(62, 123, 250, 0.15)' }}
            contentStyle={{
              backgroundColor: '#1E1E3F',
              borderColor: '#374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#A0AEC0', marginBottom: '4px' }}
            itemStyle={{ fontWeight: '600' }}
            formatter={valueFormatter}
          />
          <Legend verticalAlign="top" height={36} />
          {ChartElements}
          <Brush 
            dataKey="name" 
            height={30} 
            stroke="#3E7BFA" 
            fill="#1E1E3F"
            y={260} // Position brush at the bottom
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}