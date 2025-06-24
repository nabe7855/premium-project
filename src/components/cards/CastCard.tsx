"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CastSNS } from "@/types/cast";

interface CastCardProps {
  customID: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  imageUrl: string | null;
  catchCopy?: string;
  sns?: CastSNS;
}

const CastCard: React.FC<CastCardProps> = ({
  customID,
  name,
  age,
  height,
  weight,
  imageUrl,
  catchCopy,
  sns,
}) => {
  return (
    <Link
      href={`/cast/${customID}`}
      className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
    >
      {/* ✅ 画像エリア */}
      <div className="relative w-full aspect-[3/4] bg-gray-100">
        <Image
          src={imageUrl || '/no-image.png'}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        {/* ✅ タグ風の名前表示（左上） */}
        <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          {name}
        </div>
      </div>

      {/* ✅ プロフィール情報エリア */}
      <div className="p-2">
        {catchCopy && <p className="text-sm text-gray-600">{catchCopy}</p>}
        <p className="text-xs text-gray-500">
          年齢: {age}歳　身長: {height}cm　体重: {weight}kg
        </p>
        {sns && (
          <div className="mt-1 text-xs text-gray-400">
            {sns.line && <div>LINE: {sns.line}</div>}
            {sns.twitter && <div>Twitter: {sns.twitter}</div>}
            {sns.instagram && <div>Instagram: {sns.instagram}</div>}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CastCard;
