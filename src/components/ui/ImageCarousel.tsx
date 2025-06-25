'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { GalleryItem } from '@/types/cast';

interface ImageCarouselProps {
  items: GalleryItem[];
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ items }) => {
  const [current, setCurrent] = useState(0);

  // ✅ デバッグログ
  useEffect(() => {
    console.log('🧩 ImageCarousel items:', items);
    console.log('🧩 ImageCarousel items.length:', items.length);
  }, [items]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg shadow-md">
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={`gallery-${item.id}-${index}`}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
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
        <div className="absolute inset-0">
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
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 text-black rounded-full p-1 hover:bg-white z-20"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 text-black rounded-full p-1 hover:bg-white z-20"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
