import { useStore } from '@/contexts/StoreContext';
import { FooterConfig } from '@/lib/store/storeTopConfig';
import { ImageIcon, Link2 } from 'lucide-react';
import React from 'react';

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

  const handleButtonUpdate = (index: number, value: string) => {
    if (onUpdate) {
      const newButtons = [...config.menuButtons];
      newButtons[index] = { ...newButtons[index], label: value };
      onUpdate('footer', 'menuButtons', newButtons);
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

  const { store } = useStore();

  const adjustedMenuButtons = config.menuButtons.map((btn) => {
    if (btn.label.includes('料金') || btn.label.includes('コース')) {
      return { ...btn, link: `/store/${store.slug}/price` };
    }
    return btn;
  });

  return (
    <footer id="footer" className="border-Pink-100 border-t bg-[#EE827C] py-8 text-slate-800">
      <div className="mx-auto max-w-[1000px] px-4">
        {/* Main Content Area */}
        <div className="flex flex-col gap-10 md:flex-row">
          {/* Left: Store Image Wrapper (Removed) & Shop Info */}
          <div className="w-full flex-shrink-0 md:w-[240px]">
            {/* Logo Image Wrapper Removed */}

            {/* Shop Info Box Below Logo (Image 2 style) */}
            <div className="mt-4 overflow-hidden rounded-md border border-neutral-800">
              <div className="bg-[#333] px-3 py-1.5 text-center text-[13px] font-bold tracking-widest text-white">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleShopInfoUpdate('name', e.currentTarget.innerText)}
                  className={isEditing ? 'px-1 hover:bg-white/10' : ''}
                >
                  {config.shopInfo.name}
                </span>
              </div>
              <div className="space-y-3 bg-white p-4 text-xs leading-relaxed">
                <div className="flex gap-3">
                  <span className="w-14 flex-shrink-0 font-bold text-slate-500">Address</span>
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleShopInfoUpdate('address', e.currentTarget.innerText)}
                    className={isEditing ? 'px-1 hover:bg-slate-50' : ''}
                  >
                    {config.shopInfo.address}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="w-14 flex-shrink-0 font-bold text-slate-500">Phone</span>
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleShopInfoUpdate('phone', e.currentTarget.innerText)}
                    className={isEditing ? 'px-1 font-bold hover:bg-slate-50' : 'font-bold'}
                  >
                    {config.shopInfo.phone}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="w-14 flex-shrink-0 font-bold text-slate-500">Open-Close</span>
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleShopInfoUpdate('businessHours', e.currentTarget.innerText)}
                    className={`whitespace-pre-line ${isEditing ? 'px-1 hover:bg-slate-50' : ''}`}
                  >
                    {config.shopInfo.businessHours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Buttons and Banners */}
          <div className="flex-grow">
            {/* Grid of buttons (12 buttons as in Image 2) */}
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
                    >
                      <Link2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Banners Area (Background is now inherited from footer, keeping structure) */}
            <div className="mt-10 overflow-hidden rounded-2xl">
              {/* Grid of Banners (2 columns as requested) */}
              <div className="grid grid-cols-2 gap-3 gap-y-7 md:gap-x-4 md:gap-y-8">
                {[...config.banners, ...config.smallBanners].map((banner, idx) => (
                  <div key={idx} className="group relative flex flex-col items-start">
                    <a
                      href={getAbsoluteHref(banner.link || '#')}
                      onClick={(e) => isEditing && e.preventDefault()}
                      className="block w-full overflow-hidden rounded-[10px] bg-white shadow-sm transition-opacity hover:opacity-90"
                    >
                      <img
                        src={banner.imageUrl}
                        alt=""
                        className="aspect-[2.5/1] w-full object-cover"
                      />
                    </a>

                    {/* Banner Title & Link Icon */}
                    <a
                      href={getAbsoluteHref(banner.link || '#')}
                      onClick={(e) => isEditing && e.preventDefault()}
                      className="mt-2.5 flex w-full items-start gap-1 text-left text-white decoration-white/80 transition-opacity hover:opacity-80"
                    >
                      <span className="text-[13px] font-medium leading-tight underline decoration-1 underline-offset-[3px] md:text-sm">
                        バナータイトル
                      </span>
                      <Link2
                        className="mt-[2px] h-3.5 w-3.5 shrink-0 opacity-80"
                        strokeWidth={2.5}
                      />
                    </a>

                    {isEditing && (
                      <div className="absolute inset-0 top-0 mb-8 flex items-center justify-center gap-2 rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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

        {/* Bottom Copyright */}
        <div className="mt-12 border-t border-slate-100 pt-6 text-center">
          <p className="text-[10px] tracking-widest text-[#666]">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={isEditing}
              onBlur={(e) => onUpdate?.('footer', 'copyright', e.currentTarget.innerText)}
              className={isEditing ? 'px-1 hover:bg-slate-50' : ''}
            >
              {config.copyright}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
