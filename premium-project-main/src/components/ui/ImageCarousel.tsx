'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { GalleryItem } from '@/types/cast';
import clsx from 'clsx';

interface ImageCarouselProps {
  items: GalleryItem[];
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ items, className }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    console.log('🧩 ImageCarousel items:', items);
    console.log('🧩 ImageCarousel items.length:', items.length);
    console.log('🧩 current index:', current);
  }, [items, current]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={clsx(
        "relative aspect-[4/5] overflow-hidden rounded-lg shadow-md border border-blue-400",
        className
      )}
    >
      <div className="absolute top-1 left-1 z-30 bg-white/70 text-xs text-blue-800 px-2 py-0.5 rounded">
        index: {current + 1} / {items.length}
      </div>

      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={`gallery-${item.id}-${index}`}
            className={clsx(
              "absolute inset-0 transition-opacity duration-500 ease-in-out",
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            )}
          >
            <Image
              src={item.imageUrl || '/no-image.png'}
              alt={`ギャラリー画像 ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        ))
      ) : (
        <div className="absolute inset-0 border border-yellow-500">
          <Image
            src="/no-image.png"
            alt="No image available"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      )}

      {items.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-black text-lg font-bold rounded-full px-2 z-20"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-black text-lg font-bold rounded-full px-2 z-20"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
