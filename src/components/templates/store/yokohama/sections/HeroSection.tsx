import { Camera } from 'lucide-react';
import NextImage from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

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
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const images = (config?.images?.length ? config.images : heroImages).map((img) =>
    img.replace(/\{slug\}/g, slug),
  );
  
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'center', 
      skipSnaps: false,
      duration: 30,
    },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCurrentHeroSlide(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  // Sync external slide changes to Embla
  useEffect(() => {
    if (emblaApi && currentHeroSlide !== selectedIndex) {
      emblaApi.scrollTo(currentHeroSlide);
    }
  }, [currentHeroSlide, emblaApi, selectedIndex]);

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

      if (config.imageLinks) {
        const newLinks = [...config.imageLinks];
        newLinks.splice(index, 1);
        onUpdate('hero', 'imageLinks', newLinks);
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

    if (config.imageLinks) {
      const newLinks = [...config.imageLinks];
      const maxIdx = Math.max(index, newIndex);
      while (newLinks.length <= maxIdx) {
        newLinks.push('');
      }
      [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
      onUpdate('hero', 'imageLinks', newLinks);
    }

    setCurrentHeroSlide(newIndex);
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload('hero', file, images.length);
      setCurrentHeroSlide(images.length);
    }
  };

  const handleLinkUpdate = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdate && config) {
      const newLinks = [...(config.imageLinks || [])];
      while (newLinks.length <= index) {
        newLinks.push('');
      }
      newLinks[index] = e.target.value;
      onUpdate('hero', 'imageLinks', newLinks);
    }
  };

  return (
    <>
      <section
        id="hero"
        className="relative w-full overflow-hidden"
        style={{
          height: 'calc(100svh - 146px)', 
          minHeight: '420px', 
        }}
      >
        <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((img, index) => {
              const isActive = index === selectedIndex;
              const isFirst = index === 0;
              
              return (
                <div
                  key={index}
                  className="relative h-full flex-[0_0_100%] md:flex-[0_0_80%] px-0 md:px-4"
                >
                  <div 
                    className={`relative h-full w-full transition-all duration-700 ease-out overflow-hidden rounded-xl md:rounded-2xl ${
                      isActive ? 'scale-100 opacity-100 shadow-xl' : 'scale-[0.85] opacity-40 blur-[1px]'
                    }`}
                  >
                    {/* 背景のぼかし画像 */}
                    <div className="absolute inset-0">
                      <NextImage
                        src={img}
                        alt=""
                        fill
                        className="scale-110 object-cover blur-2xl opacity-40"
                        unoptimized
                      />
                    </div>
                    
                    {(() => {
                      const imageContent = (
                        <div className="relative h-full w-full">
                          <NextImage
                            src={img}
                            alt={isFirst ? "店舗メインビジュアル" : `Hero Image ${index + 1}`}
                            fill
                            priority={isFirst}
                            fetchPriority={isFirst ? "high" : undefined}
                            sizes="(max-width: 768px) 100vw, 80vw"
                            className="h-full w-full object-contain"
                            unoptimized
                          />
                        </div>
                      );

                      const link = config?.imageLinks?.[index];
                      if (link && !isEditing) {
                        return (
                          <a
                            href={link}
                            className="block h-full w-full cursor-pointer"
                            target={link.startsWith('http') ? '_blank' : undefined}
                            rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {imageContent}
                          </a>
                        );
                      }
                      return imageContent;
                    })()}

                    {/* モバイル用グラデーションオーバーレイ */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent md:hidden" />
                    
                    {/* 編集モード用のコントロール */}
                    {isEditing && isActive && (
                      <div className="absolute right-4 top-4 z-50 flex flex-col gap-2 md:right-10 md:top-10">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMoveImage(index, 'left'); }}
                            disabled={index === 0}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70 disabled:opacity-30"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>

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

                          <button
                            onClick={(e) => { e.stopPropagation(); handleMoveImage(index, 'right'); }}
                            disabled={index === images.length - 1}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70 disabled:opacity-30"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/80 text-white transition-all hover:bg-rose-600"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-2 w-72 rounded-lg bg-black/50 p-3 backdrop-blur-md border border-white/10">
                          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/60 text-left">
                            画像クリック時のリンクURL
                          </label>
                          <input
                            type="text"
                            value={config?.imageLinks?.[index] || ''}
                            onChange={(e) => handleLinkUpdate(index, e)}
                            placeholder="https://..."
                            className="w-full rounded border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 新しい画像を追加ボタン */}
        {isEditing && (
          <div className="absolute bottom-16 left-1/2 z-50 -translate-x-1/2">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-500/80 px-6 py-3 text-white shadow-lg transition-all hover:bg-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-bold">画像を追加</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleAddImage} />
            </label>
          </div>
        )}

        {/* インジケーター */}
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 justify-center space-x-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentHeroSlide(index);
                if (emblaApi) emblaApi.scrollTo(index);
              }}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'scale-125 bg-rose-500 w-6'
                  : 'bg-white/50 hover:bg-white/80'
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
