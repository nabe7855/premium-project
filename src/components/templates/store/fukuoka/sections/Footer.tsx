'use client';

import { useStore } from '@/contexts/StoreContext';
import { FooterConfig } from '@/lib/store/storeTopConfig';
import { resolveStoreLink } from '@/lib/utils/resolveStoreLink';
import { ImageIcon, Link2 } from 'lucide-react';
import NextImage from 'next/image';
import React from 'react';

interface FooterProps {
  config?: FooterConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  const { store } = useStore();

  if (!config) return null;

  const getAbsoluteHref = (href: any) => {
    return resolveStoreLink(href as string, store.slug, store.contact?.phone, store.contact?.line);
  };

  const handleShopInfoUpdate = (key: string, value: string) => {
    if (onUpdate) {
      onUpdate('footer', 'shopInfo', { ...config.shopInfo, [key]: value });
    }
  };

  const handleButtonUpdate = (index: number, value: string) => {
    if (onUpdate) {
      const newButtons = [...config.menuButtons];
      newButtons[index] = { ...newButtons[index], label: value };
      onUpdate('footer', 'menuButtons', newButtons);
    }
  };

  const handleBannerLabelUpdate = (type: 'banners' | 'smallBanners', index: number, value: string) => {
    if (onUpdate) {
      const banners = [...(config[type] || [])];
      banners[index] = { ...banners[index], label: value };
      onUpdate('footer', type, banners);
    }
  };

  const handleLinkUpdate = (key: string, index?: number) => {
    if (!onUpdate) return;

    let currentLink = '';
    const configValue = config[key as keyof FooterConfig] as any;

    if (typeof index === 'number') {
      currentLink = configValue[index]?.link || '';
    } else if (typeof configValue === 'object' && configValue !== null && 'link' in configValue) {
      currentLink = configValue.link || '';
    } else {
      currentLink = configValue || '';
    }

    const newLink = window.prompt(
      'リンクURLを入力してください:\n※ {slug} は店舗スラグ（fukuoka等）に自動置換されます',
      currentLink,
    );

    if (newLink !== null) {
      if (typeof index === 'number') {
        const newArray = [...configValue];
        newArray[index] = { ...newArray[index], link: newLink };
        onUpdate('footer', key, newArray);
      } else if (typeof configValue === 'object' && configValue !== null && 'link' in configValue) {
        onUpdate('footer', key, { ...configValue, link: newLink });
      } else {
        onUpdate('footer', key, newLink);
      }
    }
  };

  const adjustedMenuButtons = config.menuButtons.map((btn) => {
    if (btn.label.includes('料金') || btn.label.includes('コース')) {
      return { ...btn, link: `/store/${store.slug}/price` };
    }
    if (btn.label.includes('LINE') || btn.label.includes('ライン')) {
      return { ...btn, link: store.contact?.line || btn.link };
    }
    return btn;
  });

  return (
    <footer id="footer" className="border-Pink-100 border-t bg-[#EE827C] pt-8 pb-32 text-slate-800">
      <div className="mx-auto max-w-[1000px] px-4">
        {/* Main Content Area */}
        <div className="flex flex-col gap-10 md:flex-row">
          {/* Left: Store Image Wrapper (Removed) & Shop Info */}
          <div className="w-full flex-shrink-0 md:w-[240px]">
            {/* Shop Info Box Below Logo */}
            <div className="mt-4 overflow-hidden rounded-md border border-neutral-800">
              <div className="bg-[#333] px-3 py-1.5 text-center text-[13px] font-bold tracking-widest text-white">
                <span>{store.name || config.shopInfo?.name}</span>
              </div>
              <div className="space-y-3 bg-white p-4 text-xs leading-relaxed">
                <div className="flex gap-3">
                  <span className="w-24 flex-shrink-0 font-bold text-slate-700">店舗電話番号</span>
                  <span className="font-bold">{store.contact?.phone || config.shopInfo?.phone}</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-24 flex-shrink-0 font-bold text-slate-700">受付時間</span>
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {store.receptionHours || config.shopInfo?.receptionHours || '8:00〜23:00'}
                    </span>
                    <span className="mt-1 text-[10px] text-slate-500">
                      ※あくまでも{(() => {
                        const hours = store.receptionHours || config.shopInfo?.receptionHours || '8:00〜23:00';
                        const match = hours.match(/(\d{1,2}):(\d{2})$/);
                        if (match) {
                          const [_, h, m] = match;
                          return m === '00' ? `${h}時` : `${h}時${m}分`;
                        }
                        return '23時';
                      })()}までの受付になり、それ以降のお申込みは翌日に対応をさせて頂きます。
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-24 flex-shrink-0 font-bold text-slate-700">営業時間</span>
                  <span className="whitespace-pre-line font-bold">
                    {store.businessHours || config.shopInfo?.businessHours || '年中無休'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Buttons and Banners */}
          <nav className="flex-grow" aria-label="店舗情報案内">
            {/* Grid of buttons */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {adjustedMenuButtons.map((btn, idx) => (
                <div key={idx} className="group relative">
                  <a
                    href={getAbsoluteHref(btn.link || '#')}
                    onClick={(e) => isEditing && e.preventDefault()}
                    className="flex h-12 items-center justify-center rounded-md bg-[#333] px-2 text-center text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#444]"
                  >
                    <span
                      contentEditable={isEditing}
                      suppressContentEditableWarning={isEditing}
                      onBlur={(e) => handleButtonUpdate(idx, e.currentTarget.innerText)}
                      className={isEditing ? 'cursor-text px-1 outline-none' : ''}
                    >
                      {btn.label}
                    </span>
                  </a>
                  {isEditing && (
                    <button
                      onClick={() => handleLinkUpdate('menuButtons', idx)}
                      className="absolute -right-1 -top-1 z-10 hidden rounded-full bg-white p-1 text-slate-800 shadow-sm transition-opacity group-hover:block"
                      aria-label="リンクを編集"
                    >
                      <Link2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Banners Area */}
            <div className="mt-10 overflow-hidden rounded-2xl">
              <div className="grid grid-cols-2 gap-3 gap-y-7 md:gap-x-4 md:gap-y-8">
                {[...(config.banners || []), ...(config.smallBanners || [])].map((banner, idx) => {
                  let bannerLink = getAbsoluteHref(banner.link || '#');
                  if (bannerLink.startsWith('tel:') && store.contact?.phone) {
                    bannerLink = `tel:${store.contact.phone.replace(/-/g, '')}`;
                  }
                  return (
                    <div key={idx} className="group relative flex flex-col items-start">
                      <a
                        href={bannerLink}
                        onClick={(e) => isEditing && e.preventDefault()}
                        aria-label={banner.label || 'バナー'}
                        className="block w-full overflow-hidden rounded-[10px] bg-white shadow-sm transition-opacity hover:opacity-90"
                      >
                        <NextImage
                          src={getAbsoluteHref(banner.imageUrl)}
                          alt=""
                          width={180}
                          height={100}
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="h-auto w-full"
                          loading="lazy"
                        />
                      </a>

                      <div className="mt-2.5 flex w-full items-start gap-1 text-left text-slate-900 decoration-slate-900/80 transition-opacity hover:opacity-80">
                        <span
                          contentEditable={isEditing}
                          suppressContentEditableWarning={isEditing}
                          onBlur={(e) => {
                            const isSmall = idx >= (config.banners?.length || 0);
                            const realIdx = isSmall ? idx - (config.banners?.length || 0) : idx;
                            handleBannerLabelUpdate(
                              isSmall ? 'smallBanners' : 'banners',
                              realIdx,
                              e.currentTarget.innerText,
                            );
                          }}
                          className={`text-[13px] font-medium leading-tight underline decoration-1 underline-offset-[3px] md:text-sm ${
                            isEditing ? 'cursor-text px-1 outline-none hover:bg-black/10' : ''
                          }`}
                        >
                          {banner.label || 'バナータイトル'}
                        </span>
                        <a
                          href={getAbsoluteHref(banner.link || '#')}
                          onClick={(e) => isEditing && e.preventDefault()}
                          aria-label={`${banner.label || 'バナー'}の詳細を見る`}
                        >
                          <Link2 className="mt-[2px] h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={2.5} />
                        </a>
                      </div>

                      {isEditing && (
                        <div className="absolute inset-0 top-0 mb-8 flex items-center justify-center gap-2 rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <label className="cursor-pointer rounded-full bg-white/90 p-1.5 text-slate-800" aria-label="画像をアップロード">
                            <ImageIcon className="h-4 w-4" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                if (!e.target.files?.[0]) return;
                                const isSmall = idx >= (config.banners?.length || 0);
                                const realIdx = isSmall ? idx - (config.banners?.length || 0) : idx;
                                onImageUpload?.(
                                  'footer',
                                  e.target.files[0],
                                  realIdx,
                                  isSmall ? 'smallBanners' : 'banners',
                                );
                              }}
                            />
                          </label>
                          <button
                            onClick={() => {
                              const isSmall = idx >= (config.banners?.length || 0);
                              const realIdx = isSmall ? idx - (config.banners?.length || 0) : idx;
                              handleLinkUpdate(isSmall ? 'smallBanners' : 'banners', realIdx);
                            }}
                            className="cursor-pointer rounded-full bg-white/90 p-1.5 text-slate-800"
                            aria-label="リンクを編集"
                          >
                            <Link2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Large Square Banner */}
              <div className="mt-8 border-t border-white/20 pt-8">
                <div className="relative mx-auto aspect-square max-w-[400px]">
                  <div className="group relative h-full w-full">
                    <a
                      href={getAbsoluteHref(config.largeBanner?.link || '#')}
                      onClick={(e) => isEditing && e.preventDefault()}
                      aria-label="キャンペーン詳細を見る"
                      className="relative block h-full w-full overflow-hidden rounded-xl bg-white shadow-xl"
                    >
                      <NextImage
                        src={getAbsoluteHref(
                          config.largeBanner?.imageUrl || 'https://placehold.jp/400x400.png?text=Large%20Banner',
                        )}
                        alt="Large Banner"
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 90vw, 400px"
                      />
                    </a>
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <label className="cursor-pointer rounded-full bg-white/90 p-2 text-slate-800" aria-label="画像をアップロード">
                          <ImageIcon className="h-5 w-5" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              e.target.files?.[0] && onImageUpload?.('footer', e.target.files[0], undefined, 'largeBanner')
                            }
                          />
                        </label>
                        <button
                          onClick={() => handleLinkUpdate('largeBanner')}
                          className="cursor-pointer rounded-full bg-white/90 p-2 text-slate-800"
                          aria-label="リンクを編集"
                        >
                          <Link2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Bottom Copyright */}
          <div className="mt-12 border-t border-slate-100/30 pt-6 pb-20 text-center">
            <p className="flex flex-col items-center justify-center gap-2 text-[10px] tracking-widest text-slate-800 md:flex-row md:gap-4">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => onUpdate?.('footer', 'copyright', e.currentTarget.innerText)}
                className={isEditing ? 'px-1 hover:bg-white/10' : ''}
              >
                {config.copyright}
              </span>
              {!isEditing && (
                <a href="/store/fukuoka/links" className="underline decoration-slate-800/30 hover:text-white transition-colors">
                  相互リンク
                </a>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
