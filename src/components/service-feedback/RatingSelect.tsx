'use client';

import { RatingValue } from '@/types/service-feedback';
import React from 'react';

interface RatingSelectProps {
  label: string;
  value: RatingValue;
  onChange: (value: RatingValue) => void;
}

const RatingSelect: React.FC<RatingSelectProps> = ({ label, value, onChange }) => {
  const options = [
    { label: '不満', value: 1 },
    { label: 'やや不満', value: 2 },
    { label: '普通', value: 3 },
    { label: '満足', value: 4 },
    { label: 'とても満足', value: 5 },
  ];

  return (
    <div className="mb-6">
      <p className="mb-3 text-sm font-semibold text-slate-700">{label}</p>
      <div className="mb-2 grid grid-cols-5 gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value as RatingValue)}
            className={`rounded-lg border px-1 py-3 text-[10px] transition-all ${
              value === opt.value
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => onChange('no_answer')}
        className={`w-full rounded-lg border py-2 text-xs transition-all ${
          value === 'no_answer'
            ? 'border-slate-300 bg-slate-200 text-slate-700'
            : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100'
        }`}
      >
        答えたくない
      </button>
    </div>
  );
};

export default RatingSelect;
