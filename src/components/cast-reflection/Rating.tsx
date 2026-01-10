
import React from 'react';

interface RatingProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  max?: number;
}

export const Rating: React.FC<RatingProps> = ({ label, value, onChange, max = 5 }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="flex gap-2">
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
              value === i + 1 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105' 
                : 'bg-white border border-slate-200 text-slate-400'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
