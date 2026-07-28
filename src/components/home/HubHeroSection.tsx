'use client';

import React, { useState, useRef, useCallback } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';

export interface StoreItem {
  id: string;
  name: string;
  enName: string;
  catchphrase: string;
  castCount: number;
  image: string; // 店舗夜景写真
  heroCastImage: string; // ヒーロー写真
  floatCopy: string; // 枠なし浮遊フロートコピー
  href: string;
  isExternal?: boolean;
}

const STORES_DATA: StoreItem[] = [
  {
    id: 'tokyo',
    name: '東京',
    enName: 'TOKYO',
    catchphrase: '洗練された夜に、\n心ほどける出会いを。',
    castCount: 24,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    heroCastImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    floatCopy: '洗練された夜に。\n心ほどける出会いを。',
    href: '/store/tokyo',
    isExternal: false,
  },
  {
    id: 'osaka',
    name: '大阪',
    enName: 'OSAKA',
    catchphrase: '美しい夜のまちで、\nときめきの時間を。',
    castCount: 18,
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80',
    heroCastImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    floatCopy: '美しい夜のまちで、\nときめきの時間を。',
    href: '/store/osaka',
    isExternal: false,
  },
  {
    id: 'yokohama',
    name: '横浜',
    enName: 'YOKOHAMA',
    catchphrase: '海と夜景に包まれた、\n特別なひとときを。',
    castCount: 16,
    image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    heroCastImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
    floatCopy: '海と夜景に包まれた、\n特別なひとときを。',
    href: '/store/yokohama',
    isExternal: false,
  },
  {
    id: 'nagoya',
    name: '名古屋',
    enName: 'NAGOYA',
    catchphrase: '上質な出会いが、\n特別なひとときを。',
    castCount: 14,
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    heroCastImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    floatCopy: '上質な出会いが、\n特別なひとときを。',
    href: '/store/nagoya',
    isExternal: false,
  },
  {
    id: 'fukuoka',
    name: '福岡',
    enName: 'FUKUOKA',
    catchphrase: 'あたたかい空気の中で、\n心ゆるむひとときを。',
    castCount: 12,
    image: 'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=800&q=80',
    heroCastImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
    floatCopy: 'あたたかい空気の中で、\n心ゆるむひとときを。',
    href: '/store/fukuoka',
    isExternal: false,
  },
];

export default function HubHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // スマホ横スクロールコンテナのref
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // スクロール中の重複起動防止
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeStore = STORES_DATA[activeIndex];

  const handleSelectStore = (index: number) => {
    if (index === activeIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsFading(false);
    }, 180);
  };

  // スマホ横スクロール時、中央に来たカードを自動アクティブ化
  const handleScroll = useCallback(() => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      let closestIndex = 0;
      let closestDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(containerCenter - cardCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      if (closestIndex !== activeIndex) {
        handleSelectStore(closestIndex);
      }
    }, 80);
  }, [activeIndex]);

  return (
    <section className="relative w-full bg-[#fbf6f6] text-slate-800 overflow-hidden font-sans select-none pb-16">
      
      {/* 🌸 1. ヘッダー (Header) */}
      <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-12 sm:py-6">
        {/* 左ロゴ: 🍓 STRAWBERRY BOYS */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl">🍓</span>
          <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#331c21]">
            STRAWBERRY BOYS
          </span>
        </Link>

        {/* PC ナビゲーション */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest text-[#5c3e45]">
          <a href="#stores" className="transition-colors hover:text-[#b8324f]">
            全国の店舗
          </a>
          <a href="#about" className="transition-colors hover:text-[#b8324f]">
            ブランドについて
          </a>
          <Link
            href="/login"
            className="rounded-full border border-slate-300 bg-white/80 px-7 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-900 hover:text-white shadow-xs"
          >
            ログイン
          </Link>
        </nav>

        {/* スマホ用ハンバーガーボタン */}
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
            <span className="font-serif text-lg font-bold tracking-widest text-[#331c21]">
              🍓 STRAWBERRY BOYS
            </span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-2xl text-slate-500">
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-6 text-base font-bold text-[#5c3e45]">
            <a href="#stores" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-rose-100">
              全国の店舗
            </a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-rose-100">
              ブランドについて
            </a>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 rounded-full bg-[#b8324f] py-3 text-center text-white font-bold shadow-md"
            >
              ログイン
            </Link>
          </div>
        </div>
      )}

      {/* 👑 2. ヒーローエリア (Hero Section) */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-12 pt-2 sm:pt-6 pb-6">
        
        {/* 🌸 舞い散るピンクの花びら（ワイヤーフレーム通りの上品な舞い落ち） */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <span className="absolute top-10 right-1/3 text-rose-400/80 text-xl sm:text-2xl animate-pulse">🌸</span>
          <span className="absolute top-1/2 right-12 text-pink-300/70 text-lg sm:text-xl">🌸</span>
          <span className="absolute bottom-1/3 right-1/4 text-rose-300/60 text-base">🌸</span>
        </div>

        {/* --- PCレイアウト (md以上) --- */}
        <div className="hidden md:grid grid-cols-12 gap-6 items-center min-h-[480px]">
          
          {/* 左側: コピー群 (❶ ヒーローコピー) */}
          <div className="col-span-6 text-left space-y-6 z-20">
            {/* WOMEN'S PRIVATE SERVICE */}
            <p className="text-xs font-bold tracking-[0.35em] text-slate-400 uppercase">
              WOMEN'S PRIVATE SERVICE
            </p>

            {/* 大人のH1コピー */}
            <h1 className="font-serif text-5xl lg:text-6xl font-extrabold leading-[1.25] tracking-tight text-[#2b181c]">
              大人になっても、<br />
              <span className="text-[#d64567]">ときめ</span>いていい。
            </h1>

            {/* サブコピー */}
            <p className="text-sm font-medium leading-relaxed tracking-wider text-[#634950] max-w-md">
              あなたの街で、心ほどける時間を。<br />
              全国の店舗からお選びください。
            </p>
          </div>

          {/* 右側: 男性キャスト写真 ＋ 枠なし浮遊フロートコピー (❷ フロートコピー) */}
          <div className="col-span-6 relative flex justify-end items-center">
            {/* 写真 */}
            <div className="relative w-full max-w-[460px] aspect-[4/4.6] rounded-3xl overflow-hidden shadow-xl border border-white/60">
              <NextImage
                src={activeStore.heroCastImage}
                alt={activeStore.name}
                fill
                className={`object-cover transition-opacity duration-500 ${
                  isFading ? 'opacity-40' : 'opacity-100'
                }`}
                priority
              />
              {/* 薄いグラデーション */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#fbf6f6]/60 via-transparent to-transparent" />
            </div>

            {/* 枠・バッジなしで手書き風に浮遊するフロートコピー（ワイヤーフレーム忠実再現） */}
            <div className="absolute left-[-20px] lg:left-[-40px] top-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <p className="font-serif text-2xl lg:text-3xl font-extrabold italic leading-relaxed tracking-widest text-[#7a283c] drop-shadow-md whitespace-pre-line transform -rotate-6">
                {activeStore.floatCopy}
              </p>
            </div>
          </div>
        </div>

        {/* --- スマホレイアウト (md未満) --- */}
        <div className="flex md:hidden flex-col items-center text-center space-y-3 pt-0">
          
          {/* WOMEN'S PRIVATE SERVICE & H1 */}
          <div className="space-y-1">
            <p className="text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase">
              WOMEN'S PRIVATE SERVICE
            </p>
            <h1 className="font-serif text-2xl xs:text-3xl font-extrabold leading-snug tracking-tight text-[#2b181c]">
              大人になっても、<br />
              <span className="text-[#d64567]">ときめ</span>いていい。
            </h1>
          </div>

          {/* スマホ中央の大判写真 ＋ 写真上に重ねて浮遊する手書きフロートコピー */}
          <div className="relative w-full max-w-[280px] xs:max-w-[310px] aspect-[4/4.2] rounded-2xl overflow-hidden shadow-lg border border-white my-1">
            <NextImage
              src={activeStore.heroCastImage}
              alt={activeStore.name}
              fill
              className={`object-cover transition-opacity duration-500 ${
                isFading ? 'opacity-40' : 'opacity-100'
              }`}
              priority
            />
            <div className="absolute inset-0 bg-black/25" />

            {/* 写真中央上に枠なしで白〜ピンクの手書き風浮遊文字 */}
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <p className="font-serif text-lg xs:text-xl font-bold italic leading-relaxed tracking-widest text-white drop-shadow-lg whitespace-pre-line transform -rotate-3">
                {activeStore.floatCopy}
              </p>
            </div>
          </div>

          {/* モバイル表示時はスクロールなしで1画面に収めるため文言を非表示 (hidden md:block) */}
          <p className="hidden md:block text-xs font-medium leading-relaxed tracking-wider text-[#634950]">
            あなたの街で、心ほどける時間を。<br />
            全国の店舗からお選びください。
          </p>
        </div>

      </div>

      {/* 🎪 3. 店舗選択カード (店舗選択スライダー - ワイヤーフレーム❸) */}
      <div id="stores" className="relative z-20 mt-4 sm:mt-8 px-2 sm:px-8 max-w-7xl mx-auto">
        
        {/* 店舗カード群 (PC: 5店舗並列 / スマホ: 中央強調＆左右見切りスライダー) */}
        {/* スマホ: スクロールで中央カードを自動検出してヒーロー写真と連動 */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full overflow-x-auto hide-scrollbar pt-8 pb-4"
        >
          <div className="flex items-end justify-center md:justify-between gap-2.5 sm:gap-5 min-w-max md:min-w-0 px-4 md:px-0">
            {STORES_DATA.map((store, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={store.id}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  onClick={() => handleSelectStore(index)}
                  className={`cursor-pointer transition-all duration-300 rounded-2xl flex flex-col justify-between p-3 sm:p-4 text-left ${
                    isActive
                      ? 'w-[230px] sm:w-[260px] lg:w-[270px] bg-white ring-4 ring-[#e25c7b]/30 shadow-2xl border-2 border-[#d64567] -translate-y-6 z-30 scale-105'
                      : 'w-[160px] sm:w-[200px] lg:w-[210px] bg-white/80 border border-slate-200/80 shadow-sm opacity-60 hover:opacity-90 z-10'
                  }`}
                >
                  {/* 店舗夜景画像 */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                    <NextImage
                      src={store.image}
                      alt={store.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* 店舗名 */}
                  <div className="mb-2">
                    <div className="flex items-baseline gap-1.5">
                      <h3 className={`font-serif font-bold ${isActive ? 'text-lg sm:text-xl text-[#2b181c]' : 'text-sm sm:text-base text-slate-700'}`}>
                        {store.name}
                      </h3>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        {store.enName}
                      </span>
                    </div>

                    {/* キャッチコピー（アクティブ時またはPC表示時に表示） */}
                    <p className={`text-[10px] sm:text-xs font-medium text-slate-600 leading-relaxed mt-1 line-clamp-2 ${isActive ? 'block' : 'hidden sm:block opacity-80'}`}>
                      {store.catchphrase.replace('\n', ' ')}
                    </p>
                  </div>

                  {/* 在籍数 ＆ ボタン */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-rose-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      <span>在籍数</span>
                      <span className="text-slate-700 font-extrabold ml-1">セラピスト {store.castCount}名</span>
                    </div>

                    {/* この店舗を選ぶボタン */}
                    {store.isExternal ? (
                      <a
                        href={store.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#d64567] to-[#b8324f] text-white shadow-md hover:brightness-105'
                            : 'bg-rose-50 text-[#d64567] hover:bg-rose-100'
                        }`}
                      >
                        <span>この店舗を選ぶ</span>
                        <span>→</span>
                      </a>
                    ) : (
                      <Link
                        href={store.href}
                        className={`w-full py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#d64567] to-[#b8324f] text-white shadow-md hover:brightness-105'
                            : 'bg-rose-50 text-[#d64567] hover:bg-rose-100'
                        }`}
                      >
                        <span>この店舗を選ぶ</span>
                        <span>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ドットインジケーター (ピンク長丸 ＋ 丸) */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {STORES_DATA.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSelectStore(index)}
              className={`h-2 transition-all duration-300 rounded-full ${
                index === activeIndex ? 'w-6 bg-[#d64567]' : 'w-2 bg-rose-200 hover:bg-rose-300'
              }`}
              aria-label={`店舗 ${index + 1}`}
            />
          ))}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
