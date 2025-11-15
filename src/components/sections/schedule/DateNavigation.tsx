import React from 'react';
import { Calendar } from 'lucide-react';
import { ScheduleDay } from '@/types/schedule';

interface DateNavigationProps {
  schedule: ScheduleDay[];
  activeDate: string;
  onDateChange: (date: string) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ schedule, activeDate, onDateChange }) => {
  const todayDate = schedule[0]?.date;
  const tomorrowDate = schedule[1]?.date;

  const scrollToDate = (date: string) => {
    const element = document.getElementById(`date-${date}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onDateChange(date);
  };

  return (
    <div className="sticky top-[73px] z-40 mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">日程を選択</h3>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>

      {/* Quick Selection */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => scrollToDate(todayDate)}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeDate === todayDate
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          今日 ({schedule[0]?.casts.length || 0}名)
        </button>
        <button
          onClick={() => scrollToDate(tomorrowDate)}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeDate === tomorrowDate
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          明日 ({schedule[1]?.casts.length || 0}名)
        </button>
      </div>

      {/* Date Scroll */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {schedule.map((day) => (
          <button
            key={day.date}
            onClick={() => scrollToDate(day.date)}
            className={`flex-shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeDate === day.date
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-center">
              <div className="text-xs">{day.date}</div>
              <div className="text-xs opacity-75">({day.dayOfWeek})</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateNavigation;
