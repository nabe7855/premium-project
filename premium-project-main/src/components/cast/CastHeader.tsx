"use client";

import Image from "next/image";
import { GalleryItem } from "@/types/cast";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { useEffect, useState } from "react";

interface CastHeaderProps {
  name: string;
  catchCopy?: string;
  galleryItems?: GalleryItem[];
}

const CastHeader: React.FC<CastHeaderProps> = ({ name, catchCopy, galleryItems = [] }) => {
  const [show, setShow] = useState(false);
  const hasImages = galleryItems.length > 0;

  // ✅ フェードイン用のマウント後処理
  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-pink-50 px-4 pb-4 pt-6 rounded-b-xl shadow border border-red-400">
      <div className="text-xs text-gray-500 mb-2 text-center">※ CastHeader debug 表示中</div>

      {hasImages ? (
        <div className="w-full max-w-md mx-auto relative border border-green-400">
          <div className="text-xs text-green-700 absolute top-1 left-1 bg-white/80 px-1 rounded">
            ✅ 画像あり
          </div>
          <ImageCarousel items={galleryItems} className="w-full rounded-lg" />
        </div>
      ) : (
        <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-md bg-white border border-yellow-400">
          <div className="text-xs text-yellow-800 absolute top-1 left-1 bg-white/80 px-1 rounded">
            ⚠ 画像なし
          </div>
          <div className="relative aspect-[4/5]">
            <Image
              src="/no-image.png"
              alt="画像がありません"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      )}

      {/* 💡 名前＋キャッチコピー（大きく・強調・アニメーション付き） */}
      <div
        className={`mt-6 transition-all duration-700 ease-out transform ${
          show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        <div className="text-left max-w-md mx-auto">
          <p className="text-2xl font-bold text-pink-700 flex items-center gap-2">
            🍓 {name}
            {catchCopy && (
              <span className="text-xl font-bold text-gray-700 ml-1">
                〜{catchCopy}〜
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CastHeader;
