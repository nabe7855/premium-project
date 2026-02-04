import { useStore } from '@/contexts/StoreContext';
import { FooterConfig } from '@/lib/store/storeTopConfig';
import { ImageIcon, Link2, Plus } from 'lucide-react';
import React from 'react';

interface FooterProps {
  config?: FooterConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  if (!config) return null;

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
    <footer id="footer" className="border-Pink-100 border-t bg-white py-8 text-slate-800">
      <div className="mx-auto max-w-[1000px] px-4">
        {/* Main Content Area */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Left: Store Image Wrapper */}
          <div className="w-full flex-shrink-0 md:w-[240px]">
            <div className="group relative overflow-hidden rounded-lg border-[3px] border-pink-200 bg-white shadow-sm">
              <a
                href={config.logoLink || '#'}
                onClick={(e) => isEditing && e.preventDefault()}
                className="block"
              >
                <img
                  src={config.logoImageUrl || '/placeholder-store.png'}
                  alt={config.shopInfo.name}
                  className="h-auto w-full"
                />
              </a>
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <label className="cursor-pointer rounded-full bg-white/90 p-2 text-slate-800 shadow-lg">
                    <ImageIcon className="h-5 w-5" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        onImageUpload?.('footer', e.target.files[0], undefined, 'logoImageUrl')
                      }
                    />
                  </label>
                  <button
                    onClick={() => handleLinkUpdate('logoLink')}
                    className="cursor-pointer rounded-full bg-white/90 p-2 text-slate-800 shadow-lg"
                  >
                    <Link2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

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
              <div className="space-y-2 bg-white p-3 text-[11px] leading-relaxed">
                <div className="flex gap-2">
                  <span className="w-12 flex-shrink-0 font-bold">Address</span>
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleShopInfoUpdate('address', e.currentTarget.innerText)}
                    className={isEditing ? 'px-1 hover:bg-slate-50' : ''}
                  >
                    {config.shopInfo.address}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-12 flex-shrink-0 font-bold">Phone</span>
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleShopInfoUpdate('phone', e.currentTarget.innerText)}
                    className={isEditing ? 'px-1 font-bold hover:bg-slate-50' : 'font-bold'}
                  >
                    {config.shopInfo.phone}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-12 flex-shrink-0 font-bold">Open-Close</span>
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {adjustedMenuButtons.map((btn, idx) => (
                <div key={idx} className="group relative">
                  <a
                    href={btn.link || '#'}
                    onClick={(e) => isEditing && e.preventDefault()}
                    className="flex h-10 items-center justify-center rounded bg-[#333] px-1 text-center text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-[#444]"
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

            {/* Banners Area with Pink Background */}
            <div className="mt-8 overflow-hidden rounded-2xl bg-[#F47575] p-4 md:p-6">
              {/* Grid of Banners (2 columns as requested) */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-8">
                {[...config.banners, ...config.smallBanners].map((banner, idx) => (
                  <div key={idx} className="group relative flex flex-col items-center">
                    <a
                      href={banner.link || '#'}
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
                    <div className="mt-2 flex items-center justify-center gap-1 text-center font-bold text-white">
                      <span className="text-[10px] md:text-xs">バナータイトル</span>
                      <Link2 className="h-3 w-3" />
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
            </div>

            {/* Trust Badges Area (Keeping separate as it was) */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {config.trustBadges.map((badge, idx) => (
                <div key={idx} className="group relative">
                  <a
                    href={badge.link || '#'}
                    onClick={(e) => isEditing && e.preventDefault()}
                    className="block flex-shrink-0 rounded border border-neutral-200 bg-white p-1"
                  >
                    <img src={badge.imageUrl} alt="Trust Badge" className="h-24 w-auto" />
                  </a>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <label className="cursor-pointer rounded-full bg-white/90 p-1.5 text-slate-800">
                        <ImageIcon className="h-4 w-4" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            onImageUpload?.('footer', e.target.files[0], idx, 'trustBadges')
                          }
                        />
                      </label>
                      <button
                        onClick={() => handleLinkUpdate('trustBadges', idx)}
                        className="cursor-pointer rounded-full bg-white/90 p-1.5 text-slate-800"
                      >
                        <Link2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newBadges = [...config.trustBadges];
                          newBadges.splice(idx, 1);
                          onUpdate?.('footer', 'trustBadges', newBadges);
                        }}
                        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() =>
                    onUpdate?.('footer', 'trustBadges', [
                      ...config.trustBadges,
                      { imageUrl: 'https://placehold.jp/100x120.png', link: '#' },
                    ])
                  }
                  className="flex h-24 w-20 items-center justify-center rounded border-2 border-dashed border-slate-200 text-slate-300 hover:border-slate-400 hover:text-slate-500"
                >
                  <Plus size={24} />
                </button>
              )}
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
