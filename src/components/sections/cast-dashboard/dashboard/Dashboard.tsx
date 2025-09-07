'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Menu, X, Calendar, Camera, BarChart3, User, Image } from 'lucide-react';

// 各セクションコンポーネント
import DashboardHome from './sections/DashboardHome';
import ScheduleSection from './sections/ScheduleSection';
import DiarySection from './sections/DiarySection';
import ProfileSection from './sections/ProfileSection';
import GallerySection from './sections/GallerySection';

// 型
import { CastPerformance, CastLevel, Badge, CastSchedule, CastDiary } from '@/types/cast-dashboard';
import { CastProfile, FeatureMaster, QuestionMaster } from '@/types/cast';

// API
import { getFeatureMasters } from '@/lib/getFeatureMasters';
import { getCastProfile } from '@/lib/getCastProfile';
import { getCastQuestions } from '@/lib/getCastQuestions';
import { supabase } from '@/lib/supabaseClient';

interface DashboardProps {
  cast: CastProfile;
}

export default function Dashboard({ cast }: DashboardProps) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ タブ管理
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'schedule' | 'diary' | 'profile' | 'gallery'
  >('dashboard');

  // ✅ state 管理
  const [castState, setCastState] = useState<CastProfile>(cast);
  const [schedules, setSchedules] = useState<CastSchedule[]>([]);
  const [diaries, setDiaries] = useState<CastDiary[]>([]);
  const [featureMasters, setFeatureMasters] = useState<FeatureMaster[]>([]);
  const [questionMasters, setQuestionMasters] = useState<QuestionMaster[]>([]);
  const [showDiaryEditor, setShowDiaryEditor] = useState(false);

  // ---- ダッシュボード用ダミーデータ ----
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

  // ✅ 特徴マスターのロード
  useEffect(() => {
    const loadMasters = async () => {
      try {
        const masters = await getFeatureMasters();
        setFeatureMasters(masters);
      } catch (err) {
        console.error('特徴マスター取得エラー:', err);
      }
    };
    loadMasters();
  }, []);

  // ✅ 質問マスターのロード
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('question_master')
          .select('*')
          .eq('is_active', true);
        if (error) throw error;
        setQuestionMasters(data ?? []);
      } catch (err) {
        console.error('質問マスター取得エラー:', err);
      }
    };
    loadQuestions();
  }, []);

  // ✅ 初回プロフィールロード
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const refreshed = await getCastProfile(cast.id);
        if (refreshed) {
          const answers = await getCastQuestions(cast.id);
          const questions: Record<string, string> = {};
          answers.forEach((a) => {
            if (a.question?.id) {
              questions[a.question.id] = a.answer ?? '';
            }
          });
          setCastState({ ...refreshed, questions });
        }
      } catch (err) {
        console.error('初期プロフィール取得エラー:', err);
      }
    };
    loadProfile();
  }, [cast.id]);

  // ✅ 保存後リロード
  const refreshCastProfile = async (castId: string) => {
    try {
      const refreshed = await getCastProfile(castId);
      if (refreshed) {
        const answers = await getCastQuestions(castId);
        const questions: Record<string, string> = {};
        answers.forEach((a) => {
          if (a.question?.id) {
            questions[a.question.id] = a.answer ?? '';
          }
        });
        setCastState({ ...refreshed, questions });
      }
    } catch (err) {
      console.error('キャスト再取得エラー:', err);
    }
  };

  // ---- 写メ日記関係 ----
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

  // ---- ナビゲーションタブ ----
  const tabs = [
    { id: 'dashboard', name: 'ダッシュボード', icon: BarChart3 },
    { id: 'schedule', name: 'スケジュール', icon: Calendar },
    { id: 'diary', name: '写メ日記', icon: Camera },
    { id: 'profile', name: 'マイプロフィール', icon: User },
    { id: 'gallery', name: 'ギャラリー', icon: Image },
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
              <h1 className="ml-2 text-lg font-bold text-gray-900 sm:text-xl">キャストダッシュボード</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden text-xs text-gray-600 sm:inline sm:text-sm">
                ようこそ、{castState.name} さん
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
          <DashboardHome
            castName={castState.name}
            performanceData={performanceData}
            levelData={levelData}
            badgesData={badgesData}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleSection
            schedules={schedules}
            diaries={diaries}
            onScheduleUpdate={handleScheduleUpdate}
          />
        )}

        {activeTab === 'diary' && (
          <DiarySection
            diaries={diaries}
            showEditor={showDiaryEditor}
            onSave={handleDiarySave}
            onDelete={handleDiaryDelete}
            onToggleEditor={setShowDiaryEditor}
          />
        )}

        {activeTab === 'profile' && featureMasters.length > 0 && questionMasters.length > 0 && (
          <ProfileSection
            cast={castState}
            featureMasters={featureMasters}
            questionMasters={questionMasters}
            refreshCastProfile={refreshCastProfile}
          />
        )}

        {activeTab === 'gallery' && <GallerySection castId={castState.id} />}
      </main>
    </div>
  );
}
