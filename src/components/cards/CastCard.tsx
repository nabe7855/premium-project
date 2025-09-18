'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CastCardProps {
  slug: string;
  storeSlug?: string;
  name: string;
  age?: number;      // ← number → number | undefined に修正
  height?: number;   // ← 同上
  imageUrl: string | null;
  catchCopy?: string;
  isNew?: boolean;
  isReception?: boolean;
  isFirstCard?: boolean; // ← ファーストビュー優先画像として使いたい場合に true
  priority?: boolean;
}

const CastCard: React.FC<CastCardProps> = ({
  slug,
  storeSlug,
  name,
  age,
  height,
  imageUrl,
  catchCopy,
  isNew = false,
  isReception = false,
  priority,
}) => {
  const href = storeSlug ? `/store/${storeSlug}/${slug}` : `/cast/${slug}`;

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
    >
      {/* 画像エリア */}
      <div className="relative aspect-[3/4] w-full bg-gray-100">
        <Image
          src={imageUrl || '/no-image.png'}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={priority} // ← LCP画像のみpriority
        />

        {/* 名前タグ */}
        <div className="absolute left-2 top-2 rounded-full bg-pink-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {name}
        </div>

        {/* NEWバッジ */}
        {isNew && (
          <div className="absolute right-2 top-2 rotate-[15deg] scale-105 rounded border border-white bg-yellow-400 px-2 py-1 text-[10px] font-bold text-white shadow-md">
            NEW
          </div>
        )}

        {/* 受付バッジ */}
        {isReception && (
          <div className="absolute bottom-2 right-2 rounded bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md">
            受付
          </div>
        )}
      </div>

      {/* キャッチコピー */}
      {catchCopy && (
        <div className="px-3 pb-1 pt-3 text-center">
          <p className="truncate text-sm font-medium text-pink-800">{catchCopy}</p>
        </div>
      )}

      {/* 年齢・身長 */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-3 border-t border-gray-200 pt-2 text-center text-[11px] font-semibold text-gray-500">
          <div>年齢</div>
          <div>身長</div>
        </div>
        <div className="grid grid-cols-3 pt-1 text-center text-sm font-medium text-gray-700">
          <div>{age ? `${age}歳` : '-'}</div>
          <div>{height ? `${height}cm` : '-'}</div>
        </div>
      </div>
    </Link>
  );
};

export default CastCard;
