import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Menu, X, Calendar, Camera, BarChart3, Plus } from 'lucide-react';
import RadarChartComponent from './dashboard/RadarChart';
import SweetLevelGauge from './dashboard/SweetLevelGauge';
import RankSystem from './dashboard/RankSystem';
import MotivationBadges from './dashboard/MotivationBadges';
import CalendarEditor from './schedule/CalendarEditor';
import DiaryEditor from './diary/DiaryEditor';
import DiaryList from './diary/DiaryList';
import { CastPerformance, CastLevel, Badge, CastSchedule, CastDiary } from '@/types/cast-dashboard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'diary'>('dashboard');
  const [showDiaryEditor, setShowDiaryEditor] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // State for schedules and diaries
  const [schedules, setSchedules] = useState<CastSchedule[]>([]);
  const [diaries, setDiaries] = useState<CastDiary[]>([]);

  // Sample data - in a real app, this would come from an API
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
    {
      id: '1',
      name: 'Sweet Royal',
      description: '最高ランク達成',
      icon: 'trophy',
      unlocked: false,
    },
    {
      id: '2',
      name: '日記マスター',
      description: '30日連続投稿',
      icon: 'camera',
      unlocked: true,
      unlockedAt: '2024-01-15',
    },
    {
      id: '3',
      name: '人気者',
      description: '高評価100件',
      icon: 'heart',
      unlocked: true,
      unlockedAt: '2024-02-01',
    },
    {
      id: '4',
      name: '皆勤賞',
      description: 'スケジュール完璧',
      icon: 'calendar',
      unlocked: false,
    },
    {
      id: '5',
      name: 'スター',
      description: '月間MVP',
      icon: 'star',
      unlocked: true,
      unlockedAt: '2024-01-01',
    },
    {
      id: '6',
      name: '成長王',
      description: 'レベル大幅UP',
      icon: 'award',
      unlocked: false,
    },
  ];

  const handleScheduleUpdate = (updatedSchedules: CastSchedule[]) => {
    setSchedules(updatedSchedules);
  };

  const handleDiarySave = (diaryData: Omit<CastDiary, 'id' | 'createdAt'>) => {
    const newDiary: CastDiary = {
      ...diaryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDiaries([newDiary, ...diaries]);
    setShowDiaryEditor(false);
  };

  const handleDiaryEdit = () => {
    // For now, just show the editor - in a real app, you'd populate the form with existing data
    setShowDiaryEditor(true);
  };

  const handleDiaryDelete = (id: string) => {
    if (confirm('この日記を削除しますか？')) {
      setDiaries(diaries.filter((diary) => diary.id !== id));
    }
  };

  const handleQuickAction = (action: 'diary' | 'schedule' | 'stats') => {
    setShowQuickActions(false);

    switch (action) {
      case 'diary':
        setActiveTab('diary');
        setShowDiaryEditor(true);
        break;
      case 'schedule':
        setActiveTab('schedule');
        break;
      case 'stats':
        setActiveTab('dashboard');
        break;
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
              {/* Quick Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="flex items-center space-x-1 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-2 text-sm text-white shadow-md transition-all hover:from-pink-600 hover:to-rose-600 sm:space-x-2 sm:px-4"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">クイックアクション</span>
                </button>

                {showQuickActions && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-pink-100 bg-white shadow-lg sm:w-64">
                    <div className="p-2">
                      <button
                        onClick={() => handleQuickAction('diary')}
                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-pink-50 sm:px-4"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-rose-500">
                          <Camera className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">写メ日記投稿</div>
                          <div className="text-xs text-gray-500">新しい日記を書く</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleQuickAction('schedule')}
                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-purple-50 sm:px-4"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">スケジュール更新</div>
                          <div className="text-xs text-gray-500">出勤予定を登録</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleQuickAction('stats')}
                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-yellow-50 sm:px-4"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                          <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">実績確認</div>
                          <div className="text-xs text-gray-500">成長データを見る</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <span className="hidden text-xs text-gray-600 sm:inline sm:text-sm">
                Welcome, {user?.username}
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

        {/* Click outside to close quick actions */}
        {showQuickActions && (
          <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)} />
        )}
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
          <>
            {/* Welcome Section */}
            <div className="mb-6 sm:mb-8">
              <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                おかえりなさい、{user?.username}さん ✨
              </h2>
              <p className="text-sm text-gray-600 sm:text-base">
                今日も素敵な一日にしましょう！成長の記録を確認してみてください。
              </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Radar Chart */}
              <div className="lg:col-span-1">
                <RadarChartComponent data={performanceData} />
              </div>

              {/* Sweet Level Gauge */}
              <div className="lg:col-span-1">
                <SweetLevelGauge level={levelData} />
              </div>

              {/* Rank System */}
              <div className="lg:col-span-2 xl:col-span-1">
                <RankSystem currentLevel={levelData} />
              </div>

              {/* Motivation Badges */}
              <div className="lg:col-span-2 xl:col-span-3">
                <MotivationBadges badges={badgesData} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'schedule' && (
          <div>
            <div className="mb-4 sm:mb-6">
              <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">スケジュール管理</h2>
              <p className="text-sm text-gray-600 sm:text-base">
                出勤予定を管理して、お客様にスケジュールをお知らせしましょう。
              </p>
            </div>
            <CalendarEditor
              schedules={schedules}
              onScheduleUpdate={handleScheduleUpdate}
              diaries={diaries}
            />
          </div>
        )}

        {activeTab === 'diary' && (
          <div>
            <div className="mb-4 flex flex-col space-y-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">写メ日記</h2>
                <p className="text-sm text-gray-600 sm:text-base">
                  日々の出来事や気持ちを写真と一緒に投稿しましょう。
                </p>
              </div>
              {!showDiaryEditor && (
                <button
                  onClick={() => setShowDiaryEditor(true)}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-sm font-medium text-white transition-all hover:from-pink-600 hover:to-rose-600 sm:px-6 sm:text-base"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  新しい日記を書く
                </button>
              )}
            </div>

            {showDiaryEditor ? (
              <DiaryEditor onSave={handleDiarySave} onCancel={() => setShowDiaryEditor(false)} />
            ) : (
              <DiaryList diaries={diaries} onEdit={handleDiaryEdit} onDelete={handleDiaryDelete} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
