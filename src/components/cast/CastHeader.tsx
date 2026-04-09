'use client';

import ImageCarousel from '@/components/ui/ImageCarousel';
import { GalleryItem } from '@/types/cast';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface CastHeaderProps {
  name: string;
  catchCopy?: string;
  aiSummary?: string;
  galleryItems?: GalleryItem[];
}

const CastHeader: React.FC<CastHeaderProps> = ({
  name,
  catchCopy,
  aiSummary,
  galleryItems = [],
}) => {
  const [show, setShow] = useState(false);
  const hasImages = galleryItems.length > 0;

  // ✅ フェードイン用のマウント後処理
  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="rounded-b-2xl bg-white px-4 pb-8 pt-6 shadow-sm">
      {hasImages ? (
        <div className="mx-auto w-full max-w-md">
          <ImageCarousel items={galleryItems} className="w-full" />
        </div>
      ) : (
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-gray-50 aspect-[4/5] shadow-inner">
          <Image
            src="/cast-default.jpg"
            alt="画像がありません"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-20 filter grayscale"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">No Photo Available</span>
          </div>
        </div>
      )}

      {/* 💡 名前＋キャッチコピー（大きく・強調・アニメーション付き） */}
      <div
        className={`mt-6 transform transition-all duration-700 ease-out ${
          show ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-md text-left">
          <p className="flex items-center gap-2 text-2xl font-bold text-pink-700">
            🍓 {name}
            {catchCopy && (
              <span className="ml-1 text-xl font-bold text-gray-700">〜{catchCopy}〜</span>
            )}
          </p>
          {aiSummary && (
            <div className="mt-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[10px] text-white">
                  ✨
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  AIによる口コミ要約
                </span>
              </div>
              <p className="text-sm italic leading-relaxed text-gray-700">「{aiSummary}」</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CastHeader;
