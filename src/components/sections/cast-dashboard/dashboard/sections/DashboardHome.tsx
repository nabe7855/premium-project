'use client';

import React from 'react';
import RadarChartComponent from '../RadarChart';
import SweetLevelGauge from '../SweetLevelGauge';
import RankSystem from '../RankSystem';
import MotivationBadges from '../MotivationBadges';
import { CastPerformance, CastLevel, Badge } from '@/types/cast-dashboard';

interface DashboardHomeProps {
  performanceData: CastPerformance;
  levelData: CastLevel;
  badgesData: Badge[];
  castName: string;
}

export default function DashboardHome({
  performanceData,
  levelData,
  badgesData,
  castName,
}: DashboardHomeProps) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
        おかえりなさい、{castName} さん ✨
      </h2>
      <p className="text-sm text-gray-600 sm:text-base">
        今日も素敵な一日にしましょう！成長の記録を確認してみてください。
      </p>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3 mt-6">
        <RadarChartComponent data={performanceData} />
        <SweetLevelGauge level={levelData} />
        <RankSystem currentLevel={levelData} />
        <MotivationBadges badges={badgesData} />
      </div>
    </div>
  );
}
