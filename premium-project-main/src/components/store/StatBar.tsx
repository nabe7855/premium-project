
import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, color, icon }) => {
  return (
    <div className="flex items-center">
      <div className={`w-32 flex items-center text-sm font-semibold text-${color}-300`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex-1 bg-black/30 rounded-full h-4 overflow-hidden border border-gray-700">
        <div
          className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatBar;
