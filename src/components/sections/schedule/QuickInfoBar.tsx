import React from 'react';
import { Users, Star, Clock } from 'lucide-react';
import { QuickInfo } from '@/types/schedule';

interface QuickInfoBarProps {
  quickInfo: QuickInfo;
}

const QuickInfoBar: React.FC<QuickInfoBarProps> = ({ quickInfo }) => {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-100 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">本日空きあり</p>
              <p className="text-xs text-gray-600">{quickInfo.todayAvailable}名</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">明日おすすめ</p>
              <p className="text-xs text-gray-600">{quickInfo.tomorrowRecommended}名</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">今すぐ会える</p>
              <p className="text-xs text-gray-600">{quickInfo.availableNow}名</p>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:block">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">🍓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickInfoBar;