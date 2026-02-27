'use client';

import { useAuth } from '@/hooks/useAuth';
import {
  BarChart3,
  Calendar,
  Camera,
  ClipboardList,
  Image,
  LogOut,
  Menu,
  Mic,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// 各セクションコンポーネント
import DashboardHome from './sections/DashboardHome';
import DiarySection from './sections/DiarySection';
import GallerySection from './sections/GallerySection';
import ProfileSection from './sections/ProfileSection';
import ReservationSection from './sections/ReservationSection';
import ScheduleSection from './sections/ScheduleSection';
import VoiceSection from './sections/VoiceSection';

// 型
import { CastDiary, CastProfile, FeatureMaster, QuestionMaster } from '@/types/cast';
import { Badge, CastLevel } from '@/types/cast-dashboard';

// API
import Footer from '@/components/templates/store/fukuoka/sections/Footer';
import { StoreProvider } from '@/contexts/StoreContext';
import { getCastDiaries } from '@/lib/getCastDiaries'; // ✅ 作成した関数
import { getCastPerformance } from '@/lib/getCastPerformance';
import { getCastProfile } from '@/lib/getCastProfile';
import { getFeatureMasters } from '@/lib/getFeatureMasters';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData, Store } from '@/lib/store/store-data';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { supabase } from '@/lib/supabaseClient';

interface DashboardProps {
  cast: CastProfile;
}

export default function Dashboard({ cast }: DashboardProps) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'schedule' | 'diary' | 'profile' | 'gallery' | 'voice' | 'reservation'
  >('dashboard');

  const [castState, setCastState] = useState<CastProfile>(cast);
  const [diaries, setDiaries] = useState<CastDiary[]>([]);
  const [featureMasters, setFeatureMasters] = useState<FeatureMaster[]>([]);
  const [questionMasters, setQuestionMasters] = useState<QuestionMaster[]>([]);
  const [showDiaryEditor, setShowDiaryEditor] = useState(false);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [topConfig, setTopConfig] = useState<StoreTopPageConfig | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  // ✅ 能力チャート用データ（ダミー削除 → Supabaseから取得）
  const [performanceData, setPerformanceData] = useState<Record<string, number>>({});

  // ---- レベルとバッジは暫定的にダミーのまま ----
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
  ];

  // ✅ 特徴マスターのロード
  useEffect(() => {
    getFeatureMasters()
      .then(setFeatureMasters)
      .catch((err) => console.error('特徴マスター取得エラー:', err));
  }, []);

  // ✅ 質問マスターのロード
  useEffect(() => {
    supabase
      .from('question_master')
      .select('*')
      .eq('is_active', true)
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setQuestionMasters(data ?? []);
      });
  }, []);

  // ✅ 初回プロフィールロード
  useEffect(() => {
    refreshCastProfile(cast.id);
  }, [cast.id]);

  const refreshCastProfile = async (castId: string) => {
    try {
      const refreshed = await getCastProfile(castId);
      if (refreshed) {
        setCastState(refreshed);
      }
    } catch (err) {
      console.error('キャスト再取得エラー:', err);
    }
  };

  // ✅ 所属店舗
  useEffect(() => {
    supabase
      .from('cast_store_memberships')
      .select('stores(name, slug)')
      .eq('cast_id', cast.id)
      .then(async ({ data, error }) => {
        if (!error && data) {
          const storesData = data.map((item: any) => item.stores).filter(Boolean);
          const names = storesData.map((s: any) => s.name);
          setStoreName(names.join('・'));

          if (storesData.length > 0) {
            const slug = storesData[0].slug;
            const store = getStoreData(slug);
            if (store) {
              setCurrentStore(store);
            }

            const res = await getStoreTopConfig(slug);
            if (res.success && res.config) {
              setTopConfig(res.config);
            }
          }
        }
      });
  }, [cast.id]);

  // ✅ 能力チャートを Supabase からロード
  useEffect(() => {
    if (!cast.id) return;
    getCastPerformance(cast.id)
      .then((data) => setPerformanceData(data ?? {}))
      .catch((err) => console.error('能力チャート取得エラー:', err));
  }, [cast.id]);

  // ✅ 日記リストのロード
  useEffect(() => {
    if (!cast.id) return;
    refreshDiaries();
  }, [cast.id]);

  const refreshDiaries = async () => {
    const data = await getCastDiaries(cast.id);
    setDiaries(data);
  };

  const handleDiaryDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (!error) {
      refreshDiaries();
    } else {
      alert('削除に失敗しました');
    }
  };

  // ---- ナビゲーションタブ ----
  const tabs = [
    { id: 'dashboard', name: 'ダッシュボード', icon: BarChart3 },
    { id: 'schedule', name: 'スケジュール', icon: Calendar },
    { id: 'diary', name: '写メ日記', icon: Camera },
    { id: 'profile', name: 'マイプロフィール', icon: User },
    { id: 'gallery', name: 'ギャラリー', icon: Image },
    { id: 'voice', name: '音声データ', icon: Mic },
    { id: 'reservation', name: '予約', icon: ClipboardList },
  ];

  const dashboardContent = (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/70 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-full p-2 text-gray-500 transition-all hover:bg-pink-100/50 hover:text-pink-600 md:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <div className="flex flex-col">
                <h1 className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-xl font-black tracking-tight text-transparent">
                  CAST DASHBOARD
                </h1>
                {storeName && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    {storeName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden flex-col items-end sm:flex">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Member
                </p>
                <p className="text-sm font-black text-gray-700">{castState.name} さん</p>
              </div>

              <div className="hidden h-8 w-[1px] bg-gray-200 sm:block"></div>

              <button
                onClick={logout}
                className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-30 border-b border-pink-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto py-3 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'scale-105 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-200 ring-4 ring-pink-500/10'
                      : 'text-gray-500 hover:bg-pink-50 hover:text-pink-600'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'animate-pulse' : ''}`} />
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
            castId={castState.id}
            performanceData={performanceData}
            levelData={levelData}
            badgesData={badgesData}
          />
        )}

        {activeTab === 'schedule' && <ScheduleSection diaries={diaries} />}
        {activeTab === 'diary' && (
          <DiarySection
            diaries={diaries}
            showEditor={showDiaryEditor}
            castId={cast.id}
            onSave={() => {
              refreshDiaries();
              setShowDiaryEditor(false);
            }}
            onDelete={handleDiaryDelete}
            onToggleEditor={setShowDiaryEditor}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileSection
            cast={castState}
            featureMasters={featureMasters}
            questionMasters={questionMasters}
            refreshCastProfile={refreshCastProfile}
          />
        )}
        {activeTab === 'gallery' && <GallerySection castId={castState.id} />}
        {activeTab === 'voice' && (
          <VoiceSection cast={castState} setCastState={setCastState} activeTab={activeTab} />
        )}
        {activeTab === 'reservation' && <ReservationSection />}
      </main>

      <Footer config={topConfig?.footer} />
    </div>
  );

  if (!currentStore) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-pink-500"></div>
          <p className="font-bold text-gray-600">Context Loading...</p>
        </div>
      </div>
    );
  }

  return <StoreProvider store={currentStore}>{dashboardContent}</StoreProvider>;
}
