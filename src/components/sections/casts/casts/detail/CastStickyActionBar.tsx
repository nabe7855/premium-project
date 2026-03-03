'use client';

import { BookOpen, Instagram } from 'lucide-react';
import React from 'react';

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
          ? 'fixed left-0 right-0 top-[102px] z-40 border-b border-neutral-200 bg-white shadow-md md:top-[119px]'
          : 'relative'
      }`}
    >
      <div className="mx-auto max-w-7xl bg-white px-4 py-3">
        {/* アクションボタン */}
        <div className="mb-3 flex gap-2">
          <button
            onClick={onDiaryClick}
            className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-2.5 text-xs font-medium text-white shadow-md transition-all duration-200 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg sm:text-sm"
          >
            <BookOpen className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            <span>写メ日記</span>
          </button>

          <button
            onClick={onSNSClick}
            className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-2.5 text-xs font-medium text-white shadow-md transition-all duration-200 hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg sm:text-sm"
          >
            <Instagram className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            <span>SNS</span>
          </button>

          <button
            onClick={onBookingOpen}
            className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-xs font-medium text-white shadow-md transition-colors duration-200 hover:bg-primary/90 hover:shadow-lg sm:text-sm"
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
                className={`flex min-w-max items-center whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition-colors duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${
                  activeTab === tab.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-transparent text-neutral-600 hover:border-neutral-200 hover:text-neutral-800'
                }`}
              >
                <Icon className="mr-1 h-3 w-3 flex-shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="ml-1 rounded-full bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600 sm:ml-2">
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
