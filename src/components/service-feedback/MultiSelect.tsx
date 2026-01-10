'use client';

import React from 'react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selectedValues, onChange }) => {
  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="mb-6">
      <p className="mb-3 text-sm font-semibold text-slate-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            className={`rounded-full border px-4 py-2 text-xs transition-all ${
              selectedValues.includes(option)
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
