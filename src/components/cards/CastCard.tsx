"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CastCardProps {
  customID: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  imageUrl: string | null;
  catchCopy?: string;
}

const CastCard: React.FC<CastCardProps> = ({
  customID,
  name,
  age,
  height,
  weight,
  imageUrl,
  catchCopy,
}) => {
  return (
    <Link
      href={`/cast/${customID}`}
      className="block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition bg-white"
    >
      {/* ✅ 画像エリア */}
      <div className="relative w-full aspect-[3/4] bg-gray-100">
        <Image
          src={imageUrl || '/no-image.png'}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={imageUrl === null}
        />
        {/* ✅ 名前タグ */}
        <div className="absolute top-2 left-2 bg-pink-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {name}
        </div>
      </div>

      {/* ✅ キャッチコピー */}
      <div className="text-center px-3 pt-3 pb-1">
        {catchCopy && (
          <p className="text-sm text-pink-800 font-medium truncate">{catchCopy}</p>
        )}
      </div>

      {/* ✅ 年齢・身長・体重 表形式 */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-3 text-center text-[11px] text-gray-500 font-semibold border-t border-gray-200 pt-2">
          <div>年齢</div>
          <div>身長</div>
          <div>体重</div>
        </div>
        <div className="grid grid-cols-3 text-center text-sm text-gray-700 font-medium pt-1">
          <div>{age}歳</div>
          <div>{height}cm</div>
          <div>{weight}kg</div>
        </div>
      </div>
    </Link>
  );
};

export default CastCard;
