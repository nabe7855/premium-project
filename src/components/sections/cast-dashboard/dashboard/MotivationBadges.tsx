import React from 'react';
import { Badge } from '@/types/cast-dashboard';
import { Award, Calendar, Camera, Heart, Star, Trophy } from 'lucide-react';

interface MotivationBadgesProps {
  badges: Badge[];
}

export default function MotivationBadges({ badges }: MotivationBadgesProps) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="w-6 h-6" />;
      case 'star':
        return <Star className="w-6 h-6" />;
      case 'heart':
        return <Heart className="w-6 h-6" />;
      case 'camera':
        return <Camera className="w-6 h-6" />;
      case 'calendar':
        return <Calendar className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        称号・バッジ
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
              badge.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className={`flex flex-col items-center text-center ${
              badge.unlocked ? 'text-yellow-600' : 'text-gray-400'
            }`}>
              {getIconComponent(badge.icon)}
              <div className="mt-2 text-sm font-semibold">
                {badge.name}
              </div>
              <div className="text-xs mt-1">
                {badge.description}
              </div>
              {badge.unlocked && badge.unlockedAt && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(badge.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {badge.unlocked && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          獲得可能なバッジ
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• 連続投稿でストリークバッジ</div>
          <div>• 高評価で品質バッジ</div>
          <div>• 投稿数でマスターバッジ</div>
        </div>
      </div>
    </div>
  );
}