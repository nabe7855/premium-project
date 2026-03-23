'use client'

import React from 'react'
import { ArrowUpDown, Star, Clock, TrendingUp, MessageSquare, BookOpen } from 'lucide-react'

// ✅ 型を統一
export type SortOption = 'default' | 'reviewCount' | 'newcomerOnly' | 'todayAvailable' | 'tweetOrder' | 'diaryOrder'

interface SortOptionsProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortBy, onSortChange }) => {
  // ✅ value の型を SortOption にする
  const sortOptions: { value: SortOption; label: string; icon: React.FC<any> }[] = [
    { value: 'default', label: 'おすすめ順', icon: Star },
    { value: 'tweetOrder', label: 'つぶやき順', icon: MessageSquare },
    { value: 'diaryOrder', label: '日記最新順', icon: BookOpen },
    { value: 'reviewCount', label: '口コミ数順', icon: TrendingUp },
    { value: 'newcomerOnly', label: '新人のみ', icon: Clock },
    { value: 'todayAvailable', label: '本日出勤', icon: Clock },
  ]

  return (
    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
      <div className="flex items-center text-sm text-neutral-600 whitespace-nowrap">
        <ArrowUpDown className="w-4 h-4 mr-2" />
        <span>並び替え:</span>
      </div>
      
      <div className="flex gap-2">
        {sortOptions.map(option => {
          const Icon = option.icon
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                sortBy === option.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SortOptions
