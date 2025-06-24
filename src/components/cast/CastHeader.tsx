// components/cast/CastHeader.tsx
"use client";

import Image from "next/image";
import { FaCamera, FaTwitter } from "react-icons/fa";

interface CastHeaderProps {
  name: string;
  catchCopy?: string;
  imageUrl: string;
}

const CastHeader: React.FC<CastHeaderProps> = ({ name, catchCopy, imageUrl }) => {
  return (
    <div className="text-center bg-pink-50 px-4 pb-4 pt-6 rounded-b-xl shadow">
      <h2 className="text-pink-700 text-lg font-bold flex justify-center items-center gap-2">
        🍓 {name} さん
      </h2>
      <p className="text-sm text-gray-600 mt-1">{catchCopy}</p>

      {/* ✅ 画像表示 */}
      <div className="relative w-40 h-52 mx-auto mt-4 rounded-lg overflow-hidden shadow-md bg-white">
        <Image
          src={imageUrl || "/no-image.png"}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* ✅ 写メ日記・SNSリンクボタン */}
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
