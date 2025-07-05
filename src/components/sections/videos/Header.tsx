import React from 'react';
import { Search, Heart, History, Settings, Menu } from 'lucide-react';

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
  favoriteCount
}) => {
  return (
    <header className={`sticky top-0 z-40 backdrop-blur-sm border-b ${
      isNightMode ? 'border-white/10' : 'border-gray-200'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
              SB
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl sm:text-2xl font-bold ${currentTheme.text}`}>
                Strawberry Boys
              </h1>
              <p className={`text-xs sm:text-sm ${currentTheme.text} opacity-70`}>
                {isNightMode ? 'おやすみモード' : '素敵な時間をお過ごしください'}
              </p>
            </div>
          </div>
          
          {/* Search */}
          <div className="flex-1 max-w-sm sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="動画を検索..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 outline-none text-sm sm:text-base
                  ${currentTheme.cardBg} ${currentTheme.text}
                `}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Mobile: Show only favorites with count */}
            <div className="flex sm:hidden">
              <button className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${currentTheme.text} relative`}>
                <Heart size={20} />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </button>
              <button className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${currentTheme.text}`}>
                <Menu size={20} />
              </button>
            </div>
            
            {/* Desktop: Show all actions */}
            <div className="hidden sm:flex items-center gap-3">
              <button className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${currentTheme.text} relative`}>
                <Heart size={24} />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </button>
              <button className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${currentTheme.text}`}>
                <History size={24} />
              </button>
              <button className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${currentTheme.text}`}>
                <Settings size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};