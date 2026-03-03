import { Heart, History, Menu, Search, Settings } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  currentTheme: any;
  isNightMode: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  isNightMode,
  searchTerm,
  onSearchChange,
  favoriteCount,
}) => {
  return (
    <header
      className={`fixed left-0 top-0 z-40 w-full border-b backdrop-blur-sm ${
        isNightMode ? 'border-white/10' : 'border-gray-200'
      }`}
    >
      <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 text-base font-bold text-white shadow-lg sm:h-12 sm:w-12 sm:text-lg">
              SB
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold sm:text-2xl ${currentTheme.text}`}>
                Strawberry Boys
              </h1>
              <p className={`text-xs sm:text-sm ${currentTheme.text} opacity-70`}>
                {isNightMode ? 'おやすみモード' : '素敵な時間をお過ごしください'}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-sm flex-1 sm:max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="動画を検索..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full rounded-xl border-0 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-purple-500 sm:py-3 sm:text-base ${currentTheme.cardBg} ${currentTheme.text} `}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Mobile: Show only favorites with count */}
            <div className="flex sm:hidden">
              <button
                className={`rounded-xl p-2 transition-colors hover:bg-white/10 ${currentTheme.text} relative`}
              >
                <Heart size={20} />
                {favoriteCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {favoriteCount}
                  </span>
                )}
              </button>
              <button
                className={`rounded-xl p-2 transition-colors hover:bg-white/10 ${currentTheme.text}`}
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Desktop: Show all actions */}
            <div className="hidden items-center gap-3 sm:flex">
              <button
                className={`rounded-xl p-2 transition-colors hover:bg-white/10 ${currentTheme.text} relative`}
              >
                <Heart size={24} />
                {favoriteCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {favoriteCount}
                  </span>
                )}
              </button>
              <button
                className={`rounded-xl p-2 transition-colors hover:bg-white/10 ${currentTheme.text}`}
              >
                <History size={24} />
              </button>
              <button
                className={`rounded-xl p-2 transition-colors hover:bg-white/10 ${currentTheme.text}`}
              >
                <Settings size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
