import React from 'react';
import { Calendar, TrendingUp, Heart } from 'lucide-react';

interface SortSelectorProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  currentTheme: any;
}

const sortOptions = [
  {
    value: 'newest',
    label: '新着順',
    icon: Calendar,
    description: '最新の動画から表示'
  },
  {
    value: 'popular',
    label: '人気順',
    icon: TrendingUp,
    description: '視聴回数の多い順'
  },
  {
    value: 'favorites',
    label: 'お気に入り順',
    icon: Heart,
    description: 'お気に入りの動画を優先表示'
  }
];

export const SortSelector: React.FC<SortSelectorProps> = ({
  currentSort,
  onSortChange,
  currentTheme
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      {/* Mobile: Dropdown style */}
      <div className="block sm:hidden">
        <label className={`block text-sm font-medium mb-2 ${currentTheme.text}`}>
          並び順
        </label>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className={`
            w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 outline-none
            ${currentTheme.cardBg} ${currentTheme.text}
          `}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: Button style */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${currentTheme.text}`}>
            並び順
          </h3>
          <div className="flex items-center gap-2">
            {sortOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = currentSort === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                    ${isSelected 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : `${currentTheme.cardBg} hover:shadow-md ${currentTheme.text}`
                    }
                  `}
                  title={option.description}
                >
                  <IconComponent size={18} />
                  <span className="font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};