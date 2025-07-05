'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // ← router は削除
import { stores } from '@/data/stores';
import { mockCastMembers, mockNews } from '@/data/mockData';
import Header from '@/components/sections/layout/Header';
import HeroSection from '@/components/sections/store/HeroSection';
import TodaysCast from '@/components/sections/store/TodaysCast';
import NewsSection from '@/components/sections/store/NewsSection';
import StoreMessage from '@/components/sections/store/StoreMessage';
import InformationGrid from '@/components/sections/store/InformationGrid';
import Footer from '@/components/sections/layout/Footer';
import { StoreLocation } from '@/types/store';

export default function StorePage() {
  const params = useParams(); // ← router 削除済み

  const [store, setStore] = useState<(typeof stores)[StoreLocation] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🟡 useEffect 発火 / params:', params);

    // ✅ paramsがまだ未定義の場合は return
    if (!params || !params.store) {
      console.log('⏳ params.store が未定義のため、まだ待機中');
      return;
    }

    const rawId = params.store;
    console.log('🔍 rawId:', rawId);
    console.log('🧾 有効な店舗ID一覧:', Object.keys(stores));

    // ✅ store ID が文字列じゃなければ return
    if (typeof rawId !== 'string') {
      console.warn('❌ store ID が文字列ではありません:', rawId);
      return;
    }

    // ✅ IDが一覧に含まれていなければ return（リダイレクトしない）
    if (!Object.keys(stores).includes(rawId)) {
      console.warn('❌ 無効な店舗ID:', rawId);
      return;
    }

    const typedId = rawId as StoreLocation;
    const selectedStore = stores[typedId];

    console.log('🟢 店舗データ読み込み成功:', selectedStore);
    setStore(selectedStore);
    setLoading(false);
  }, [params]);

  // ✅ ローディング中は画面表示せずローディング表示
  if (loading || !store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-600">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <HeroSection store={store} />
        <TodaysCast store={store} castMembers={mockCastMembers} />
        <NewsSection store={store} news={mockNews} />
        <StoreMessage store={store} />
        <InformationGrid store={store} />
      </main>
      <Footer store={store} />
    </div>
  );
}
