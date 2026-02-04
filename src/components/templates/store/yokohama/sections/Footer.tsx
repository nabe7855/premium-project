import { ImageIcon, Link2 } from 'lucide-react';
import React from 'react';

import { FooterConfig } from '@/lib/store/storeTopConfig';

interface FooterProps {
  config?: FooterConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  if (!config) return null;

  const getAbsoluteHref = (href: string) => {
    if (!href) return '#';
    if (
      href.startsWith('http') ||
      href.startsWith('//') ||
      href.startsWith('#') ||
      href.startsWith('/')
    ) {
      return href;
    }
    return `/${href}`;
  };

  const handleShopInfoUpdate = (key: string, value: string) => {
    if (onUpdate) {
      onUpdate('footer', 'shopInfo', { ...config.shopInfo, [key]: value });
    }
  };

  const handleLinkUpdate = (key: string, index?: number) => {
    if (!onUpdate) return;

    const currentLink =
      typeof index === 'number'
        ? (config[key as keyof FooterConfig] as any)[index].link
        : (config[key as keyof FooterConfig] as any);

    const newLink = window.prompt('リンクURLを入力してください:', currentLink);

    if (newLink !== null) {
      if (typeof index === 'number') {
        const newArray = [...(config[key as keyof FooterConfig] as any)];
        newArray[index] = { ...newArray[index], link: newLink };
        onUpdate('footer', key, newArray);
      } else {
        onUpdate('footer', key, newLink);
      }
    }
  };

  return (
    <footer id="footer" className="bg-[#EE827C] py-12 text-slate-400 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-2">
            {/* Logo Image Wrapper Removed */}
            <div className="space-y-4 text-sm leading-relaxed">
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => handleShopInfoUpdate('address', e.currentTarget.innerText)}
                className={isEditing ? 'rounded px-1 hover:bg-white/5' : ''}
              >
                {config.shopInfo.address}
              </p>
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => handleShopInfoUpdate('phone', e.currentTarget.innerText)}
                className={`text-xl font-bold text-white ${isEditing ? 'rounded px-1 hover:bg-white/5' : ''}`}
              >
                {config.shopInfo.phone}
              </p>
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => handleShopInfoUpdate('businessHours', e.currentTarget.innerText)}
                className={`whitespace-pre-line ${isEditing ? 'rounded px-1 hover:bg-white/5' : ''}`}
              >
                {config.shopInfo.businessHours}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Menu</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
              {config.menuButtons.map((btn, idx) => (
                <li key={idx} className="group flex items-center gap-2">
                  <a
                    href={getAbsoluteHref(btn.link || '#')}
                    onClick={(e) => isEditing && e.preventDefault()}
                    className="py-1 transition-colors hover:text-white"
                  >
                    <span
                      contentEditable={isEditing}
                      suppressContentEditableWarning={isEditing}
                      onBlur={(e) => {
                        const newButtons = [...config.menuButtons];
                        newButtons[idx] = { ...newButtons[idx], label: e.currentTarget.innerText };
                        onUpdate?.('footer', 'menuButtons', newButtons);
                      }}
                      className={isEditing ? 'cursor-text outline-none focus:bg-white/10' : ''}
                    >
                      {btn.label}
                    </span>
                  </a>
                  {isEditing && (
                    <button
                      onClick={() => handleLinkUpdate('menuButtons', idx)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Link2 size={12} className="text-slate-500 hover:text-white" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            {/* Banners Area */}
            <div className="overflow-hidden rounded-2xl p-4 md:p-8">
              {/* Grid of Banners (2 columns as requested) */}
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                {[...config.banners, ...config.smallBanners].map((banner, idx) => (
                  <div key={idx} className="group relative flex flex-col items-center">
                    <a
                      href={getAbsoluteHref(banner.link || '#')}
                      onClick={(e) => isEditing && e.preventDefault()}
                      className="block w-full overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.02]"
                    >
                      <img
                        src={banner.imageUrl}
                        alt=""
                        className="aspect-[1.8/1] w-full object-cover"
                      />
                    </a>

                    {/* Banner Title & Link Icon (Image 3 Style) */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-center font-bold text-white">
                      <span className="text-xs md:text-sm">バナータイトル</span>
                      <Link2 className="h-3.5 w-3.5" />
                    </div>

                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <label className="cursor-pointer rounded-full bg-white/90 p-1.5 text-slate-800">
                          <ImageIcon className="h-4 w-4" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              if (!e.target.files?.[0]) return;
                              const isSmall = idx >= config.banners.length;
                              const realIdx = isSmall ? idx - config.banners.length : idx;
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
                            const isSmall = idx >= config.banners.length;
                            const realIdx = isSmall ? idx - config.banners.length : idx;
                            handleLinkUpdate(isSmall ? 'smallBanners' : 'banners', realIdx);
                          }}
                          className="cursor-pointer rounded-full bg-white/90 p-1.5 text-slate-800"
                        >
                          <Link2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Large Square Banner at the Bottom */}
              <div className="mt-8 border-t border-white/20 pt-8">
                <div className="mx-auto aspect-square max-w-[400px]">
                  <div className="group relative h-full w-full">
                    <a
                      href={getAbsoluteHref(config.largeBanner?.link || '#')}
                      onClick={(e) => isEditing && e.preventDefault()}
                      className="block h-full w-full overflow-hidden rounded-xl bg-white shadow-xl"
                    >
                      <img
                        src={
                          config.largeBanner?.imageUrl ||
                          'https://placehold.jp/400x400.png?text=Large%20Banner'
                        }
                        alt="Large Banner"
                        className="h-full w-full object-cover"
                      />
                    </a>
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <label className="cursor-pointer rounded-full bg-white/90 p-2 text-slate-800">
                          <ImageIcon className="h-5 w-5" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              onImageUpload?.('footer', e.target.files[0], undefined, 'largeBanner')
                            }
                          />
                        </label>
                        <button
                          onClick={() => handleLinkUpdate('largeBanner')}
                          className="cursor-pointer rounded-full bg-white/90 p-2 text-slate-800"
                        >
                          <Link2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 md:flex-row">
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('footer', 'copyright', e.currentTarget.innerText)}
            className={`text-xs tracking-widest ${isEditing ? 'cursor-text rounded px-1 outline-none hover:bg-white/5' : ''}`}
          >
            {config.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
