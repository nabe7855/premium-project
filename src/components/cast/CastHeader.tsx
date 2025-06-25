"use client";

import Image from "next/image";
import { FaCamera, FaTwitter } from "react-icons/fa";
import { GalleryItem } from "@/types/cast";
import ImageCarousel from "@/components/ui/ImageCarousel";

interface CastHeaderProps {
  name: string;
  catchCopy?: string;
  galleryItems?: GalleryItem[];
}

const CastHeader: React.FC<CastHeaderProps> = ({ name, catchCopy, galleryItems = [] }) => {
  const hasImages = galleryItems.length > 0;

  return (
    <div className="text-center bg-pink-50 px-4 pb-4 pt-6 rounded-b-xl shadow">
      {hasImages ? (
  <div className="w-full max-w-2xl aspect-[4/5] mx-auto">
    <ImageCarousel items={galleryItems} className="w-full h-full" />
  </div>
) : (
  <div className="relative w-full max-w-2xl aspect-[4/5] mx-auto rounded-lg overflow-hidden shadow-md bg-white">
    <Image
      src="/no-image.png"
      alt="画像がありません"
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
      priority
    />
  </div>
)}


      <h2 className="text-pink-700 text-lg font-bold flex justify-center items-center gap-2 mt-4">
        🍓 {name} さん
      </h2>
      <p className="text-sm text-gray-600 mt-1">{catchCopy}</p>

      <div className="flex justify-center gap-4 mt-3">
        <button className="flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full shadow hover:bg-pink-200">
          <FaCamera />
          写メ日記
        </button>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full shadow hover:bg-blue-200"
        >
          <FaTwitter />
          SNSリンク
        </a>
      </div>
    </div>
  );
};

export default CastHeader;
