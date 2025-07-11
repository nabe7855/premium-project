'use client';

import React from 'react';
import { BookOpen, Instagram } from 'lucide-react';

export type TabType = 'basic' | 'story' | 'schedule' | 'reviews' | 'videos';

interface Tab {
  id: TabType;
  label: string;
  icon: any;
  count?: number;
}

interface CastStickyActionBarProps {
  isSticky: boolean;
  tabs: Tab[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onBookingOpen: () => void;
  onDiaryClick: () => void;
  onSNSClick: () => void;
}

const CastStickyActionBar: React.FC<CastStickyActionBarProps> = ({
  isSticky,
  tabs,
  activeTab,
  onTabChange,
  onBookingOpen,
  onDiaryClick,
  onSNSClick,
}) => {
  return (
    <div
      className={`transition-all duration-300 ${
        isSticky
          ? 'fixed top-[56px] sm:top-16 left-0 right-0 z-40 shadow-md bg-white border-b border-neutral-200'
          : 'relative'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 bg-white">
        {/* アクションボタン */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={onDiaryClick}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-3 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-xs sm:text-sm"
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span>写メ日記</span>
          </button>

          <button
            onClick={onSNSClick}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-xs sm:text-sm"
          >
            <Instagram className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span>SNS</span>
          </button>

          <button
            onClick={onBookingOpen}
            className="flex-1 bg-primary text-white px-3 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 text-xs sm:text-sm shadow-md hover:shadow-lg"
          >
            予約する
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-3 py-2 sm:px-4 sm:py-2.5 font-medium transition-colors duration-200 border-b-2 whitespace-nowrap min-w-max text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'text-primary border-primary bg-primary/5'
                    : 'text-neutral-600 hover:text-neutral-800 border-transparent hover:border-neutral-200'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="ml-1 sm:ml-2 px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CastStickyActionBar;
