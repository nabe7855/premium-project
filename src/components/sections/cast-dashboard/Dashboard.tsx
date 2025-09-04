import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Menu, X, Calendar, Camera, BarChart3 } from 'lucide-react';
import RadarChartComponent from './dashboard/RadarChart';
import SweetLevelGauge from './dashboard/SweetLevelGauge';
import RankSystem from './dashboard/RankSystem';
import MotivationBadges from './dashboard/MotivationBadges';
import CalendarEditor from './schedule/CalendarEditor';
import DiaryEditor from './diary/DiaryEditor';
import DiaryList from './diary/DiaryList';
import { CastPerformance, CastLevel, Badge, CastSchedule, CastDiary } from '@/types/cast-dashboard';

// ✅ CastProfile 型
interface CastProfile {
  id: string;
  name: string;
  is_active: boolean;
}

interface DashboardProps {
  cast: CastProfile;
}

export default function Dashboard({ cast }: DashboardProps) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'diary'>('dashboard');
  const [showDiaryEditor, setShowDiaryEditor] = useState(false);
  const [] = useState(false);

  // State for schedules and diaries
  const [schedules, setSchedules] = useState<CastSchedule[]>([]);
  const [diaries, setDiaries] = useState<CastDiary[]>([]);

  // Sample data
  const performanceData: CastPerformance = {
    イケメン度: 4.5,
    ユーモア力: 4.0,
    傾聴力: 4.9,
    テクニック: 4.2,
    癒し度: 4.9,
    余韻力: 4.6,
  };

  const levelData: CastLevel = {
    level: 12,
    maxLevel: 15,
    rankName: 'Sweet Rich',
    description: '濃密でクセになる余韻',
    experience: 850,
    maxExperience: 1000,
  };

  const badgesData: Badge[] = [
    { id: '1', name: 'Sweet Royal', description: '最高ランク達成', icon: 'trophy', unlocked: false },
    { id: '2', name: '日記マスター', description: '30日連続投稿', icon: 'camera', unlocked: true, unlockedAt: '2024-01-15' },
    { id: '3', name: '人気者', description: '高評価100件', icon: 'heart', unlocked: true, unlockedAt: '2024-02-01' },
  ];

  const handleScheduleUpdate = (updatedSchedules: CastSchedule[]) => setSchedules(updatedSchedules);

  const handleDiarySave = (diaryData: Omit<CastDiary, 'id' | 'createdAt'>) => {
    const newDiary: CastDiary = {
      ...diaryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDiaries([newDiary, ...diaries]);
    setShowDiaryEditor(false);
  };

  const handleDiaryDelete = (id: string) => {
    if (confirm('この日記を削除しますか？')) {
      setDiaries(diaries.filter((diary) => diary.id !== id));
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'ダッシュボード', icon: BarChart3 },
    { id: 'schedule', name: 'スケジュール', icon: Calendar },
    { id: 'diary', name: '写メ日記', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-pink-100 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between sm:h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-md p-2 text-gray-600 hover:bg-pink-50 hover:text-pink-600 md:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="ml-2 text-lg font-bold text-gray-900 sm:text-xl">
                キャストダッシュボード
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden text-xs text-gray-600 sm:inline sm:text-sm">
                ようこそ、{cast.name} さん
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-pink-600 sm:space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden text-sm sm:inline">ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="sticky top-14 z-20 border-b border-pink-100 bg-white sm:top-16">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto sm:space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 whitespace-nowrap border-b-2 px-1 py-3 text-xs font-medium transition-colors sm:space-x-2 sm:py-4 sm:text-sm ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
              おかえりなさい、{cast.name} さん ✨
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
        )}

        {activeTab === 'schedule' && (
          <CalendarEditor schedules={schedules} onScheduleUpdate={handleScheduleUpdate} diaries={diaries} />
        )}

        {activeTab === 'diary' && (
          <div>
            {!showDiaryEditor ? (
              <DiaryList diaries={diaries} onEdit={() => setShowDiaryEditor(true)} onDelete={handleDiaryDelete} />
            ) : (
              <DiaryEditor onSave={handleDiarySave} onCancel={() => setShowDiaryEditor(false)} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
