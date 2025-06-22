
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaCommentDots } from "react-icons/fa";
import { FaLine, FaTwitter, FaInstagram } from "react-icons/fa6";

interface CastCardProps {
  customID: string;
  name: string;
  catchCopy?: string;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  type?: string;
  imageUrl?: string;
  reviewCount?: number;
  sns?: {
    line?: string;
    twitter?: string;
    instagram?: string;
  };
}

const CastCard: React.FC<CastCardProps> = ({
  customID,
  name,
  catchCopy,
  age,
  height,
  weight,
  type,
  imageUrl,
  reviewCount,
  sns,
}) => {
  return (
    <Link href={`/cast/${customID}`}>
      <div className="bg-pink-50 rounded-2xl overflow-hidden shadow-lg max-w-xs mx-auto transition-transform hover:scale-105">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={400}
            className="w-full h-auto object-cover"
            unoptimized
          />
        )}
        <div className="p-4 text-center">
          <h2 className="text-pink-700 font-semibold text-lg">
            {name}
            {catchCopy && (
              <span className="text-pink-500 text-sm ml-1">（{catchCopy}）</span>
            )}
          </h2>
          {age && <p className="text-gray-500 text-sm mt-1">〔 {age} 歳 〕</p>}

          <div className="grid grid-cols-3 gap-2 text-sm mt-3 bg-white border border-pink-100 rounded-xl p-2">
            <div>
              <div className="text-gray-500">身長</div>
              <div>{height ?? "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">体重</div>
              <div>{weight ?? "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">タイプ</div>
              <div>{type ?? "-"}</div>
            </div>
          </div>

          {reviewCount !== undefined && (
            <div className="mt-3 text-pink-600 text-sm flex items-center justify-center gap-1">
              <FaCommentDots />
              <span>{reviewCount}件の口コミがあります</span>
            </div>
          )}

          {sns && (
            <div className="flex justify-center gap-3 mt-3 text-2xl text-gray-500">
              {sns.line && (
                <a href={sns.line} target="_blank" rel="noopener noreferrer">
                  <FaLine className="text-green-500" />
                </a>
              )}
              {sns.twitter && (
                <a href={sns.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-sky-500" />
                </a>
              )}
              {sns.instagram && (
                <a href={sns.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-pink-400" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CastCard;
