import React from 'react';
import { Store } from '@/types/store';

interface HeroSectionProps {
  store: Store;
}

const HeroSection: React.FC<HeroSectionProps> = ({ store }) => {
  const gradientClass = store.colors.gradient;
  
  return (
    <section className={`relative min-h-[70vh] flex items-center justify-center ${gradientClass} overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/30 animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-white/25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 right-12 w-12 h-12 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-noto leading-tight">
            {store.displayName}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium mb-6 font-noto">
            {store.heroTitle}
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8">
          <p className="text-2xl md:text-3xl lg:text-4xl font-dancing font-semibold text-white leading-relaxed">
            {store.catchphrase}
          </p>
        </div>

        <p className="text-lg md:text-xl text-white/80 font-noto leading-relaxed">
          {store.description}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;