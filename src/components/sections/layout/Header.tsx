'use client';

import { ChevronDown, Mail, MapPin, Menu, MessageCircle, Phone, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { primaryNavItems, secondaryNavItems } from '@/components/sections/layout/NavItems';
import { stores } from '@/data/stores';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  const match = pathname.match(/^\/store\/([^/]+)/);
  const currentStoreId = match?.[1] ?? 'tokyo';
  const currentStore = stores[currentStoreId];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStoreChange = (newStoreId: string) => {
    const pagePath = pathname.replace(/^\/store\/[^/]+/, '');
    router.push(`/store/${newStoreId}${pagePath}`);
    closeMenu();
  };

  const closeMenu = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsAnimating(false);
    }, 400);
  };

  const BackgroundDecoration = () => (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* 背景のドットパターン */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#f9a8d4 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      ></div>
      {/* ほのかなグラデーションの重なり */}
      <div className="absolute left-[-10%] top-[10%] h-[80%] w-[120%] bg-[radial-gradient(circle_at_center,rgba(255,245,245,0.8)_0%,transparent_70%)] opacity-50 blur-3xl"></div>
    </div>
  );

  const renderNavItem = (item: any, isCard: boolean = false) => {
    const href = item.isAbsolute ? item.href : `/store/${currentStoreId}${item.href}`;

    if (isCard) {
      return (
        <Link
          key={item.href}
          href={href}
          onClick={closeMenu}
          className="group relative flex flex-col items-center justify-center gap-5 rounded-[48px] border border-transparent bg-white px-2 py-9 shadow-[0_12px_24px_-8px_rgba(219,39,119,0.12)] transition-all hover:shadow-xl active:scale-95"
        >
          {item.name === 'はじめての方へ' && currentStoreId === 'fukuoka' ? (
            <div className="flex h-24 w-24 items-center justify-center transition-transform group-hover:scale-110">
              <img
                src="/福岡初めての方へ.png"
                alt={item.name}
                className="h-full w-full object-contain"
              />
            </div>
          ) : item.name === 'セラピスト一覧' && currentStoreId === 'fukuoka' ? (
            <div className="flex h-24 w-24 items-center justify-center transition-transform group-hover:scale-110">
              <img
                src="/福岡セラピスト一覧.png"
                alt={item.name}
                className="h-full w-full object-contain"
              />
            </div>
          ) : item.name === '本日の出勤情報' && currentStoreId === 'fukuoka' ? (
            <div className="flex h-24 w-24 items-center justify-center transition-transform group-hover:scale-110">
              <img
                src="/福岡出勤情報.png"
                alt={item.name}
                className="h-full w-full object-contain"
              />
            </div>
          ) : item.name === 'おすすめホテル一覧' && currentStoreId === 'fukuoka' ? (
            <div className="flex h-24 w-24 items-center justify-center transition-transform group-hover:scale-110">
              <img
                src="/福岡おすすめホテル一覧.png"
                alt={item.name}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FCF0F2] text-[#B1354E] transition-transform group-hover:scale-110">
              <item.icon size={28} strokeWidth={1.5} />
            </div>
          )}
          <span className="px-1 text-center text-[15px] font-bold tracking-wider text-[#4A4A4A]">
            {item.name}
          </span>
          {item.hasUpdate && (
            <div className="absolute right-8 top-6 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#D43D6F] shadow-sm"></div>
          )}
        </Link>
      );
    }

    return (
      <Link
        key={item.href}
        href={href}
        onClick={closeMenu}
        className={`group flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99] ${
          pathname.endsWith(item.href) ? 'border-pink-200 bg-pink-50/30' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="text-[#C5A059] group-hover:text-pink-600">
            <item.icon size={18} />
          </div>
          <span className="text-sm font-bold text-[#4A2B2F]">{item.name}</span>
          {item.hasUpdate && <span className="h-1.5 w-1.5 rounded-full bg-pink-200"></span>}
        </div>
        <ChevronDown size={16} className="-rotate-90 text-gray-200 group-hover:text-pink-600" />
      </Link>
    );
  };

  // 表示順を画像に合わせるためのマッピング
  const orderedItems = [
    primaryNavItems.find((i) => i.name === 'はじめての方へ'),
    primaryNavItems.find((i) => i.name === 'おすすめホテル一覧'),
    primaryNavItems.find((i) => i.name === 'セラピスト一覧'),
    primaryNavItems.find((i) => i.name === '本日の出勤情報'),
    primaryNavItems.find((i) => i.name === '口コミ・レビュー'),
    primaryNavItems.find((i) => i.name === '写メ日記（更新中）'),
  ].filter(Boolean);

  const remainingPrimaryItems = primaryNavItems.filter(
    (i) => !orderedItems.includes(i) && i.name !== '動画',
  );
  const filteredSecondaryItems = secondaryNavItems.filter(
    (i) =>
      i.name !== '求人・採用情報' &&
      i.name !== 'お問い合わせ' &&
      i.name !== '最新のお知らせ' &&
      i.name !== 'メディア取材のご連絡' &&
      i.name !== 'プライバシーポリシー',
  );

  const newsItem = secondaryNavItems.find((i) => i.name === '最新のお知らせ');

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow ${
        scrollY > 10 ? 'bg-white/80 shadow-md backdrop-blur' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <span className="text-2xl">🍓</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black leading-none tracking-tight text-[#D43D6F]">
              Strawberry Boys
            </span>
            <div className="flex items-center gap-2 font-light text-gray-400 sm:gap-3">
              <span className="text-sm sm:text-xl">|</span>
              <span className="text-sm font-medium text-[#4A5568] sm:text-xl">
                {currentStore?.displayName ?? '店舗を選択'} {currentStore?.emoji ?? ''}
              </span>
            </div>
          </div>
        </Link>

        <button
          onClick={() => {
            if (!isMenuOpen) setIsMenuOpen(true);
            else closeMenu();
          }}
          className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50/50 text-pink-600 transition-all hover:bg-pink-100 active:scale-90 md:hidden"
          aria-label="メニューを開閉"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          {isMenuOpen && (
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-pink-600"></span>
          )}
        </button>

        <nav className="hidden items-center gap-4 md:flex">
          {primaryNavItems.slice(0, 4).map((item) => {
            const href = item.isAbsolute ? item.href : `/store/${currentStoreId}${item.href}`;
            return (
              <Link
                key={item.href}
                href={href}
                className={`flex items-center gap-2 px-2 py-1 transition-colors duration-200 hover:text-pink-600 ${
                  pathname.endsWith(item.href) ? 'font-semibold text-pink-600' : ''
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 hover:text-pink-600"
              aria-haspopup="true"
              aria-expanded={isStoreDropdownOpen}
            >
              <MapPin size={18} />
              {currentStore?.displayName ?? '店舗を選択'} <ChevronDown size={16} />
            </button>

            {isStoreDropdownOpen && (
              <div className="animate-fadeIn absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-md border bg-white shadow-lg">
                {Object.values(stores).map((store) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreChange(store.id)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-pink-100"
                  >
                    {store.emoji} {store.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* モバイルメニュー */}
      {(isMenuOpen || isAnimating) &&
        typeof window !== 'undefined' &&
        createPortal(
          <>
            <div
              onClick={closeMenu}
              className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
            />

            <div
              className={`fixed inset-0 z-[9999] overflow-y-auto bg-white transition-all duration-500 ${
                isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
              }`}
              style={{ top: '64px' }}
            >
              <BackgroundDecoration />

              <div className="relative z-10 mx-auto max-w-md space-y-10 px-5 py-8 pb-40">
                {/* 店舗選択 */}
                <section>
                  <button
                    onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 text-[#4A2B2F] shadow-sm transition-colors active:bg-pink-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                        <MapPin size={18} />
                      </div>
                      <span className="text-[15px] font-bold tracking-wider">店舗を選ぶ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-sm font-medium text-pink-600">
                        {currentStore?.displayName}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`text-pink-600 transition-transform duration-300 ${isStoreDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${isStoreDropdownOpen ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="grid grid-cols-2 gap-2 px-1">
                      {Object.values(stores).map((store) => (
                        <button
                          key={store.id}
                          onClick={() => handleStoreChange(store.id)}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm transition-all ${currentStoreId === store.id ? 'border-pink-200 bg-pink-50 ring-1 ring-pink-200' : 'border-gray-100 bg-white hover:border-pink-200'}`}
                        >
                          <span className="text-xl">{store.emoji}</span>
                          <span className="text-sm font-bold text-[#4A2B2F]">
                            {store.displayName}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 最新のお知らせ (横長カード) */}
                {newsItem && (
                  <section>
                    <Link
                      href={newsItem.href}
                      onClick={closeMenu}
                      className="group relative flex items-center gap-6 overflow-hidden rounded-[48px] border border-pink-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-lg active:scale-[0.98]"
                    >
                      {currentStoreId === 'fukuoka' ? (
                        <div className="flex h-20 w-20 items-center justify-center transition-transform group-hover:scale-110">
                          <img
                            src="/福岡お知らせ.png"
                            alt="News"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF5F5] text-[#D43D6F] transition-transform group-hover:scale-110">
                          <newsItem.icon size={28} strokeWidth={1.5} />
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-[17px] font-black tracking-tight text-[#4A2B2F]">
                          {newsItem.name}
                        </span>
                        {newsItem.hasUpdate && (
                          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-pink-400"></span>
                        )}
                      </div>
                      <ChevronDown
                        size={20}
                        className="ml-auto -rotate-90 text-gray-200 transition-colors group-hover:text-[#D43D6F]"
                      />
                    </Link>
                  </section>
                )}

                {/* メインナビゲーション (カードスタイル) */}
                <section>
                  <div className="grid grid-cols-2 gap-4">
                    {orderedItems.map((item) => renderNavItem(item, true))}
                  </div>
                </section>

                {/* サブナビゲーション (リストスタイル) */}
                <section className="space-y-2">
                  {[...remainingPrimaryItems, ...filteredSecondaryItems].map((item) =>
                    renderNavItem(item, false),
                  )}
                </section>

                {/* CTA セクション */}
                <section className="space-y-4 pt-6">
                  {/* プライバシーポリシー */}
                  <a
                    href="/Announcement-information/policy"
                    className="flex w-full items-center gap-4 rounded-lg bg-[#9CA3AF] px-6 py-4 text-white shadow-md transition-all active:scale-95"
                  >
                    <div className="flex h-12 w-12 items-center justify-center transition-transform group-hover:scale-110">
                      <img
                        src="/プライバシーポリシー.png"
                        alt="Privacy Policy"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="flex-1 text-center text-lg font-black tracking-widest">
                      プライバシーポリシー
                    </span>
                  </a>

                  {/* メディア取材のご連絡 */}
                  <a
                    href="/media-contact"
                    className="flex w-full items-center gap-4 rounded-lg bg-[#C5A059] px-6 py-4 text-white shadow-md transition-all active:scale-95"
                  >
                    <div className="rounded-lg bg-white/20 p-1.5">
                      <Mail size={24} />
                    </div>
                    <span className="flex-1 text-center text-lg font-black tracking-widest">
                      メディア取材のご連絡
                    </span>
                  </a>

                  <a
                    href="#"
                    className="flex w-full items-center gap-4 rounded-xl border-b-4 border-[#C8A811] bg-[#FAD231] px-6 py-4 text-black shadow-lg transition-all hover:brightness-105 active:translate-y-[4px] active:border-b-0"
                  >
                    <Users size={32} strokeWidth={1.5} className="text-black" />
                    <span className="flex-1 pr-8 text-center text-[17px] font-black tracking-widest">
                      女風求人情報
                    </span>
                  </a>

                  <a
                    href="#"
                    className="flex w-full items-center gap-4 rounded-lg bg-[#06C755] px-6 py-3 text-white shadow-md transition-all active:scale-95"
                  >
                    <div className="rounded-lg bg-white/20 p-2">
                      <MessageCircle size={24} />
                    </div>
                    <div className="flex-1 text-center">
                      <p className="mb-1 text-[13px] font-bold leading-none opacity-90">
                        ラインで問い合わせる
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-black text-[#06C755]">
                          ID
                        </span>
                        <span className="text-sm font-black tracking-tight">best.follows</span>
                      </div>
                    </div>
                  </a>

                  <div className="space-y-3 rounded-lg border-2 border-[#3C8296]/30 bg-white p-4 shadow-md">
                    <div className="flex items-center justify-center gap-3 text-[#3C8296]">
                      <Phone size={24} />
                      <span className="text-3xl font-black tracking-tighter">03-6356-3860</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[11px] font-bold text-gray-500">
                      <p>電話受付: 12:00〜23:00</p>
                      <p>営業時間: 12:00〜翌朝4時</p>
                    </div>
                  </div>
                </section>

                {/* バナー */}
                <section className="pb-12 pt-4">
                  <a
                    href="#"
                    className="group relative block aspect-[16/6] overflow-hidden rounded-2xl shadow-xl"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?q=80&w=800&auto=format&fit=crop"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Special Banner"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#4A2B2F]/90 via-[#4A2B2F]/20 to-transparent p-5">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white opacity-90">
                        Strawberry Boys Premium
                      </p>
                      <h3 className="text-lg font-black tracking-tight text-white drop-shadow-md">
                        甘い誘惑を、今夜貴女に。
                      </h3>
                    </div>
                  </a>
                </section>
              </div>
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
