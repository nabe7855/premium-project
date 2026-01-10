
import React from 'react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange }) => {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(o => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`px-4 py-2 rounded-full text-sm transition-all border ${
              selected.includes(option)
                ? 'bg-rose-50 border-rose-500 text-rose-600 font-medium'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
