'use client';

import Image from 'next/image';
import { GalleryItem } from '@/types/cast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import clsx from 'clsx';

interface ImageCarouselProps {
  items: GalleryItem[];
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ items, className }) => {
  if (!items || items.length === 0) {
    return (
      <div className={clsx("relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100/50", className)}>
        <Image
          src="/no-image.png"
          alt="No image available"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-50"
        />
      </div>
    );
  }

  return (
    <div className={clsx("group relative w-full h-full", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {items.map((item, index) => (
            <CarouselItem key={`gallery-${item.id || index}`} className="pl-0">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-pink-100/10 backdrop-blur-[2px]">
                <Image
                  src={item.imageUrl || '/no-image.png'}
                  alt={`ギャラリー画像 ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain transition-all duration-300"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {items.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center justify-center p-3 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
              <CarouselPrevious className="pointer-events-auto relative left-0 bg-white/60 hover:bg-white/90 backdrop-blur shadow-sm border-pink-100 text-pink-500" />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center justify-center p-3 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
              <CarouselNext className="pointer-events-auto relative right-0 bg-white/60 hover:bg-white/90 backdrop-blur shadow-sm border-pink-100 text-pink-500" />
            </div>
          </>
        )}

        {/* 下部のインジケーター */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
          <div className="inline-flex gap-1.5 rounded-full bg-black/20 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white">
            {items.length} PHOTOS
          </div>
        </div>
      </Carousel>

      {/* ドット */}
      <div className="mt-4 flex justify-center gap-1.5">
        {items.length > 1 && items.map((_, i) => (
          <div 
            key={i} 
            className="h-1.5 w-1.5 rounded-full bg-pink-200"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
