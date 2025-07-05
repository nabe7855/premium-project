import React from 'react';
import { Star, Eye } from 'lucide-react';
import { Cast } from '@/types/schedule';
import CastCard from './CastCard';

interface PersonalizationSectionProps {
  recommendedCasts: Cast[];
  recentlyViewedCasts: Cast[];
  onBooking: (castId: string) => void;
  onFavoriteToggle: (castId: string) => void;
}

const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({
  recommendedCasts,
  recentlyViewedCasts,
  onBooking,
  onFavoriteToggle,
}) => {
  return (
    <div className="mb-8">
      {/* Recommended Section */}
      {recommendedCasts.length > 0 && (
        <div className="mb-6 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
          <div className="mb-4 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Star className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">あなたへのおすすめ</h3>
          </div>
          <div className="space-y-3">
            {recommendedCasts.map((cast) => (
              <CastCard
                key={cast.id}
                cast={cast}
                onBooking={onBooking}
                onFavoriteToggle={onFavoriteToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewedCasts.length > 0 && (
        <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
          <div className="mb-4 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">最近チェックしたキャスト</h3>
          </div>
          <div className="space-y-3">
            {recentlyViewedCasts.map((cast) => (
              <CastCard
                key={cast.id}
                cast={cast}
                onBooking={onBooking}
                onFavoriteToggle={onFavoriteToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizationSection;
