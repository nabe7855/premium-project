import { Camera } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { HeroConfig } from '@/lib/store/storeTopConfig';

const defaultHeroImages = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1920',
];

interface HeroSectionProps {
  config?: HeroConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const images = config?.images?.filter((img) => img) || defaultHeroImages;
  if (images.length === 0) images.push(defaultHeroImages[0]);

  const nextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleTextUpdate = (key: string, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate('hero', key, e.currentTarget.innerText);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload('hero', file, index);
    }
  };

  return (
    <section
      id="home"
      className="relative h-[100dvh] min-h-[500px] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-neutral-100">
        {images.map((img, index) => (
          <div
            key={index}
            className={`duration-1500 absolute inset-0 transition-opacity ease-in-out ${
              index === currentHeroSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={img} alt="" className="h-full w-full scale-105 transform object-cover" />

            {isEditing && index === currentHeroSlide && (
              <label className="absolute right-4 top-20 z-50 flex cursor-pointer items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-white transition-all hover:bg-black/70 md:right-10 md:top-10">
                <Camera size={18} />
                <span className="text-xs font-bold">背景画像を変更</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                />
              </label>
            )}
          </div>
        ))}
        <div className="absolute inset-0 z-10 hidden bg-gradient-to-r from-white/95 via-white/40 to-transparent md:block"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/90 via-white/10 to-transparent md:hidden"></div>
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 pt-16 text-center md:items-start md:text-left">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 duration-700 animate-in fade-in slide-in-from-bottom-4">
            <span className="bg-primary-400 h-[1px] w-8"></span>
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning={isEditing}
              onBlur={(e) => handleTextUpdate('badge', e)}
              className={`text-primary-500 text-[10px] font-bold uppercase tracking-[0.3em] md:text-xs ${isEditing ? 'hover:bg-primary-50 min-w-[50px] rounded px-1' : ''}`}
            >
              {config?.badge || 'Premium Relaxation Fukuoka'}
            </span>
          </div>
          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => handleTextUpdate('mainHeading', e)}
            className={`mb-6 whitespace-pre-line font-serif text-3xl leading-tight text-slate-800 delay-100 duration-700 animate-in fade-in slide-in-from-bottom-4 md:text-6xl ${isEditing ? 'min-h-[1em] rounded px-1 hover:bg-slate-50' : ''}`}
          >
            {config?.mainHeading || '日常を忘れる、\n至福のひととき。'}
          </h1>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => handleTextUpdate('description', e)}
            className={`mb-8 max-w-md whitespace-pre-line text-xs leading-relaxed text-slate-600 delay-200 duration-700 animate-in fade-in slide-in-from-bottom-4 md:text-lg ${isEditing ? 'min-h-[3em] rounded px-1 hover:bg-slate-50' : ''}`}
          >
            {config?.description ||
              '福岡で愛される女性専用リラクゼーション。\n厳選されたセラピストが、心を込めてお迎えします。'}
          </p>
          <div className="flex w-full flex-col gap-4 delay-300 duration-700 animate-in fade-in slide-in-from-bottom-4 sm:w-auto sm:flex-row">
            <div className="relative">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => handleTextUpdate('primaryButtonText', e)}
                className={`from-primary-400 to-primary-500 block rounded-full bg-gradient-to-r px-8 py-4 text-center text-sm font-bold tracking-widest text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl ${isEditing ? 'cursor-text' : ''}`}
              >
                {config?.primaryButtonText || 'セラピストを探す'}
              </span>
            </div>
            {(config?.secondaryButtonText || isEditing) && (
              <div className="relative">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleTextUpdate('secondaryButtonText', e)}
                  className={`border-primary-200 hover:bg-primary-50 block rounded-full border bg-white/80 px-8 py-4 text-center text-sm font-bold tracking-widest text-slate-700 backdrop-blur-sm transition-colors ${isEditing ? 'cursor-text' : ''}`}
                >
                  {config?.secondaryButtonText || '初めての方へ'}
                </span>
              </div>
            )}
            {!config && !isEditing && (
              <a
                href="#flow"
                className="border-primary-200 hover:bg-primary-50 rounded-full border bg-white/80 px-8 py-4 text-center text-sm font-bold tracking-widest text-slate-700 backdrop-blur-sm transition-colors"
              >
                初めての方へ
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 transform space-x-3 md:left-20 md:translate-x-0">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentHeroSlide(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentHeroSlide
                ? 'bg-primary-500 w-10'
                : 'hover:bg-primary-300 w-4 bg-slate-300/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
