"use client";

import Image from "next/image";
import { FaCamera, FaTwitter } from "react-icons/fa";
import { GalleryItem } from "@/types/cast";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { useEffect } from "react";

interface CastHeaderProps {
  name: string;
  catchCopy?: string;
  galleryItems?: GalleryItem[];
}

const CastHeader: React.FC<CastHeaderProps> = ({ name, catchCopy, galleryItems = [] }) => {
  const hasImages = galleryItems.length > 0;

  // ✅ デバッグ用ログ
  useEffect(() => {
    console.log("🧩 CastHeader name:", name);
    console.log("🧩 CastHeader catchCopy:", catchCopy);
    console.log("🧩 CastHeader galleryItems:", galleryItems);
    console.log("🧩 CastHeader hasImages:", hasImages);
  }, [name, catchCopy, galleryItems]);

  return (
    <div className="text-center bg-pink-50 px-4 pb-4 pt-6 rounded-b-xl shadow border border-red-400">
      <div className="text-xs text-gray-500 mb-2">※ CastHeader debug 表示中</div>

      {hasImages ? (
        <div className="w-full max-w-md mx-auto relative border border-green-400">
          <div className="text-xs text-green-700 absolute top-1 left-1 bg-white/80 px-1 rounded">
            ✅ 画像あり
          </div>
          <ImageCarousel
            items={galleryItems}
            className="w-full rounded-lg"
          />
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

      <h2 className="text-pink-700 text-lg font-bold flex justify-center items-center gap-2 mt-4">
        🍓 {name} さん
      </h2>
      <p className="text-sm text-gray-600 mt-1">{catchCopy}</p>
    </div>
  );
};

export default CastHeader;
