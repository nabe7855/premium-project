'use client';

import { HeaderConfig } from '@/lib/store/storeTopConfig';
import { Camera, ChevronDown, Menu, Phone, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { stores } from '@/data/stores';

interface HeaderProps {
  config?: HeaderConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

export default function Header({ config, isEditing, onUpdate, onImageUpload }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  const match = pathname.match(/^\/store\/([^/]+)/);
  const currentStoreId = (match?.[1] ?? '') as string;
  const currentStore = stores[currentStoreId];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!config || (!config.isVisible && !isEditing)) return null;

  const navLinks = config.navLinks;

  const handleStoreChange = (newStoreId: string) => {
    const pagePath = pathname.replace(/^\/store\/[^/]+/, '');
    router.push(`/store/${newStoreId}${pagePath}`);
    closeMenu();
  };

  const adjustLinks = (links: any[]) => {
    return links.map((link) => {
      let href = link.href;

      // {slug} プレースホルダーを置換
      if (href && typeof href === 'string') {
        href = href.replace(/\{slug\}/g, currentStoreId);
      }

      // '#' で始まる内部リンク、または '/price' などの相対パスを調整
      if (href === '#price' || link.name.includes('料金')) {
        href = `/store/${currentStoreId}/price`;
      } else if (
        href === '#faq' ||
        link.name.toLowerCase().includes('qa') ||
        link.name.includes('よくあるご質問')
      ) {
        href = `/store/${currentStoreId}#faq`;
      } else if (
        href === '#campaign' ||
        link.name.includes('ニュース') ||
        link.name.includes('キャンペーン') ||
        link.name.includes('最新情報')
      ) {
        href = `/store/${currentStoreId}#campaign`;
      }

      return { ...link, href };
    });
  };

  const adjustedNavLinks = adjustLinks(navLinks);

  const closeMenu = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsAnimating(false);
    }, 300); // 300msで閉じ切る
  };

  const triggerImageUpload = (index: number) => {
    if (!isEditing || !onImageUpload) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImageUpload('header', file, index, 'navLinks');
      }
    };
    input.click();
  };

  const triggerLogoUpload = () => {
    if (!isEditing || !onImageUpload) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImageUpload('header', file, 0, 'logoUrl');
      }
    };
    input.click();
  };

  const BackgroundDecoration = () => (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#f9a8d4 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      ></div>
      <div className="absolute left-[-10%] top-[10%] h-[80%] w-[120%] bg-[radial-gradient(circle_at_center,rgba(255,245,245,0.8)_0%,transparent_70%)] opacity-50 blur-3xl"></div>
    </div>
  );

  const renderNavItem = (item: any, idx: number, type: 'highlight' | 'grid' | 'full' = 'grid') => {
    if (type === 'highlight') {
      return (
        <div
          key={item.href}
          className="group relative overflow-hidden rounded-[40px] bg-transparent shadow-[0_12px_24px_-8px_rgba(219,39,119,0.12)] transition-all hover:shadow-xl active:scale-[0.98]"
          style={{
            backgroundImage: 'url("/ハンバーガーメニュー横長背景.png")',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
          }}
        >
          <Link href={item.href} onClick={closeMenu} className="flex items-center gap-6 px-4 py-6">
            <div className="animate-bounce-slow relative h-24 w-24 flex-shrink-0">
              {item.imageUrl && (
                <img src={item.imageUrl} alt="" className="h-full w-full object-contain" />
              )}
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    triggerImageUpload(idx);
                  }}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>
            <div className="flex-grow">
              <span
                className="text-xl font-black tracking-widest text-[#4A4A4A] outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => {
                  if (!isEditing) return;
                  const newLinks = [...navLinks];
                  newLinks[idx] = { ...newLinks[idx], name: e.currentTarget.innerText };
                  onUpdate?.('header', 'navLinks', newLinks);
                }}
              >
                {item.name}
              </span>
              <div className="mt-1 flex h-2 w-2 rounded-full bg-pink-400" />
            </div>
            <ChevronDown size={24} className="-rotate-90 text-pink-200" />
          </Link>
        </div>
      );
    }

    if (type === 'full') {
      const getButtonColor = (name: string) => {
        if (name.includes('プライバシー')) return 'bg-[#9BA3AF] border-[#818B9A]';
        if (name.includes('メディア')) return 'bg-[#C5A368] border-[#A88B5A]';
        if (name.includes('求人')) return 'bg-[#FAD231] border-[#C8A811]';
        if (name.includes('ライン') || name.includes('LINE'))
          return 'bg-[#56C361] border-[#3E9A47]';
        return 'bg-pink-500 border-pink-600';
      };

      const colorClass = getButtonColor(item.name);
      const isYellow = item.name.includes('求人');

      return (
        <div key={item.href} className="transition-transform active:translate-y-[2px]">
          <Link
            href={item.href}
            onClick={closeMenu}
            className={
              item.imageUrl
                ? 'block w-full overflow-hidden rounded-2xl shadow-lg'
                : `flex w-full items-center gap-4 rounded-2xl border-b-[6px] ${colorClass} px-6 py-4 shadow-lg`
            }
          >
            {item.imageUrl ? (
              <div className="relative aspect-[4/1] w-full">
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain" />
              </div>
            ) : (
              <>
                <div className="h-10 w-10 flex-shrink-0">
                  <Users className={isYellow ? 'text-black' : 'text-white'} size={32} />
                </div>
                <span
                  className={`flex-1 text-center text-lg font-black tracking-widest outline-none ${isYellow ? 'text-black' : 'text-white'}`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => {
                    if (!isEditing) return;
                    const newLinks = [...navLinks];
                    newLinks[idx] = { ...newLinks[idx], name: e.currentTarget.innerText };
                    onUpdate?.('header', 'navLinks', newLinks);
                  }}
                >
                  {item.name}
                </span>
              </>
            )}
          </Link>
        </div>
      );
    }

    // Default Grid
    return (
      <div
        key={item.href}
        className="group relative flex flex-col items-center justify-center gap-2 rounded-[40px] bg-transparent px-2 py-8 shadow-[0_12px_24px_-8px_rgba(219,39,119,0.12)] transition-all hover:shadow-xl active:scale-95"
        style={{
          backgroundImage: 'url("/ハンバーガーメニュー背景.png")',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
        }}
      >
        <Link href={item.href} onClick={closeMenu} className="flex w-full flex-col items-center">
          <div className="relative mb-4 h-28 w-28 flex-shrink-0 transition-transform group-hover:scale-105">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-3xl bg-pink-50">
                <span className="text-2xl font-bold text-pink-300">{item.name.charAt(0)}</span>
              </div>
            )}
            {isEditing && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  triggerImageUpload(idx);
                }}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Camera size={20} />
              </button>
            )}
          </div>
          <span
            className="px-2 text-center text-[15px] font-bold tracking-wider text-[#4A4A4A] outline-none"
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => {
              if (!isEditing) return;
              const newLinks = [...navLinks];
              newLinks[idx] = { ...newLinks[idx], name: e.currentTarget.innerText };
              onUpdate?.('header', 'navLinks', newLinks);
            }}
          >
            {item.name}
          </span>
        </Link>
      </div>
    );
  };

  return (
    <header
      className={`fixed top-0 z-[100] w-full transition-all duration-300 ${
        scrollY > 20 ? 'bg-white/95 py-2 shadow-sm backdrop-blur-md' : 'bg-white py-4'
      } ${!config.isVisible && isEditing ? 'opacity-40' : ''}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link
          href="/"
          className="group relative flex items-center gap-2 transition-transform hover:scale-[1.02]"
        >
          {config.logoUrl ? (
            <img src={config.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          ) : (
            <>
              <span className="text-3xl drop-shadow-sm filter">🍓</span>
              <span
                className="font-serif text-2xl font-black italic tracking-tighter text-[#D43D6F] outline-none drop-shadow-sm"
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => onUpdate?.('header', 'logoText', e.currentTarget.innerText)}
              >
                {config.logoText}
              </span>
            </>
          )}

          {isEditing && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                triggerLogoUpload();
              }}
              className="absolute -right-8 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Camera size={16} />
            </button>
          )}
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Header Banner Image (Horizontal) */}
          <Link
            href={config.specialBanner?.link || `/store/${currentStoreId}/first-time`}
            className="hidden h-12 w-auto overflow-hidden rounded-lg transition-transform hover:scale-[1.02] active:scale-95 sm:block md:h-16"
          >
            <img
              src={config.specialBanner?.imageUrl || '/初めてのお客様へバナー.png'}
              alt="Recruit Banner"
              className="h-full w-full object-cover"
            />
          </Link>
          <Link
            href={config.specialBanner?.link || `/store/${currentStoreId}/first-time`}
            className="block h-12 w-auto overflow-hidden rounded-md transition-transform hover:scale-[1.02] active:scale-95 sm:hidden"
          >
            <img
              src={config.specialBanner?.imageUrl || '/初めてのお客様へバナー.png'}
              alt="Recruit Banner"
              className="h-full w-full object-cover"
            />
          </Link>

          <a
            href={`tel:${(config.phoneNumber || '03-6356-3860').replace(/-/g, '')}`}
            className="hidden whitespace-nowrap rounded-full bg-gradient-to-r from-[#D43D6F] to-[#FF6B95] px-6 py-2.5 text-sm font-black tracking-widest text-white shadow-lg shadow-pink-100 transition-all hover:scale-105 active:scale-95 sm:flex items-center gap-2"
          >
            <Phone size={18} />
            <span>電話</span>
          </a>

          <button
            onClick={() => {
              if (!isMenuOpen) setIsMenuOpen(true);
              else closeMenu();
            }}
            className={`flex flex-col items-center justify-center gap-1 rounded-full px-5 py-3 transition-all active:scale-95 md:gap-1.5 md:px-6 md:py-4 ${
              isMenuOpen
                ? 'bg-pink-50 text-pink-500'
                : 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isMenuOpen ? (
              <X size={24} className="md:h-7 md:w-7" />
            ) : (
              <Menu size={24} className="md:h-7 md:w-7" />
            )}
            <span className="text-xs font-black tracking-wider md:text-sm">
              {isMenuOpen ? '閉じる' : 'MENU'}
            </span>
          </button>
        </div>
      </div>

      {/* モバイルメニューオーバーレイ */}
      {(isMenuOpen || isAnimating) &&
        typeof window !== 'undefined' &&
        createPortal(
          <>
            <div
              className={`fixed inset-0 z-[9999] overflow-y-auto bg-white transition-all duration-300 ${
                isAnimating ? 'translate-y-full' : 'translate-y-0'
              }`}
              style={{ top: '0' }}
            >
              {/* Menu Header (Sticky) */}
              <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-6 py-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black italic text-[#D43D6F]">
                    {config.logoText}
                  </span>
                </div>
                <button onClick={closeMenu} className="rounded-full bg-pink-50 p-2 text-pink-500">
                  <X size={24} />
                </button>
              </div>

              <div className="relative min-h-screen pb-32 pt-4">
                <BackgroundDecoration />

                <div className="relative z-10 mx-auto max-w-md space-y-6 px-5">
                  {/* Highlights (News) */}
                  {adjustedNavLinks[0] && renderNavItem(adjustedNavLinks[0], 0, 'highlight')}

                  {/* Main Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {adjustedNavLinks
                      .slice(1, 9)
                      .map((item, idx) => renderNavItem(item, idx + 1, 'grid'))}
                  </div>

                  {/* Secondary Buttons */}
                  <div className="space-y-4 pt-4">
                    {adjustedNavLinks
                      .slice(9)
                      .map((item, idx) => renderNavItem(item, idx + 9, 'full'))}
                  </div>

                  {/* Phone Section */}
                  <div className="rounded-[40px] border border-pink-50/50 bg-white p-8 text-center shadow-[0_12px_24px_-8px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex items-center justify-center gap-2 text-[#D43D6F] sm:gap-4">
                        <div className="shrink-0 rounded-full bg-pink-50 p-2.5 ring-8 ring-pink-50/30 sm:p-3">
                          <svg
                            width="20"
                            height="20"
                            className="sm:h-6 sm:w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <span className="whitespace-nowrap text-2xl font-black tabular-nums tracking-tighter sm:text-4xl">
                          {config.phoneNumber || '03-6356-3860'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-400">
                        電話受付: {config.receptionHours || '12:00〜23:00'}
                      </p>
                      <p className="text-sm font-bold text-gray-400">
                        営業時間: {config.businessHours || '12:00〜翌朝4時'}
                      </p>
                    </div>
                  </div>

                  {/* Menu Bottom Banner */}
                  <div className="overflow-hidden rounded-[40px] bg-neutral-900 shadow-2xl transition-transform active:scale-[0.98]">
                    <Link
                      href={config.menuBottomBanner?.link || '#recruit'}
                      onClick={closeMenu}
                      className="group relative block aspect-[16/7]"
                    >
                      <img
                        src={config.menuBottomBanner?.imageUrl || '/福岡募集バナー.png'}
                        alt="Menu Bottom Banner"
                        className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                          {config.menuBottomBanner?.subHeading || 'Strawberry Boys Premium'}
                        </p>
                        <h3 className="text-xl font-black leading-tight text-white">
                          {config.menuBottomBanner?.mainHeading || '甘い誘惑を、今夜貴女に。'}
                        </h3>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </header>
  );
}
