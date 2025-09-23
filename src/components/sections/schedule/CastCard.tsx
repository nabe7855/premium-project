import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Cast } from '@/types/schedule';

// 状態名とCSSクラスを対応付けるマップ
const STATUS_CLASS: Record<string, string> = {
  '予約可能': 'schedule-available',
  '残りあとわずか': 'schedule-limited',
  '満員御礼': 'schedule-full',
  '応相談': 'schedule-negotiable',
  default: 'schedule-default',
};

interface CastCardProps {
  cast: Cast;
  storeSlug: string;
  onBooking: (castId: string) => void;
}

const CastCard: React.FC<CastCardProps> = ({ cast, storeSlug, onBooking }) => {
  useEffect(() => {
    console.log(`🧩 CastCard [${cast.name}] props:`, cast);

    if (!cast.scheduleStatus) {
      console.warn(`⚠️ ${cast.name} の scheduleStatus が未設定です`, cast);
    } else {
      console.log(`✅ ${cast.name} の scheduleStatus:`, cast.scheduleStatus);
    }

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

  // ✅ 状態に応じたクラスを決定
  const statusClass =
    STATUS_CLASS[cast.scheduleStatus ?? 'default'] || STATUS_CLASS.default;

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
            {/* スケジュール状態 */}
            <span className={`inline-flex items-center ${statusClass}`}>
              {cast.scheduleStatus ?? '未設定'}
            </span>

            {/* ボタン群 */}
            <div className="flex space-x-2">
              <button
                onClick={() => onBooking(cast.id)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors bg-pink-500 hover:bg-pink-600 text-white"
              >
                今すぐ予約
              </button>

              <Link
                href={`/store/${storeSlug}/cast/${cast.slug}`}
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
