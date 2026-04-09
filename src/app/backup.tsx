'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import StoreCard from '@/components/store/StoreCard';
import { generateTheme } from '@/utils/colorUtils';

// DBのカラムに合わせた型
interface StoreRow {
  id: string;
  name: string;
  slug: string;
  catch_copy?: string;
  image_url?: string;
  theme_color?: string;
  tags?: string[];
}

// UI用の型
export interface StoreData {
  id: string;
  name: string;
  slug: string;       // DBのslugを保持
  description: string;
  bannerImage: string;
  hashtags: string[];
  link: string;       // UI用に生成
  gradient: string;   // CSS の linear-gradient 値
}

export default function StoreSelectPage() {
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      console.log('📡 Supabaseから店舗データ取得開始...');
      const { data, error } = await supabase.from('stores').select('*');

      if (error) {
        console.error('❌ stores取得エラー:', error);
      } else {
        console.log('✅ stores取得成功:', data);
        setStores(data || []);
      }
      setLoading(false);
    };

    fetchStores();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">⏳ 読み込み中...</div>;
  }

  if (!stores || stores.length === 0) {
    console.warn('⚠️ Supabaseから店舗データが空です');
    return <div className="p-6 text-center text-gray-600">⚠️ 店舗データがありません</div>;
  }

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-8 sm:px-6">
      <header className="mb-10 text-center">
        <h1 className="mb-3 font-serif text-2xl font-bold text-gray-800 sm:text-3xl">
          いちご一会の招待状
        </h1>
        <p className="text-base text-gray-700">
          今日のあなたは、どんな特別な時間をお過ごしになりますか？
        </p>
        <p className="mt-2 text-sm text-gray-500">3つの招待状から、お選びください</p>

        <div className="mt-4 flex justify-center sm:mt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-pink-300 shadow-md sm:h-12 sm:w-12">
            <span className="text-lg sm:text-xl">🍓</span>
          </div>
        </div>
      </header>

      <section className="space-y-12">
        {stores.map((s, i) => {
          const theme = generateTheme(s.theme_color || '#ec4899');

          // DBの行を UI用の型に変換
          const storeData: StoreData = {
            id: s.id,
            name: s.name,
            slug: s.slug,
            link: `/store/${s.slug}`,
            description: s.catch_copy || '',
            bannerImage: s.image_url || '/cast-default.jpg',
            hashtags: s.tags || [],
            // ✅ theme.primaryDark を利用
            gradient: `linear-gradient(135deg, ${s.theme_color || '#ec4899'}, ${theme.primaryDark})`,
          };

          return <StoreCard key={s.id || i} store={storeData} />;
        })}
      </section>
    </main>
  );
}
