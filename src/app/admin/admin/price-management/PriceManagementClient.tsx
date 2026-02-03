'use client';

import AdditionalInfoSection from '@/components/admin/price/AdditionalInfoSection';
import CampaignCard from '@/components/admin/price/CampaignCard';
import { MOCK_BASIC_SERVICES } from '@/components/admin/price/constants';
import CourseCard from '@/components/admin/price/CourseCard';
import FAQSection from '@/components/admin/price/FAQSection';
import PriceConfigEditor from '@/components/admin/price/PriceConfigEditor';
import PriceDashboard from '@/components/admin/price/PriceDashboard';
import SimplePriceList from '@/components/admin/price/SimplePriceList';
import { AppView, Category, StoreConfig } from '@/components/admin/price/types';
import { mapStoreConfigToEditableConfig } from '@/lib/mappers/priceMapper';
import { useEffect, useState } from 'react';

interface PriceManagementClientProps {
  initialStores: StoreConfig[];
}

export default function PriceManagementClient({ initialStores }: PriceManagementClientProps) {
  console.log('[PriceManagementClient] Rendered with initialStores count:', initialStores.length);
  console.log('[PriceManagementClient] initialStores data:', initialStores);

  const [view, setView] = useState<AppView>('ADMIN');
  const [activeTab, setActiveTab] = useState<Category>('COURSES');
  const [isSticky, setIsSticky] = useState(false);
  const [stores, setStores] = useState<StoreConfig[]>(initialStores);
  const [currentStore, setCurrentStore] = useState<StoreConfig | null>(null);
  const [editingStoreSlug, setEditingStoreSlug] = useState<string | null>(null);

  useEffect(() => {
    setStores(initialStores);
  }, [initialStores]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePreview = (store: StoreConfig) => {
    setCurrentStore(store);
    setView('PUBLIC');
  };

  const handleEdit = (store: StoreConfig) => {
    setEditingStoreSlug(store.slug);
    setView('EDIT');
  };

  const handleAddStore = () => {
    alert('店舗の追加はキャスト管理画面から行ってください（店舗DBと同期されます）');
  };

  const handleDeleteStore = (id: string) => {
    if (confirm('料金設定情報を削除しますか？店舗自体は削除されません。')) {
      setStores(stores.filter((s) => s.id !== id));
    }
  };

  const handleUpdateStoreInfo = (id: string, name: string, slug: string) => {
    setStores(stores.map((s) => (s.id === id ? { ...s, storeName: name, slug: slug } : s)));
  };

  const tabs: { id: Category; label: string }[] = [
    { id: 'COURSES', label: 'コース' },
    { id: 'TRANSPORT', label: '送迎' },
    { id: 'OPTIONS', label: 'オプション' },
    { id: 'DISCOUNTS', label: '割引' },
    { id: 'PROHIBITIONS', label: '禁止事項' },
  ];

  // --- 管理画面（ダッシュボード） ---
  if (view === 'ADMIN') {
    return (
      <div className="bg-strawberry-dots min-h-screen bg-[#fffaf0] pb-20">
        <PriceDashboard
          stores={stores}
          onEdit={handleEdit}
          onPreview={handlePreview}
          onAdd={handleAddStore}
          onDelete={handleDeleteStore}
          onUpdateStoreInfo={handleUpdateStoreInfo}
        />
        {stores.length === 0 && (
          <div className="mx-auto max-w-md rounded-3xl bg-white/50 p-10 text-center">
            <p className="font-bold text-rose-500">店舗データが取得できませんでした。</p>
            <p className="mt-2 text-xs text-rose-300">
              データベース接続またはデータの形式を確認してください。
            </p>
          </div>
        )}
      </div>
    );
  }

  // --- 編集画面 ---
  if (view === 'EDIT' && editingStoreSlug) {
    const targetStore = stores.find((s) => s.slug === editingStoreSlug);
    if (!targetStore) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#fffaf0]">
          <div className="text-center">
            <p className="font-bold text-rose-500">店舗が見つかりません</p>
            <button onClick={() => setView('ADMIN')} className="mt-4 text-rose-300 underline">
              一覧へ戻る
            </button>
          </div>
        </div>
      );
    }
    const initialConfig = mapStoreConfigToEditableConfig(targetStore);

    return (
      <div className="bg-strawberry-dots min-h-screen bg-[#fffaf0] pb-20">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <button
            onClick={() => {
              setView('ADMIN');
              setEditingStoreSlug(null);
            }}
            className="mb-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-rose-500 shadow-lg transition-transform hover:scale-105"
          >
            ← 店舗一覧へ戻る
          </button>
          <PriceConfigEditor
            key={editingStoreSlug}
            storeSlug={editingStoreSlug}
            initialConfig={initialConfig}
            onSaveComplete={() => {
              setView('ADMIN');
              setEditingStoreSlug(null);
            }}
          />
        </div>
      </div>
    );
  }

  // --- 公開プレビュー画面 ---
  if (view === 'PUBLIC' && currentStore) {
    return (
      <div className="bg-strawberry-dots min-h-screen bg-[#fffaf0] pb-32 selection:bg-rose-200 selection:text-rose-900 md:pb-16">
        <button
          onClick={() => setView('ADMIN')}
          className="fixed right-4 top-24 z-[200] flex items-center justify-center rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-bold text-rose-500 shadow-lg transition-transform hover:scale-105"
        >
          ← 店舗一覧へ戻る
        </button>

        <main className="mx-auto max-w-4xl px-4">
          <div className="mb-12 overflow-hidden rounded-[2rem] shadow-2xl">
            <img
              src={currentStore.heroImageUrl || '/料金ページトップ画像.jpg'}
              alt="料金ページ"
              className="h-auto w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/料金ページトップ画像.jpg';
              }}
            />
          </div>

          <nav
            className={`z-50 transition-all duration-500 ${isSticky ? 'sticky top-20 -mx-4 bg-white/90 px-4 py-3 shadow-md backdrop-blur-md' : 'mb-12'}`}
          >
            <div className="mx-auto max-w-xl">
              <div className="flex overflow-hidden rounded-full border border-rose-100 bg-rose-100/50 p-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`font-rounded flex-1 truncate rounded-full px-1 py-3 text-xs font-bold transition-all duration-500 md:text-sm ${
                      activeTab === tab.id
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'text-rose-300 hover:text-rose-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <div className="duration-1000 animate-in fade-in slide-in-from-bottom-8">
            {activeTab === 'COURSES' && (
              <div className="space-y-4">
                {currentStore.courses.map((course, idx) => (
                  <CourseCard key={course.id} course={course} defaultOpen={idx === 0} />
                ))}
              </div>
            )}

            {activeTab === 'TRANSPORT' && (
              <div className="space-y-8">
                <SimplePriceList items={currentStore.transportAreas} title="Transportation Fees" />
              </div>
            )}

            {activeTab === 'OPTIONS' && (
              <div className="space-y-8 pb-10">
                <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-8">
                  <h3 className="font-rounded mb-4 text-lg font-bold text-rose-900">
                    基本サービス
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_BASIC_SERVICES.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <SimplePriceList items={currentStore.options} title="Special Options" />
              </div>
            )}

            {activeTab === 'DISCOUNTS' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {currentStore.campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}

            {activeTab === 'PROHIBITIONS' && (
              <div className="space-y-8 pb-10">
                <div className="mb-10 text-center">
                  <h2 className="font-rounded mb-2 text-2xl font-bold text-rose-900 md:text-3xl">
                    禁止事項について
                    <span className="mt-2 block text-sm font-normal tracking-widest text-rose-400">
                      PROHIBITIONS
                    </span>
                  </h2>
                </div>

                <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/50 md:p-10">
                  <ul className="space-y-4">
                    {currentStore.prohibitions && currentStore.prohibitions.length > 0 ? (
                      currentStore.prohibitions.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                          <span className="text-sm font-medium leading-relaxed text-rose-800 md:text-base">
                            {item}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-center text-rose-300">禁止事項は設定されていません。</p>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <FAQSection faqs={currentStore.faqs} />
            <AdditionalInfoSection />
          </div>
        </main>

        <footer className="mt-24 border-t border-rose-100 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-300">
            © 2024 SWEET BERRY SYSTEM.
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf0]">
      <div className="text-center">
        <p className="font-bold text-rose-500">画面を読み込んでいます...</p>
        <button onClick={() => setView('ADMIN')} className="mt-4 text-sm text-rose-300 underline">
          管理画面へ移動
        </button>
      </div>
    </div>
  );
}
