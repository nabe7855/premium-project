import { Camera } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { HeroConfig } from '@/lib/store/storeTopConfig';

interface HeroSectionProps {
  config?: HeroConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const heroImages = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1920',
];

const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  isEditing,
  onUpdate,
  onImageUpload,
}) => {
  const images = config?.images?.length ? config.images : heroImages;
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  const handleRemoveImage = (index: number) => {
    if (!onUpdate || !config) return;
    if (confirm('この画像を削除しますか？')) {
      const newImages = [...images];
      newImages.splice(index, 1);
      onUpdate('hero', 'images', newImages);
      if (currentHeroSlide >= newImages.length) {
        setCurrentHeroSlide(Math.max(0, newImages.length - 1));
      }
    }
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    if (!onUpdate || !config) return;
    const newImages = [...images];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newImages.length) return;

    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onUpdate('hero', 'images', newImages);
    setCurrentHeroSlide(newIndex);
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload('hero', file, images.length);
      setCurrentHeroSlide(images.length);
    }
  };

  return (
    <>
      <section
        id="hero"
        className="relative !h-svh min-h-0 w-full overflow-hidden"
        style={{ height: '100svh' }}
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
                <div className="absolute right-4 top-20 z-50 flex flex-col gap-2 md:right-10 md:top-10">
                  <div className="flex items-center gap-2">
                    {/* Move Left */}
                    <button
                      onClick={() => handleMoveImage(index, 'left')}
                      disabled={index === 0}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70 disabled:opacity-30"
                      title="左へ移動"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Change Image */}
                    <label className="flex cursor-pointer items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-white transition-all hover:bg-black/70">
                      <Camera size={18} />
                      <span className="text-xs font-bold">差し替え</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                      />
                    </label>

                    {/* Move Right */}
                    <button
                      onClick={() => handleMoveImage(index, 'right')}
                      disabled={index === images.length - 1}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70 disabled:opacity-30"
                      title="右へ移動"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    {/* Delete Image */}
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/80 text-white transition-all hover:bg-rose-600"
                      title="削除"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Add Image */}
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-500/80 py-2 text-white transition-all hover:bg-emerald-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-xs font-bold">新しい画像を追加</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAddImage}
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
          <div className="absolute inset-0 z-10 hidden bg-gradient-to-r from-white/95 via-white/40 to-transparent md:block"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/90 via-white/10 to-transparent md:hidden"></div>
        </div>

        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 pt-16 text-center md:items-start md:text-left">
          {/* Text and buttons removed as per user request */}
        </div>

        {/* Slider Indicators - Moved inside hero section and styled as circles */}
        <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 justify-center space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`h-2.5 w-2.5 rounded-full border border-black/10 shadow-sm transition-all duration-300 ${
                index === currentHeroSlide ? 'bg-slate-700' : 'bg-white/80 hover:bg-white'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default HeroSection;
