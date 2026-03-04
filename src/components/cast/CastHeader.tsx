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
    <div className="rounded-b-xl border border-red-400 bg-pink-50 px-4 pb-4 pt-6 shadow">
      <div className="mb-2 text-center text-xs text-gray-500">※ CastHeader debug 表示中</div>

      {hasImages ? (
        <div className="relative mx-auto w-full max-w-md border border-green-400">
          <div className="absolute left-1 top-1 rounded bg-white/80 px-1 text-xs text-green-700">
            ✅ 画像あり
          </div>
          <ImageCarousel items={galleryItems} className="w-full rounded-lg" />
        </div>
      ) : (
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg border border-yellow-400 bg-white shadow-md">
          <div className="absolute left-1 top-1 rounded bg-white/80 px-1 text-xs text-yellow-800">
            ⚠ 画像なし
          </div>
          <div className="relative aspect-[4/5]">
            <Image
              src="/no-image.png"
              alt="画像がありません"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-lg object-cover"
              priority
            />
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
