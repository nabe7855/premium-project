'use client';

import { ChevronDown, MapPin, Menu, X } from 'lucide-react';
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
    }, 400); // アニメーション時間に合わせる
  };

  const renderNavItem = (item: any, index: number) => {
    const href = item.isAbsolute ? item.href : `/store/${currentStoreId}${item.href}`;
    return (
      <Link
        key={item.href}
        href={href}
        onClick={closeMenu}
        className={`fade-slide-in-x flex items-center gap-2 px-2 py-1 transition-colors duration-200 hover:text-pink-600 fade-slide-in-x-delayed-${index + 1} ${
          pathname.endsWith(item.href) ? 'font-semibold text-pink-600' : ''
        }`}
        aria-label={item.name}
      >
        <item.icon size={18} />
        <span className="text-sm">{item.name}</span>
        {item.hasUpdate && (
          <span className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
        )}
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow ${
        scrollY > 10 ? 'bg-white/80 shadow-md backdrop-blur' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-pink-600 transition-transform hover:scale-105"
        >
          <span>🍓 Strawberry Boys</span>
          <span className="text-sm font-normal text-gray-500">
            | {currentStore?.displayName ?? '店舗を選択'} {currentStore?.emoji ?? ''}
          </span>
        </Link>

        <button
          onClick={() => {
            if (!isMenuOpen) setIsMenuOpen(true);
            else closeMenu();
          }}
          className="text-gray-700 transition-colors hover:text-pink-600 md:hidden"
          aria-label="メニューを開閉"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden items-center gap-4 md:flex">
          {primaryNavItems.map((item, index) => renderNavItem(item, index))}

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
              <div className="animate-fadeIn absolute right-0 z-50 mt-2 w-48 rounded-md border bg-white shadow-lg">
                {Object.values(stores).map((store) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreChange(store.id)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-pink-100"
                  >
                    {store.emoji} {store.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* モバイルメニュー（ポータル化して body 直下に出す） */}
      {(isMenuOpen || isAnimating) &&
        typeof window !== 'undefined' &&
        createPortal(
          <>
            {/* 背景オーバーレイ */}
            <div
              onClick={closeMenu}
              className={`fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* メニュー本体 */}
            <div
              className={`fixed right-0 top-0 z-[9999] h-full w-[40%] max-w-xs bg-white shadow-xl transition-all will-change-transform ${isAnimating ? 'animate-floatFadeOutRight' : 'animate-floatFadeInRight'} `}
            >
              <button
                onClick={closeMenu}
                className="absolute right-4 top-4 text-gray-600 hover:text-pink-500"
                aria-label="メニューを閉じる"
              >
                <X size={24} />
              </button>

              <div className="h-full overflow-y-auto p-4">
                <div className="mb-4 border-b pb-2">
                  <div className="mb-1 text-sm text-gray-500">店舗を選ぶ</div>
                  {Object.values(stores).map((store) => (
                    <button
                      key={store.id}
                      onClick={() => handleStoreChange(store.id)}
                      className="block w-full px-2 py-1 text-left text-sm hover:bg-pink-100"
                    >
                      {store.emoji} {store.displayName}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 border-b pb-2">
                  {primaryNavItems.map((item, index) => renderNavItem(item, index))}
                </div>

                <div className="mt-2 pt-2">
                  {secondaryNavItems.map((item, index) => renderNavItem(item, index + 5))}
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
