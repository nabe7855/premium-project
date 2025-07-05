import React from 'react';
import { Heart, Clock, Star, Sparkles, Calendar } from 'lucide-react';
import { Cast } from '@/types/schedule';

interface CastCardProps {
  cast: Cast;
  onBooking: (castId: string) => void;
  onFavoriteToggle: (castId: string) => void;
}

const CastCard: React.FC<CastCardProps> = ({ cast, onBooking, onFavoriteToggle }) => {
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
    <div
      className={`group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-pink-200 hover:shadow-lg ${cast.isFavorite ? 'ring-2 ring-pink-200' : ''}`}
    >
      {/* Favorite indicator */}
      {cast.isFavorite && (
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500">
          <Heart className="h-3 w-3 fill-white text-white" />
        </div>
      )}

      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={cast.photo}
            alt={cast.name}
            className="h-16 w-16 rounded-full border-2 border-gray-100 object-cover transition-colors group-hover:border-pink-200"
            loading="lazy"
          />
          {/* Status indicator */}
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
              {cast.isNew && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  <Sparkles className="mr-1 h-3 w-3" />
                  新人
                </span>
              )}
              {cast.isPopular && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  <Star className="mr-1 h-3 w-3" />
                  人気
                </span>
              )}
              {cast.isFirstTime && (
                <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                  <Calendar className="mr-1 h-3 w-3" />
                  本日初出勤
                </span>
              )}
            </div>
          </div>

          <div className="mb-2 flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{cast.workingHours}</span>
          </div>

          <p className="mb-2 text-sm text-gray-500">{cast.description}</p>

          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor()}`}
            >
              {getStatusText()}
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onFavoriteToggle(cast.id)}
                className={`rounded-full p-2 transition-colors ${
                  cast.isFavorite
                    ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                aria-label="お気に入り"
              >
                <Heart className={`h-4 w-4 ${cast.isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onBooking(cast.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${getButtonColor()}`}
              >
                {getButtonText()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastCard;
