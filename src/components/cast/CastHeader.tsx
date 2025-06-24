"use client";

import React from "react";
import Image from "next/image";

const CastHeader = () => {
  return (
    <div className="flex flex-col items-center bg-pink-50 rounded-xl p-4 shadow-sm">
      {/* 名前とキャッチコピー */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-pink-800">🍓 Taiki さん</h1>
        <p className="text-sm text-gray-600 mt-1">癒し系でまったりおしゃべり好き♪</p>
      </div>

      {/* プロフィール画像 */}
      <div className="relative w-40 h-52 rounded-lg overflow-hidden shadow-md border border-gray-200">
        <Image
          src="/no-image.png" // 仮画像
          alt="Taiki さんの画像"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
          className="object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

export default CastHeader;
