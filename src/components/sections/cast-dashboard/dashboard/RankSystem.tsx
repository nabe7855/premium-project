import React from 'react';
import { Crown, Star, Award, Trophy, Gem, Zap } from 'lucide-react';
import { CastLevel } from '@/types/cast-dashboard';

interface RankSystemProps {
  currentLevel: CastLevel;
}

export default function RankSystem({ currentLevel }: RankSystemProps) {
  const ranks = [
    {
      id: 1,
      name: 'Sweet Rookie',
      description: '新人セラピスト',
      minLevel: 1,
      maxLevel: 3,
      icon: Star,
      color: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-600',
    },
    {
      id: 2,
      name: 'Sweet Fresh',
      description: 'フレッシュな魅力',
      minLevel: 4,
      maxLevel: 6,
      icon: Zap,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
    },
    {
      id: 3,
      name: 'Sweet Charm',
      description: '魅力的なセラピスト',
      minLevel: 7,
      maxLevel: 9,
      icon: Award,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
    },
    {
      id: 4,
      name: 'Sweet Rich',
      description: '濃密でクセになる余韻',
      minLevel: 10,
      maxLevel: 12,
      icon: Gem,
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
    },
    {
      id: 5,
      name: 'Sweet Luxe',
      description: '上質な癒しの極み',
      minLevel: 13,
      maxLevel: 15,
      icon: Trophy,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-600',
    },
    {
      id: 6,
      name: 'Sweet Royal',
      description: '伝説のセラピスト',
      minLevel: 16,
      maxLevel: 20,
      icon: Crown,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      textColor: 'text-pink-600',
    },
  ];

  const getCurrentRank = () => {
    return (
      ranks.find(
        (rank) => currentLevel.level >= rank.minLevel && currentLevel.level <= rank.maxLevel,
      ) || ranks[0]
    );
  };

  const currentRank = getCurrentRank();

  const isCurrentRank = (rank: (typeof ranks)[0]) => {
    return rank.id === currentRank.id;
  };

  const isUnlocked = (rank: (typeof ranks)[0]) => {
    return currentLevel.level >= rank.minLevel;
  };

  const getProgressInRank = (rank: (typeof ranks)[0]) => {
    if (!isCurrentRank(rank)) return 0;

    const levelInRank = currentLevel.level - rank.minLevel;
    const totalLevelsInRank = rank.maxLevel - rank.minLevel;
    return (levelInRank / totalLevelsInRank) * 100;
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-lg sm:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h3 className="text-base font-semibold text-gray-800 sm:text-lg">ランクシステム</h3>
        <div className="text-xs text-gray-500 sm:text-sm">現在: Level {currentLevel.level}</div>
      </div>

      {/* Current Rank Highlight */}
      <div
        className={`${currentRank.bgColor} ${currentRank.borderColor} mb-6 rounded-xl border-2 p-4`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`h-10 w-10 bg-gradient-to-r sm:h-12 sm:w-12 ${currentRank.color} flex items-center justify-center rounded-full`}
            >
              <currentRank.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <div>
              <h4 className={`text-sm font-bold sm:text-base ${currentRank.textColor}`}>
                {currentRank.name}
              </h4>
              <p className="text-xs text-gray-600 sm:text-sm">{currentRank.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold sm:text-xl ${currentRank.textColor}`}>
              Lv.{currentLevel.level}
            </div>
            <div className="text-xs text-gray-500">
              {currentRank.minLevel}-{currentRank.maxLevel}
            </div>
          </div>
        </div>

        {/* Progress in current rank */}
        <div className="mb-2">
          <div className="mb-1 flex justify-between text-xs text-gray-600">
            <span>ランク内進行度</span>
            <span>
              {currentLevel.level - currentRank.minLevel + 1}/
              {currentRank.maxLevel - currentRank.minLevel + 1}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-white bg-opacity-50">
            <div
              className={`bg-gradient-to-r ${currentRank.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${getProgressInRank(currentRank)}%` }}
            />
          </div>
        </div>
      </div>

      {/* All Ranks Display */}
      <div className="space-y-3">
        <h4 className="mb-3 text-sm font-semibold text-gray-800 sm:text-base">全ランク一覧</h4>

        {ranks.map((rank, index) => {
          const Icon = rank.icon;
          const isCurrent = isCurrentRank(rank);
          const unlocked = isUnlocked(rank);

          return (
            <div
              key={rank.id}
              className={`relative flex items-center rounded-xl border-2 p-3 transition-all sm:p-4 ${
                isCurrent
                  ? `${rank.bgColor} ${rank.borderColor} shadow-md`
                  : unlocked
                    ? 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              {/* Rank Icon */}
              <div
                className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full sm:mr-4 sm:h-10 sm:w-10 ${
                  unlocked ? `bg-gradient-to-r ${rank.color}` : 'bg-gray-300'
                }`}
              >
                <Icon
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${unlocked ? 'text-white' : 'text-gray-500'}`}
                />
              </div>

              {/* Rank Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h5
                      className={`text-sm font-semibold sm:text-base ${
                        isCurrent ? rank.textColor : unlocked ? 'text-gray-800' : 'text-gray-500'
                      }`}
                    >
                      {rank.name}
                    </h5>
                    <p className="truncate text-xs text-gray-600 sm:text-sm">{rank.description}</p>
                  </div>
                  <div className="ml-2 text-right">
                    <div
                      className={`text-xs font-medium sm:text-sm ${
                        isCurrent ? rank.textColor : unlocked ? 'text-gray-700' : 'text-gray-500'
                      }`}
                    >
                      Lv.{rank.minLevel}-{rank.maxLevel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Indicator */}
              {isCurrent && (
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500">
                  <div className="h-3 w-3 rounded-full bg-white"></div>
                </div>
              )}

              {/* Connection Line */}
              {index < ranks.length - 1 && (
                <div
                  className={`absolute left-6 top-full h-3 w-0.5 sm:left-8 ${
                    unlocked ? 'bg-gray-300' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Next Rank Preview */}
      {currentRank.id < ranks.length && (
        <div className="mt-6 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-800 sm:text-base">次のランクまで</h4>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              あと{ranks[currentRank.id].minLevel - currentLevel.level}レベル
            </div>
            <div className="text-sm font-medium text-pink-600">{ranks[currentRank.id].name}</div>
          </div>
        </div>
      )}
    </div>
  );
}
