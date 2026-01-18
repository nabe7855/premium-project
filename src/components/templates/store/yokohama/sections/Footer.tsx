import { FooterConfig } from '@/lib/store/storeTopConfig';
import React from 'react';

interface FooterProps {
  config?: FooterConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  if (!config) return null;

  return (
    <footer id="footer" className="bg-slate-900 py-12 text-slate-400 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              {config.logoImageUrl ? (
                <img src={config.logoImageUrl} alt="Logo" className="h-12 w-auto object-contain" />
              ) : (
                <span className="font-serif text-2xl font-bold tracking-tighter text-white">
                  {config.shopInfo.name}
                </span>
              )}
            </div>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>{config.shopInfo.address}</p>
              <p className="text-xl font-bold text-white">{config.shopInfo.phone}</p>
              <p>{config.shopInfo.businessHours}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Menu</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {config.menuButtons.map((btn, idx) => (
                <li key={idx}>
                  <a href={btn.link} className="transition-colors hover:text-white">
                    {btn.label}
                  </a>
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
                <img
                  key={idx}
                  src={badge}
                  alt="Badge"
                  className="h-16 w-auto rounded bg-white/10 p-1"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 md:flex-row">
          <div className="flex gap-4">
            {config.banners.map((banner, idx) => (
              <a
                key={idx}
                href={banner.link}
                className="overflow-hidden rounded shadow-lg transition-transform hover:scale-105"
              >
                <img src={banner.imageUrl} alt="" className="h-10 w-auto" />
              </a>
            ))}
          </div>
          <p className="text-xs tracking-widest">{config.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
