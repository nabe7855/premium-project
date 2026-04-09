'use client';

import { supabase } from '@/lib/supabaseClient';
import { Store } from '@/types/stores';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import StoreCard from './StoreCards';
import StoreDetails from './StoreDetails';

const StoreSelectionScreen: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 👉 ドラッグ用 state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // ✅ Supabase から店舗データを取得
  useEffect(() => {
    const fetchStores = async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(
          'id, name, slug, catch_copy, description, image_url, theme_color, tags, external_url, use_external_url',
        );

      if (error) {
        console.error('❌ stores取得エラー:', error.message);
        return;
      }

      const formatted: Store[] = (data || []).map(
        (s: any): Store => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          title: s.name,
          portraitUrl: s.image_url || '/cast-default.jpg',
          fullImageUrl: s.image_url || '/cast-default.jpg',
          stats: { quality: 50, variety: 50, service: 50, rarity: 50 },
          catch_copy: s.catch_copy || '',
          description: s.description || '',
          bannerImage: s.image_url || '/cast-default.jpg',
          themeColor: s.theme_color || '#ec4899',
          tags: s.tags || [],
          external_url: s.external_url || '',
          use_external_url: s.use_external_url || false,
        }),
      );

      setStores(formatted);
      if (formatted.length > 0) {
        setSelectedStore(formatted[0]);
      }
    };

    fetchStores();
  }, []);

  const handleSelectStore = (store: Store, index: number) => {
    if (selectedIndex !== index) {
      setSelectedIndex(index);
      setSelectedStore(store);
    }
  };

  const goToIndex = (index: number) => {
    const numStores = stores.length;
    if (numStores === 0) return;
    const newIndex = (index + numStores) % numStores; // ← 無限ループ
    handleSelectStore(stores[newIndex], newIndex);
  };

  // 👉 ドラッグ処理
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(startX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = currentX - dragStartX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const dragThreshold = 80;
    if (dragOffset < -dragThreshold) {
      goToIndex(selectedIndex + 1);
    } else if (dragOffset > dragThreshold) {
      goToIndex(selectedIndex - 1);
    }
    setDragOffset(0);
  };

  if (!selectedStore) {
    return <div className="p-6 text-center">⏳ 店舗を読み込み中...</div>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* 店舗情報 */}
      <div className="flex-grow overflow-y-auto p-6 pb-[200px] sm:p-10">
        <header className="relative mb-12 text-center">
          {/* 背景に放射状グラデーション */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-rose-700 via-pink-600 to-rose-800 opacity-90"></div>
          <div className="bg-gradient-radial absolute inset-0 -z-10 from-white/20 via-transparent to-transparent blur-2xl"></div>

          {/* タイトル */}
          <motion.h1
            className="mb-6 bg-gradient-to-r from-pink-200 via-white to-pink-300 bg-clip-text font-serif text-4xl font-extrabold text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] sm:text-5xl"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            いちご一会の招待状
          </motion.h1>

          {/* 区切りライン */}
          <motion.div
            className="mb-6 flex items-center justify-center text-rose-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="h-[1px] w-16 bg-rose-200/70"></span>
            <span className="mx-3 text-lg">❤</span>
            <span className="h-[1px] w-16 bg-rose-200/70"></span>
          </motion.div>

          {/* サブメッセージ */}
          <motion.p
            className="mb-4 text-xl font-semibold leading-relaxed text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-2xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          >
            お帰りなさい。
            <br className="sm:hidden" />
            あなたにぴったりの極上の
            <span className="bg-gradient-to-r from-pink-200 via-pink-300 to-pink-100 bg-clip-text font-extrabold text-pink-300 text-transparent drop-shadow-[0_0_8px_rgba(255,200,200,0.9)]">
              イチゴ一会
            </span>
            をご用意いたしました。
          </motion.p>

          {/* サブテキスト */}
          <motion.p
            className="mt-3 text-base tracking-wide text-gray-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
          >
            心ときめくひとときを、ここから。
          </motion.p>
        </header>

        {/* ✅ 店舗切り替えごとにアニメーション再生 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStore.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <StoreDetails store={selectedStore} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* スライダー（画面下固定） */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-700 bg-black/80 backdrop-blur-md">
        <div
          className="relative flex h-[180px] w-full cursor-grab touch-pan-y select-none items-center justify-center overflow-hidden active:cursor-grabbing sm:h-[220px]"
          style={{ perspective: '1200px' }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchEnd={handleDragEnd}
          onWheel={(e) => e.preventDefault()} // ← ホイールスクロール禁止
        >
          {stores.map((store, index) => {
            let offset = selectedIndex - index;
            const numStores = stores.length;

            if (Math.abs(offset) > numStores / 2) {
              if (offset > 0) offset -= numStores;
              else offset += numStores;
            }

            const absOffset = Math.abs(offset);

            const style: React.CSSProperties = {
              transform: `
                rotateY(${offset * 35}deg)
                translateX(${offset * 25}%)
                translateZ(${-absOffset * 100}px)
                scale(${1 - absOffset * 0.15})
                translateX(${dragOffset}px)
              `,
              zIndex: stores.length - absOffset,
              opacity: absOffset > 2 ? 0 : 1,
              transition: isDragging ? 'none' : 'all 0.4s ease-out',
              pointerEvents: absOffset > 2 ? 'none' : 'auto',
            };

            return (
              <div
                key={store.id}
                className="absolute bottom-0 left-0 right-0 top-0 m-auto aspect-[16/9] w-[clamp(200px,40vw,280px)]"
                style={style}
                onClick={() => goToIndex(index)}
              >
                <StoreCard
                  store={store}
                  isSelected={selectedIndex === index}
                  onSelect={() => goToIndex(index)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreSelectionScreen;
