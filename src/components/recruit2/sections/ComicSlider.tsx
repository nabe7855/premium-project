'use client';

import { EditableImage } from '@/components/admin/EditableImage';
import React, { useRef } from 'react';

interface ComicSlide {
  title: string;
  text: string;
  img: string;
}

interface ComicSliderProps {
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  slides?: ComicSlide[];
}

const ComicSlider: React.FC<ComicSliderProps> = ({ isEditing = false, onUpdate, slides }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultSteps: ComicSlide[] = [
    {
      title: '勇気の一歩',
      text: 'スマホ一つで簡単応募。',
      img: 'https://picsum.photos/seed/c1/600/400',
    },
    {
      title: 'リラックス面談',
      text: 'カフェ感覚の20分雑談。',
      img: 'https://picsum.photos/seed/c2/600/400',
    },
    {
      title: '徹底研修',
      text: 'プロの技を基礎から。',
      img: 'https://picsum.photos/seed/c3/600/400',
    },
    {
      title: 'デビュー当日',
      text: '安心のサポート体制。',
      img: 'https://picsum.photos/seed/c4/600/400',
    },
    {
      title: '初のお客様',
      text: '必要とされる実感を体験。',
      img: 'https://picsum.photos/seed/c5/600/400',
    },
    {
      title: '「ありがとう」',
      text: '仕事が喜びに変わる。',
      img: 'https://picsum.photos/seed/c6/600/400',
    },
    {
      title: '成長のループ',
      text: '自信が確信に変わる。',
      img: 'https://picsum.photos/seed/c7/600/400',
    },
    {
      title: '人生激変',
      text: '欲しかった未来が今ここに。',
      img: 'https://picsum.photos/seed/c8/600/400',
    },
  ];

  const steps = slides && slides.length > 0 ? slides : defaultSteps;

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 300 : 400;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleAddSlide = () => {
    if (onUpdate) {
      const newSlide: ComicSlide = {
        title: `STEP ${steps.length + 1}`,
        text: '新しいページの説明',
        img: 'https://picsum.photos/seed/new/600/400',
      };
      onUpdate('slides', [...steps, newSlide]);
    }
  };

  const handleRemoveSlide = (index: number) => {
    if (onUpdate) {
      const newSlides = steps.filter((_, i) => i !== index);
      onUpdate('slides', newSlides);
    }
  };

  const handleUpdateSlide = (index: number, field: keyof ComicSlide, value: string) => {
    if (onUpdate) {
      const newSlides = steps.map((slide, i) =>
        i === index ? { ...slide, [field]: value } : slide,
      );
      onUpdate('slides', newSlides);
    }
  };

  const handleImageUpload = (index: number) => (file: File) => {
    if (onUpdate) {
      const url = URL.createObjectURL(file);
      handleUpdateSlide(index, 'img', url);
    }
  };

  return (
    <section className="border-y border-slate-100 bg-slate-50 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center sm:mb-12">
          <h3 className="mb-4 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            マンガでわかる仕事の流れ
          </h3>
          <p className="text-sm text-slate-500 sm:text-base">
            未経験からデビュー、そして人生が変わるまでの物語
          </p>
        </div>

        <div className="group relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-opacity hover:bg-white group-hover:opacity-100 sm:flex"
            aria-label="Scroll left"
          >
            ←
          </button>

          <div
            ref={scrollRef}
            className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth pb-6 sm:gap-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="group/item relative w-[280px] flex-shrink-0 snap-center sm:w-[350px] sm:snap-start"
              >
                <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative aspect-video w-full border-b border-slate-100">
                    <EditableImage
                      src={step.img}
                      alt={step.title}
                      className="h-full w-full object-cover"
                      isEditing={isEditing}
                      onUpload={handleImageUpload(idx)}
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                          className="w-full border-b border-slate-300 bg-transparent font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      ) : (
                        <h4 className="font-bold text-slate-900">{step.title}</h4>
                      )}
                    </div>
                    {isEditing ? (
                      <textarea
                        value={step.text}
                        onChange={(e) => handleUpdateSlide(idx, 'text', e.target.value)}
                        className="h-20 w-full rounded border border-slate-200 bg-transparent p-2 text-sm leading-relaxed text-slate-600 focus:border-amber-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm leading-relaxed text-slate-600">{step.text}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <button
                    onClick={() => handleRemoveSlide(idx)}
                    className="absolute -right-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600"
                    title="このページを削除"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {isEditing && (
              <div className="flex min-h-[300px] w-[280px] flex-shrink-0 snap-center items-center justify-center sm:w-[350px] sm:snap-start">
                <button
                  onClick={handleAddSlide}
                  className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-amber-500 hover:bg-amber-50 hover:text-amber-500"
                >
                  <span className="text-4xl font-bold">+</span>
                  <span className="font-bold">ページを追加</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-opacity hover:bg-white group-hover:opacity-100 sm:flex"
            aria-label="Scroll right"
          >
            →
          </button>

          {/* Mobile indicator hints */}
          <div className="mt-4 flex justify-center gap-1 sm:hidden">
            {steps.map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComicSlider;
