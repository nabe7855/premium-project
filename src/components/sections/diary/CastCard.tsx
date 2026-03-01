'use client';
import BookingModal from '@/components/sections/casts/modals/BookingModal';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface CastCardProps {
  cast: {
    id?: string;
    slug?: string;
    storeSlug?: string;
    name: string;
    avatar: string;
    status: string;
    postsThisMonth: number;
    totalLikes: number;
    lastPost: string;
  };
  expanded?: boolean;
}

const CastCard: React.FC<CastCardProps> = ({ cast, expanded = false }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBookingModalOpen = () => setIsBookingModalOpen(true);
  const handleBookingModalClose = () => setIsBookingModalOpen(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return '本日出勤中';
      case 'busy':
        return '予約中';
      case 'offline':
        return '次の出勤は明日';
      default:
        return 'ステータス不明';
    }
  };

  const storeSlug = cast.storeSlug || 'fukuoka'; // フォールバック
  const castId = cast.id || '';
  const castSlug = cast.slug || '';

  return (
    <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <Link
          href={`/store/${storeSlug}/${castSlug}`}
          className="relative transition-transform active:scale-95"
        >
          <img
            src={cast.avatar}
            alt={cast.name}
            className="h-12 w-12 rounded-full object-cover sm:h-16 sm:w-16"
          />
          <div
            className={`absolute -bottom-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 ${getStatusColor(cast.status)} rounded-full border-2 border-white`}
          />
        </Link>

        <div className="flex-1">
          <Link href={`/store/${storeSlug}/${castSlug}`} className="group mb-1 inline-block">
            <h3 className="text-base font-bold text-gray-800 transition-colors group-hover:text-pink-600 sm:text-lg">
              {cast.name}
            </h3>
          </Link>
          <p className="mb-2 text-xs font-medium text-green-600 sm:text-sm">
            {getStatusText(cast.status)}
          </p>

          {expanded && (
            <div className="mb-3 grid grid-cols-3 gap-2 text-xs sm:mb-4 sm:gap-4 sm:text-sm">
              <div className="text-center">
                <div className="text-gray-600">今月の投稿</div>
                <div className="font-bold text-gray-800">{cast.postsThisMonth}件</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">総いいね</div>
                <div className="font-bold text-gray-800">{cast.totalLikes.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">最終投稿</div>
                <div className="font-bold text-gray-800">{cast.lastPost}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 sm:mt-4">
        <button
          onClick={handleBookingModalOpen}
          className="w-full rounded-lg bg-pink-500 px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-pink-600 sm:px-4 sm:text-sm"
        >
          このキャストを予約する
        </button>
      </div>

      {expanded && (
        <div className="mt-2 space-y-2">
          <Link
            href={`/store/${storeSlug}/${castSlug}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-pink-50 px-3 py-2 text-xs font-bold text-pink-600 transition-colors hover:bg-pink-100 sm:px-4 sm:text-sm"
          >
            <UserCircle size={16} />
            プロフィールを見る
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/store/${storeSlug}/schedule/schedule?castId=${castId}`}
              className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs text-gray-700 transition-colors hover:bg-gray-200 sm:px-4 sm:text-sm"
            >
              スケジュールを見る
            </Link>
            <Link
              href={`/store/${storeSlug}/diary/cast/${encodeURIComponent(cast.name)}`}
              className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs text-gray-700 transition-colors hover:bg-gray-200 sm:px-4 sm:text-sm"
            >
              他の日記を見る
            </Link>
          </div>
        </div>
      )}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          castName={cast.name}
          castId={castId}
          onClose={handleBookingModalClose}
        />
      )}
    </div>
  );
};

export default CastCard;
