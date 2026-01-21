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
    <footer id="footer" className="bg-slate-900 py-12 text-slate-400 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-2">
            <div className="group relative mb-6 inline-block">
              <a
                href={config.logoLink || '#'}
                onClick={(e) => isEditing && e.preventDefault()}
                className="flex items-center gap-3"
              >
                {config.logoImageUrl ? (
                  <img
                    src={config.logoImageUrl}
                    alt="Logo"
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="font-serif text-2xl font-bold tracking-tighter text-white">
                    {config.shopInfo.name}
                  </span>
                )}
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
                        onImageUpload?.('footer', e.target.files[0], undefined, 'logoImageUrl')
                      }
                    />
                  </label>
                  <button
                    onClick={() => handleLinkUpdate('logoLink')}
                    className="cursor-pointer rounded-full bg-white/90 p-1.5 text-slate-800"
                  >
                    <Link2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
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
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {config.menuButtons.map((btn, idx) => (
                <li key={idx} className="group flex items-center gap-1">
                  <a
                    href={btn.link || '#'}
                    onClick={(e) => isEditing && e.preventDefault()}
                    className="transition-colors hover:text-white"
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

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Information
            </h4>
            <div className="flex flex-wrap gap-2">
              {config.trustBadges.map((badge, idx) => (
                <div key={idx} className="group relative">
                  <a
                    href={badge.link || '#'}
                    onClick={(e) => isEditing && e.preventDefault()}
                    className="block"
                  >
                    <img
                      src={badge.imageUrl}
                      alt="Badge"
                      className="h-16 w-auto rounded bg-white/10 p-1"
                    />
                  </a>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <label className="cursor-pointer p-1 text-white hover:text-brand-accent">
                        <ImageIcon size={14} />
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
                        className="p-1 text-white hover:text-brand-accent"
                      >
                        <Link2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 md:flex-row">
          <div className="flex flex-wrap gap-4">
            {config.banners.map((banner, idx) => (
              <div key={idx} className="group relative">
                <a
                  href={banner.link || '#'}
                  onClick={(e) => isEditing && e.preventDefault()}
                  className="block overflow-hidden rounded shadow-lg transition-transform hover:scale-105"
                >
                  <img src={banner.imageUrl} alt="" className="h-10 w-auto" />
                </a>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <label className="cursor-pointer p-1 text-white hover:text-brand-accent">
                      <ImageIcon size={14} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          onImageUpload?.('footer', e.target.files[0], idx, 'banners')
                        }
                      />
                    </label>
                    <button
                      onClick={() => handleLinkUpdate('banners', idx)}
                      className="p-1 text-white hover:text-brand-accent"
                    >
                      <Link2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
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
