import React from 'react';
import { Calendar } from 'lucide-react';
import { ScheduleDay as ScheduleDayType } from '@/types/schedule';
import CastCard from './CastCard';
import EmptyState from './EmptyState';

interface ScheduleDayProps {
  day: ScheduleDayType;
  onBooking: (castId: string) => void;
  onFavoriteToggle: (castId: string) => void;
  isToday?: boolean;
}

const ScheduleDay: React.FC<ScheduleDayProps> = ({
  day,
  onBooking,
  onFavoriteToggle,
  isToday = false,
}) => {
  if (day.casts.length === 0) {
    return (
      <div id={`date-${day.date}`} className="mb-8">
        <h2 className="mb-4 flex items-center space-x-2 text-xl font-medium text-gray-900">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span>
            {day.date}（{day.dayOfWeek}）
          </span>
          {isToday && (
            <span className="rounded-full bg-pink-100 px-2 py-1 text-sm text-pink-800">今日</span>
          )}
        </h2>
        <EmptyState type="no-casts" />
      </div>
    );
  }

  return (
    <div id={`date-${day.date}`} className="mb-8">
      <div className="mb-6">
        <h2 className="mb-2 flex items-center space-x-2 text-xl font-medium text-gray-900">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span>
            {day.date}（{day.dayOfWeek}）
          </span>
          {isToday && (
            <span className="rounded-full bg-pink-100 px-2 py-1 text-sm text-pink-800">今日</span>
          )}
          <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600">
            出勤キャスト{day.casts.length}名
          </span>
        </h2>

        {/* Polka dot divider */}
        <div className="my-4 flex items-center space-x-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
          <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-pink-300"></div>
            <div className="h-2 w-2 rounded-full bg-pink-400"></div>
            <div className="h-2 w-2 rounded-full bg-pink-300"></div>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
        </div>
      </div>

      {/* All casts */}
      <div className="space-y-3">
        {day.casts.map((cast) => (
          <CastCard
            key={cast.id}
            cast={cast}
            onBooking={onBooking}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default ScheduleDay;
