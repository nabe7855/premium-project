import React from 'react';
import { CastLevel } from '@/types/cast-dashboard';
import { Crown, Star, TrendingUp } from 'lucide-react';

interface SweetLevelGaugeProps {
  level: CastLevel;
}

export default function SweetLevelGauge({ level }: SweetLevelGaugeProps) {
  const progressPercentage = (level.experience / level.maxExperience) * 100;
  const levelPercentage = (level.level / level.maxLevel) * 100;

  const getRankIcon = (rankName: string) => {
    if (rankName.includes('Royal') || rankName.includes('Luxe')) {
      return <Crown className="h-5 w-5 text-yellow-500" />;
    } else if (rankName.includes('Premium') || rankName.includes('Rich')) {
      return <Star className="h-5 w-5 text-purple-500" />;
    }
    return <TrendingUp className="h-5 w-5 text-pink-500" />;
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">SWEET LEVEL</h3>
        {getRankIcon(level.rankName)}
      </div>

      <div className="mb-6 text-center">
        <div className="mb-2 text-3xl font-bold text-pink-600">
          {level.level} / {level.maxLevel}
        </div>
        <div className="mb-2 text-sm text-gray-600">{level.rankName}</div>
        <div className="text-xs text-gray-500">{level.description}</div>
      </div>

      {/* Level Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>Level Progress</span>
          <span>
            {level.level}/{level.maxLevel}
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
            style={{ width: `${levelPercentage}%` }}
          />
        </div>
      </div>

      {/* Experience Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>Next Level</span>
          <span>
            {level.experience}/{level.maxExperience} EXP
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Level Benefits */}
      <div className="mt-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 p-4">
        <h4 className="mb-2 font-semibold text-gray-800">Level Benefits</h4>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• 特別な称号とバッジ</li>
          <li>• 専用フレームとエフェクト</li>
          <li>• より多くの投稿機能</li>
        </ul>
      </div>
    </div>
  );
}
