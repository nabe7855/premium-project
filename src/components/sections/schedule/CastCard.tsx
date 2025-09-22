import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Cast } from '@/types/schedule';

interface CastCardProps {
  cast: Cast;
  storeSlug: string; // ✅ 追加
  onBooking: (castId: string) => void;
}

const CastCard: React.FC<CastCardProps> = ({ cast, storeSlug, onBooking }) => {
  useEffect(() => {
    console.log(`🧩 CastCard [${cast.name}] props:`, cast);
    if (cast.statuses && cast.statuses.length > 0) {
      cast.statuses.forEach((s) =>
        console.log(
          `🎨 Status for ${cast.name}: ${s.label} bg=${s.labelColor}, text=${s.textColor}`
        )
      );
    } else {
      console.log(`⚠️ ${cast.name} に statuses がありません`);
    }
  }, [cast]);

  const getStatusText = () => {
    switch (cast.status) {
      case 'available':
        return '予約可';
      case 'limited':
        return '残りわずか';
      case 'full':
        return '満員御礼';
      default:
        return '予約可';
    }
  };

  const getStatusColor = () => {
    switch (cast.status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getButtonText = () => {
    switch (cast.status) {
      case 'available':
        return '今すぐ予約';
      case 'limited':
        return 'お急ぎください';
      case 'full':
        return 'キャンセル待ち';
      default:
        return '今すぐ予約';
    }
  };

  const getButtonColor = () => {
    switch (cast.status) {
      case 'available':
        return 'bg-pink-500 hover:bg-pink-600 text-white';
      case 'limited':
        return 'bg-red-500 hover:bg-red-600 text-white animate-pulse';
      case 'full':
        return 'bg-gray-400 hover:bg-gray-500 text-white';
      default:
        return 'bg-pink-500 hover:bg-pink-600 text-white';
    }
  };

  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-pink-200 hover:shadow-lg">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={cast.photo}
            alt={cast.name}
            className="h-16 w-16 rounded-full border-2 border-gray-100 object-cover transition-colors group-hover:border-pink-200"
            loading="lazy"
          />
          <div
            className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${
              cast.status === 'available'
                ? 'bg-green-400'
                : cast.status === 'limited'
                ? 'bg-yellow-400'
                : 'bg-red-400'
            }`}
          ></div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">{cast.name}</h3>
            <div className="flex space-x-1">
              {cast.statuses.map((status) => (
                <span
                  key={status.id}
                  className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: status.labelColor || '#fce7f3',
                    color: status.textColor || '#9d174d',
                  }}
                >
                  {status.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-2 flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{cast.workingHours}</span>
          </div>

          <p className="mb-2 text-sm text-gray-500">{cast.description}</p>

          <div className="flex items-center justify-between space-x-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor()}`}
            >
              {getStatusText()}
            </span>

            {/* ボタン群 */}
            <div className="flex space-x-2">
              <button
                onClick={() => onBooking(cast.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${getButtonColor()}`}
              >
                {getButtonText()}
              </button>

              {/* ✅ キャスト詳細ページリンク */}
              <Link
                href={`/store/${storeSlug}/cast/${cast.slug}`} // ✅ cast.storeSlug ではなく props から渡す
                className="rounded-full px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                詳細
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastCard;
