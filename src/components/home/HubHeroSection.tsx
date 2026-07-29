import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { TARGET_AREAS } from '@/lib/area-data';
import { getTransformedImageUrl } from '@/lib/image-url';

export interface StoreItem {
  id: string;
  slug: string;
  name: string;
  enName: string;
  catchphrase: string;
  castCount: number;
  image: string;
  heroCastImage: string;
  heroCastImages: string[];
  floatCopy: string;
  href: string;
  isExternal?: boolean;
}

export interface HubHeroSectionProps {
  stores?: any[];
  casts?: any[];
}

/*
 * ─── 表示切替フラグ ───────────────────────────────────────────
 * stores.hero_cast_image_url カラムがDBに存在せず getStores() が常にエラー→[] を
 * 返していたため、これまでFVは下の STORE_COMPLEMENT_MAP のフォールバックで
 * 描画されていた。カラム追加によりDB駆動に戻るが、キャッチコピーとヒーロー画像
 * まで一斉に変わってしまうため、当面は従来の見た目を維持する。
 * 有効化したくなったら true にするだけでよい（機能自体は残してある）。
 */

/** true にすると店舗カードのキャッチコピーに管理画面の catch_copy を反映する */
const USE_DB_CATCH_COPY = false;

/** true にすると hero_cast_image_url 未設定の店舗で在籍キャスト写真の自動切替が働く */
const ENABLE_AUTO_CAST_HERO = false;

// デフォルト表示補完用マップ
const STORE_COMPLEMENT_MAP: Record<string, {
  enName: string;
  catchphrase: string;
  castCount: number;
  image: string;
  heroCastImage: string;
  floatCopy: string;
}> = {
  tokyo: {
    enName: 'TOKYO',
    catchphrase: '洗練された夜に、\n心ほどける出会いを。',
    castCount: 24,
    image: '/images/banners/store-jumps/tokyo.webp',
    heroCastImage: '/ゆうと.png',
    floatCopy: '洗練された夜に。\n心ほどける出会いを。',
  },
  osaka: {
    enName: 'OSAKA',
    catchphrase: '美しい夜のまちで、\nときめきの時間を。',
    castCount: 18,
    image: '/images/banners/store-jumps/osaka.webp',
    heroCastImage: '/カイト.png',
    floatCopy: '美しい夜のまちで、\nときめきの時間を。',
  },
  yokohama: {
    enName: 'YOKOHAMA',
    catchphrase: '海と夜景に包まれた、\n特別なひとときを。',
    castCount: 16,
    image: '/images/banners/store-jumps/yokohama.webp',
    heroCastImage: '/シュン.png',
    floatCopy: '海と夜景に包まれた、\n特別なひとときを。',
  },
  nagoya: {
    enName: 'NAGOYA',
    catchphrase: '上質な出会いが、\n特別なひとときを。',
    castCount: 14,
    image: '/images/banners/store-jumps/nagoya.webp',
    heroCastImage: '/towa.png',
    floatCopy: '上質な出会いが、\n特別なひとときを。',
  },
  fukuoka: {
    enName: 'FUKUOKA',
    catchphrase: 'あたたかい空気の中で、\n心ゆるむひとときを。',
    castCount: 12,
    image: '/images/banners/store-jumps/fukuoka.webp',
    heroCastImage: '/images/casts/yuuhi/cafe-date.jpg',
    floatCopy: 'あたたかい空気の中で、\n心ゆるむひとときを。',
  },
};

export default function HubHeroSection({ stores = [], casts = [] }: HubHeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentLoopedIdx, setCurrentLoopedIdx] = useState(0);
  const [castImgIndex, setCastImgIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isJumping = useRef(false);
  const isLocked = useRef(false);
  const touchStartX = useRef<number | null>(null);

  // Supabaseからのstoresデータ駆動スライドデータ生成
  const storeItems: StoreItem[] = useMemo(() => {
    if (!stores || stores.length === 0) {
      return Object.entries(STORE_COMPLEMENT_MAP).map(([slug, comp]) => ({
        id: slug,
        slug,
        name: slug === 'tokyo' ? '東京' : slug === 'osaka' ? '大阪' : slug === 'yokohama' ? '横浜' : slug === 'nagoya' ? '名古屋' : '福岡',
        enName: comp.enName,
        catchphrase: comp.catchphrase,
        castCount: comp.castCount,
        image: comp.image,
        heroCastImage: comp.heroCastImage,
        heroCastImages: [comp.heroCastImage],
        floatCopy: comp.floatCopy,
        href: slug === 'fukuoka' || slug === 'yokohama' ? `/store/${slug}` : slug === 'tokyo' ? 'https://sutoroberrys.com/main/' : slug === 'osaka' ? 'https://sutoroberrys-osaka.com/main.html' : 'https://sutoroberrys-aichi.com/main.html',
        isExternal: slug !== 'fukuoka' && slug !== 'yokohama',
      }));
    }

    return stores.map((store) => {
      const slug = store.slug || (store.name?.includes('横浜') ? 'yokohama' : store.name?.includes('東京') ? 'tokyo' : store.name?.includes('大阪') ? 'osaka' : store.name?.includes('名古屋') ? 'nagoya' : 'fukuoka');
      const comp = STORE_COMPLEMENT_MAP[slug] || STORE_COMPLEMENT_MAP['fukuoka'];
      const isExternal = Boolean(store.use_external_url && store.external_url);
      const href = isExternal
        ? store.external_url
        : `/store/${slug}`;

      // 管理画面で設定された所属キャスト画像リストを収集
      const storeCasts = casts?.filter((c: any) => {
        const castStoreSlug = c.stores?.[0]?.slug || c.storeSlug || c.store_slug;
        return castStoreSlug === slug && (c.mainImageUrl || c.imageUrl || c.image_url || c.main_image_url);
      }) || [];

      // 管理画面でヒーロー画像が明示設定されていればそれを使う（従来どおり）。
      // 未設定時に在籍キャスト写真へ自動フォールバックするかはフラグで制御する。
      const rawCastImages = store.hero_cast_image_url
        ? [store.hero_cast_image_url]
        : ENABLE_AUTO_CAST_HERO
          ? storeCasts.map((c: any) => c.mainImageUrl || c.imageUrl || c.main_image_url || c.image_url).filter(Boolean)
          : [];

      const heroCastImages = rawCastImages.length > 0
        ? rawCastImages.map((url: string) => getTransformedImageUrl(url, { width: 640, format: 'webp' }) || comp.heroCastImage)
        : [comp.heroCastImage];

      const heroCastImage = heroCastImages[0] || comp.heroCastImage;

      return {
        id: store.id || slug,
        slug,
        name: store.name?.replace('店', '') || slug,
        enName: slug.toUpperCase(),
        catchphrase: (USE_DB_CATCH_COPY && store.catch_copy) || comp.catchphrase,
        castCount: comp.castCount,
        // 店舗カードは最大230px幅表示。生画像(1〜1.3MB)をそのまま配信すると
        // FVが極端に重くなるため、Supabase Render API で 480px WebP に変換する。
        image: getTransformedImageUrl(store.image_url, { width: 480, format: 'webp' }) || comp.image,
        heroCastImage,
        heroCastImages,
        floatCopy: (USE_DB_CATCH_COPY && store.catch_copy) || comp.floatCopy,
        href,
        isExternal,
      };
    });
  }, [stores, casts]);

  const N = storeItems.length;
  const LOOPED_STORES = useMemo(() => [...storeItems, ...storeItems, ...storeItems], [storeItems]);

  const activeStore = storeItems[activeIndex] || storeItems[0];
  const currentHeroImg = activeStore?.heroCastImages?.[castImgIndex % (activeStore.heroCastImages.length || 1)] || activeStore?.heroCastImage;

  // activeIndex が変わった時は castImgIndex を 0 にリセット
  useEffect(() => {
    setCastImgIndex(0);
  }, [activeIndex]);

  // 5秒ごとに該当店舗の所属キャスト画像をふわっと切り替え
  useEffect(() => {
    const currentImages = activeStore?.heroCastImages || [];
    if (currentImages.length <= 1) return;

    const timer = setInterval(() => {
      setCastImgIndex((prev) => (prev + 1) % currentImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeStore, activeIndex]);

  useEffect(() => {
    if (N > 0) {
      setCurrentLoopedIdx(N);
    }
  }, [N]);

  // 指定した loopedIndex のカードを中央に正確にスクロール
  const scrollToLoopedIndex = useCallback((loopedIdx: number, smooth: boolean = true) => {
    const container = scrollRef.current;
    const card = cardRefs.current[loopedIdx];
    if (!container || !card) return;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const targetLeft = cardCenter - container.clientWidth / 2;
    if (smooth) {
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    } else {
      container.scrollLeft = targetLeft;
    }
  }, []);

  // 初期表示: 真ん中セットの activeIndex カードを中央へ配置
  useEffect(() => {
    const t = setTimeout(() => {
      isJumping.current = true;
      const initialLooped = N + activeIndex;
      setCurrentLoopedIdx(initialLooped);
      scrollToLoopedIndex(initialLooped, false);
      setTimeout(() => { isJumping.current = false; }, 100);
    }, 60);
    return () => clearTimeout(t);
  }, []);

  // 店舗指定切り替え
  const handleSelectStore = useCallback((realIdx: number) => {
    if (realIdx === activeIndex || isLocked.current) return;
    isLocked.current = true;
    setIsFading(true);

    const targetLooped = N + realIdx;
    setCurrentLoopedIdx(targetLooped);
    scrollToLoopedIndex(targetLooped, true);

    setTimeout(() => {
      setActiveIndex(realIdx);
      setIsFading(false);
      isLocked.current = false;
    }, 300);
  }, [activeIndex, scrollToLoopedIndex]);

  // 1回のスワイプ操作で「隣の1枚だけ」移動する決定版制御
  const stepSlide = useCallback((direction: 'next' | 'prev') => {
    if (isLocked.current) return;
    isLocked.current = true;
    setIsFading(true);

    const nextRealIdx = direction === 'next'
      ? (activeIndex + 1) % N
      : (activeIndex - 1 + N) % N;

    let nextLoopedIdx = direction === 'next' ? currentLoopedIdx + 1 : currentLoopedIdx - 1;

    // ループ領域の補正 (端に達したら中央セットへジャンプ)
    if (nextLoopedIdx < N || nextLoopedIdx >= N * 2) {
      nextLoopedIdx = N + nextRealIdx;
    }

    setCurrentLoopedIdx(nextLoopedIdx);
    scrollToLoopedIndex(nextLoopedIdx, true);

    setTimeout(() => {
      setActiveIndex(nextRealIdx);
      setIsFading(false);
      isLocked.current = false;
    }, 300);
  }, [activeIndex, currentLoopedIdx, scrollToLoopedIndex]);

  // タッチスワイプイベント処理（1スワイプ＝1カード固定）
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    touchStartX.current = null;

    const SWIPE_THRESHOLD = 30; // 30px 以上の移動でスライド発火
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        stepSlide('next'); // 左へフリック -> 次の店舗
      } else {
        stepSlide('prev'); // 右へフリック -> 前の店舗
      }
    }
  };

  return (
    <section className="relative w-full bg-[#fbf6f6] text-slate-800 overflow-hidden font-sans select-none pb-10">

      {/* 🌸 1. ヘッダー */}
      <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-12 sm:py-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl">🍓</span>
          <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#331c21]">
            STRAWBERRY BOYS
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest text-[#5c3e45]">
          <a href="#stores" className="transition-colors hover:text-[#b8324f]">全国の店舗</a>
          <a href="#about" className="transition-colors hover:text-[#b8324f]">ブランドについて</a>
        </nav>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center text-slate-800 md:hidden text-2xl font-light"
          aria-label="メニュー"
        >
          ≡
        </button>
      </header>

      {/* スマホ用ドロワー */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#fffafb] p-6 md:hidden">
          <div className="flex justify-between items-center mb-8">
            <span className="font-serif text-lg font-bold tracking-widest text-[#331c21]">🍓 STRAWBERRY BOYS</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-2xl text-slate-500">✕</button>
          </div>
          <div className="flex flex-col gap-6 text-base font-bold text-[#5c3e45]">
            <a href="#stores" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-rose-100">全国の店舗</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-rose-100">ブランドについて</a>
          </div>
        </div>
      )}

      {/* 👑 2. ヒーローエリア */}
      <h1 className="sr-only">
        女風・女性用風俗なら福岡(博多・天神)・横浜(関内・みなとみらい)対応のストロベリーボーイズ|女性専用出張サービス
      </h1>

      {/* ━━━ PC レイアウト (md 以上) ━━━ */}
      <div className="hidden md:block relative mx-auto max-w-7xl px-12 pt-4 pb-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <span className="absolute top-10 right-1/3 text-rose-400/80 text-2xl animate-pulse">🌸</span>
          <span className="absolute top-1/2 right-12 text-pink-300/70 text-xl">🌸</span>
          <span className="absolute bottom-1/3 right-1/4 text-rose-300/60 text-base">🌸</span>
        </div>
        <div className="grid grid-cols-12 gap-6 items-center min-h-[480px]">
          <div className="col-span-6 text-left space-y-6 z-20">
            <p className="text-xs font-bold tracking-[0.35em] text-slate-400 uppercase">WOMEN'S PRIVATE SERVICE</p>
            <p className="font-serif text-5xl lg:text-6xl font-extrabold leading-[1.25] tracking-tight text-[#2b181c]">
              大人になっても、<br />
              <span className="text-[#d64567]">ときめ</span>いていい。
            </p>
            <p className="text-sm font-medium leading-relaxed tracking-wider text-[#634950] max-w-md">
              あなたの街で、心ほどける時間を。<br />
              全国の店舗からお選びください。
            </p>
          </div>
          <div className="col-span-6 relative flex justify-end items-center">
            <div className="relative w-full max-w-[460px] aspect-[4/4.6] rounded-3xl overflow-hidden shadow-xl border border-white/60">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeStore.id}-${castImgIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <NextImage
                    src={currentHeroImg}
                    alt={`ストロベリーボーイズ${activeStore.name}店の人気セラピスト`}
                    fill
                    sizes="(max-width: 768px) 100vw, 460px"
                    fetchPriority="high"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#fbf6f6]/60 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="absolute left-[-20px] lg:left-[-40px] top-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <p className="font-serif text-2xl lg:text-3xl font-extrabold italic leading-relaxed tracking-widest text-[#7a283c] drop-shadow-md whitespace-pre-line transform -rotate-6">
                {activeStore.floatCopy}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ スマホレイアウト (md 未満) ━━━ */}
      <div className="md:hidden">
        <div className="text-center px-4 pb-3 space-y-0.5">
          <p className="text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase">WOMEN'S PRIVATE SERVICE</p>
          <p className="font-serif text-[26px] font-extrabold leading-snug tracking-tight text-[#2b181c]">
            大人になっても、<br />
            <span className="text-[#d64567]">ときめ</span>いていい。
          </p>
        </div>
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeStore.id}-${castImgIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <NextImage
                src={currentHeroImg}
                alt={`ストロベリーボーイズ${activeStore.name}店の人気セラピスト`}
                fill
                sizes="100vw"
                fetchPriority="high"
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-serif text-xl font-bold italic leading-relaxed tracking-widest text-white drop-shadow-lg whitespace-pre-line transform -rotate-3">
              {activeStore.floatCopy}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fbf6f6] via-[#fbf6f6]/60 to-transparent" />
        </div>
      </div>

      {/* 🎪 3. 店舗選択カルーセル (1スワイプ=1カード固定制御) */}
      <div id="stores" className="relative z-20 -mt-24 md:mt-6 pb-2">
        <div
          ref={scrollRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full overflow-x-hidden hide-scrollbar pt-10 pb-4"
        >
          <div className="flex items-end md:justify-center gap-2 sm:gap-4 min-w-max px-[calc(50vw-115px)] md:px-8 md:max-w-7xl md:mx-auto">
            {LOOPED_STORES.map((store: StoreItem, loopedIdx: number) => {
              const realIdx = loopedIdx % N;
              const isActive = realIdx === activeIndex;
              const isMiddleCopy = loopedIdx >= N && loopedIdx < N * 2;

              return (
                <div
                  key={`${store.id}-${loopedIdx}`}
                  ref={(el) => { cardRefs.current[loopedIdx] = el; }}
                  onClick={() => handleSelectStore(realIdx)}
                  className={`
                    cursor-pointer transition-all duration-300 rounded-2xl flex flex-col justify-between p-3 text-left
                    ${isActive
                      ? 'w-[200px] sm:w-[230px] bg-white ring-4 ring-[#e25c7b]/30 shadow-2xl border-2 border-[#d64567] -translate-y-5 z-30 scale-105'
                      : 'w-[140px] sm:w-[170px] bg-white/80 border border-slate-200/80 shadow-sm opacity-60 hover:opacity-90 z-10'
                    }
                    ${!isMiddleCopy ? 'md:hidden' : ''}
                  `}
                >
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <NextImage src={store.image} alt={store.name} fill sizes="200px" loading="lazy" className="object-cover" />
                  </div>
                  <div className="mb-1.5">
                    <div className="flex items-baseline gap-1">
                      <h3 className={`font-serif font-bold ${isActive ? 'text-base sm:text-lg text-[#2b181c]' : 'text-xs sm:text-sm text-slate-700'}`}>
                        {store.name}
                      </h3>
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        {store.enName}
                      </span>
                    </div>
                    <p className={`text-[9px] sm:text-[10px] font-medium text-slate-600 leading-relaxed mt-0.5 line-clamp-2 ${isActive ? 'block' : 'hidden sm:block opacity-80'}`}>
                      {store.catchphrase.replace('\n', ' ')}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {store.isExternal ? (
                      <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>グループ店舗</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-rose-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        <span>在籍</span>
                        <span className="text-slate-700 font-extrabold ml-0.5">{store.castCount}名</span>
                      </div>
                    )}
                    {store.isExternal ? (
                      <a
                        href={store.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#d64567] to-[#b8324f] text-white shadow-md hover:brightness-105'
                            : 'bg-rose-50 text-[#d64567] hover:bg-rose-100'
                        }`}
                      >
                        <span>この店舗を選ぶ</span><span>→</span>
                      </a>
                    ) : (
                      <Link
                        href={store.href}
                        className={`w-full py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#d64567] to-[#b8324f] text-white shadow-md hover:brightness-105'
                            : 'bg-rose-50 text-[#d64567] hover:bg-rose-100'
                        }`}
                      >
                        <span>この店舗を選ぶ</span><span>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ドットインジケーター */}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          {storeItems.map((_, idx: number) => (
            <button
              key={idx}
              onClick={() => handleSelectStore(idx)}
              className={`h-2 transition-all duration-300 rounded-full ${
                idx === activeIndex ? 'w-6 bg-[#d64567]' : 'w-2 bg-rose-200 hover:bg-rose-300'
              }`}
              aria-label={`店舗 ${idx + 1}`}
            />
          ))}
        </div>

        {/* 📍 店舗選択連動型・ファーストビュー爆速エリア検索モジュール (行動心理導線の最適化) */}
        <div className="mx-auto max-w-4xl px-4 pt-6 pb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStore.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-rose-200/80 bg-white/90 p-4 sm:p-6 shadow-xl backdrop-blur-md"
            >
              {!activeStore.isExternal ? (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <span className="text-xs sm:text-sm font-black tracking-tight text-slate-800">
                        {activeStore.name}の対応出張エリア（即日派遣可能）
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider hidden sm:inline">
                      1Tap Access
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(() => {
                      const activeSlug = activeStore.slug || (activeStore.name?.includes('横浜') ? 'yokohama' : 'fukuoka');
                      return TARGET_AREAS.filter((a) => a.slug === activeSlug).map((area) => (
                        <Link
                          key={area.areaSlug}
                          href={`/store/${activeSlug}/area/${area.areaSlug}`}
                          className="group flex items-center justify-between rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50/60 to-pink-50/40 p-2.5 sm:p-3 text-left transition-all hover:border-rose-400 hover:bg-rose-500 hover:shadow-md"
                        >
                          <div>
                            <p className="text-xs font-black text-slate-800 transition-colors group-hover:text-white">
                              {area.name}エリア
                            </p>
                            <p className="text-[8px] font-medium text-slate-400 group-hover:text-rose-100 hidden sm:block">
                              指定ホテル・自宅出張
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-rose-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white shrink-0" />
                        </Link>
                      ));
                    })()}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-black text-slate-800">
                        {activeStore.name}エリアのご利用について
                      </p>
                      <p className="text-[10px] text-slate-500">
                        ※{activeStore.name}地区のご予約・詳細はグループ公式Webサイトにて承っております
                      </p>
                    </div>
                  </div>
                  <a
                    href={activeStore.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-rose-600 hover:shadow-lg flex items-center gap-1.5"
                  >
                    <span>{activeStore.name}グループ公式サイトを開く</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
