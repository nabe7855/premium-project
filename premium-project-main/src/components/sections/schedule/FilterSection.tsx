import React from 'react';
import { Heart, Eye, CheckCircle, Filter } from 'lucide-react';
import { FilterOptions } from '@/types/schedule';

interface FilterSectionProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFilterChange }) => {
  const toggleFilter = (key: keyof FilterOptions) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">フィルター</h3>
        <Filter className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center space-x-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.favoritesOnly}
              onChange={() => toggleFilter('favoritesOnly')}
              className="sr-only"
            />
            <div
              className={`h-5 w-5 rounded-md border-2 transition-colors ${
                filters.favoritesOnly
                  ? 'border-pink-500 bg-pink-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {filters.favoritesOnly && <CheckCircle className="h-5 w-5 text-white" />}
            </div>
          </div>
          <Heart className="h-4 w-4 text-pink-500" />
          <span className="text-sm text-gray-700">お気に入りキャストのみ</span>
        </label>

        <label className="flex cursor-pointer items-center space-x-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.recentlyViewedFirst}
              onChange={() => toggleFilter('recentlyViewedFirst')}
              className="sr-only"
            />
            <div
              className={`h-5 w-5 rounded-md border-2 transition-colors ${
                filters.recentlyViewedFirst
                  ? 'border-pink-500 bg-pink-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {filters.recentlyViewedFirst && <CheckCircle className="h-5 w-5 text-white" />}
            </div>
          </div>
          <Eye className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-700">最近見たキャスト優先</span>
        </label>

        <label className="flex cursor-pointer items-center space-x-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={() => toggleFilter('availableOnly')}
              className="sr-only"
            />
            <div
              className={`h-5 w-5 rounded-md border-2 transition-colors ${
                filters.availableOnly
                  ? 'border-pink-500 bg-pink-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {filters.availableOnly && <CheckCircle className="h-5 w-5 text-white" />}
            </div>
          </div>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-700">予約可能のみ</span>
        </label>
      </div>
    </div>
  );
};

export default FilterSection;
