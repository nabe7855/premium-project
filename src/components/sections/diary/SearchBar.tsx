'use client';
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = '検索...',
  className = '',
  onKeyPress,
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400 sm:left-3"
        size={16}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className="w-full rounded-lg border border-pink-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 sm:py-3 sm:pl-10 sm:pr-4 sm:text-base"
      />
    </div>
  );
};

export default SearchBar;
