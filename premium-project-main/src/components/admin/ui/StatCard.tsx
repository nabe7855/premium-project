
import React from 'react';
import Card from './Card';
import { ArrowUpIcon, ArrowDownIcon } from '../admin-assets/Icons';

interface StatCardProps {
  title: string;
  value: string;
  change?: number; // e.g., 5 for +5%, -10 for -10%
  changeType?: 'percentage' | 'point';
  description: string;
}

// Card for displaying a key statistic, often with a performance indicator
export default function StatCard({ title, value, change, changeType = 'percentage', description }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <Card title={title}>
      <div className="flex flex-col">
        <p className="text-3xl md:text-4xl font-bold text-white mb-2">{value}</p>
        <div className="flex items-center text-sm">
          {change !== undefined && (
            <div className={`flex items-center mr-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              <span className="font-semibold ml-1">
                {Math.abs(change)}
                {changeType === 'percentage' && '%'}
              </span>
            </div>
          )}
          <p className="text-brand-text-secondary">{description}</p>
        </div>
      </div>
    </Card>
  );
}