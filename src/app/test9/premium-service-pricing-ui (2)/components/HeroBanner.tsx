
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
    <div className="relative w-full overflow-hidden rounded-[2rem] shadow-xl shadow-rose-200/50 mb-12 group">
      {/* Background Image with strawberry-tinted overlay */}
      <div className="relative aspect-[21/9] md:aspect-[3/1] w-full bg-rose-900">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-transparent flex items-center">
          <div className="px-8 md:px-16 max-w-2xl">
            {badge && (
              <span className="inline-block bg-rose-500 text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-full mb-4 animate-pulse">
                {badge}
              </span>
            )}
            <h2 className="text-white text-2xl md:text-5xl font-black leading-tight mb-2 drop-shadow-md">
              {title}
            </h2>
            {subtitle && (
              <p className="text-rose-100 text-xs md:text-lg font-medium mb-4 drop-shadow-sm">
                {subtitle}
              </p>
            )}
            {priceTag && (
              <div className="flex items-baseline gap-2">
                <span className="text-rose-400 text-3xl md:text-5xl font-black">{priceTag}</span>
                <span className="text-white/60 text-[10px] md:text-xs font-bold underline decoration-rose-500">※期間限定特典</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
    </div>
  );
};

export default HeroBanner;
