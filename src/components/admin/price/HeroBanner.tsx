import React from 'react';

interface HeroBannerProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  priceTag?: string;
  badge?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ imageUrl, title, subtitle, priceTag, badge }) => {
  return (
    <div className="group relative mb-12 w-full overflow-hidden rounded-[2rem] shadow-xl shadow-rose-200/50">
      {/* Background Image with strawberry-tinted overlay */}
      <div className="relative aspect-[21/9] w-full bg-rose-900 md:aspect-[3/1]">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-transparent">
          <div className="max-w-2xl px-8 md:px-16">
            {badge && (
              <span className="mb-4 inline-block animate-pulse rounded-full bg-rose-500 px-3 py-1 text-[10px] font-black text-white md:text-xs">
                {badge}
              </span>
            )}
            <h2 className="mb-2 text-2xl font-black leading-tight text-white drop-shadow-md md:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mb-4 text-xs font-medium text-rose-100 drop-shadow-sm md:text-lg">
                {subtitle}
              </p>
            )}
            {priceTag && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-400 md:text-5xl">{priceTag}</span>
                <span className="text-[10px] font-bold text-white/60 underline decoration-rose-500 md:text-xs">
                  ※期間限定特典
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Shine Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full"></div>
    </div>
  );
};

export default HeroBanner;
