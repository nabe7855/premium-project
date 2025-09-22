'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateSchedule, getQuickInfo } from '@/data/schedule';
import { ScheduleDay as ScheduleDayType, FilterOptions } from '@/types/schedule';
import QuickInfoBar from '@/components/sections/schedule/QuickInfoBar';
import DateNavigation from '@/components/sections/schedule/DateNavigation';
import FilterSection from '@/components/sections/schedule/FilterSection';
// ❌ PersonalizationSection 削除
import ScheduleDay from '@/components/sections/schedule/ScheduleDay';

function App() {
  const [schedule, setSchedule] = useState<ScheduleDayType[]>([]);
  const [activeDate, setActiveDate] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    favoritesOnly: false,
    recentlyViewedFirst: false,
    availableOnly: false,
  });

  useEffect(() => {
    const generatedSchedule = generateSchedule();
    setSchedule(generatedSchedule);
    setActiveDate(generatedSchedule[0]?.date || '');
  }, []);

  const quickInfo = useMemo(() => getQuickInfo(schedule), [schedule]);

  const filteredSchedule = useMemo(() => {
    return schedule.map((day) => {
      let casts = [...day.casts];

      if (filters.favoritesOnly) {
        casts = casts.filter((cast) => cast.isFavorite);
      }

      if (filters.availableOnly) {
        casts = casts.filter((cast) => cast.status !== 'full');
      }

      if (filters.recentlyViewedFirst) {
        casts.sort((a, b) => {
          if (a.isRecentlyViewed && !b.isRecentlyViewed) return -1;
          if (!a.isRecentlyViewed && b.isRecentlyViewed) return 1;
          return 0;
        });
      }

      return { ...day, casts };
    });
  }, [schedule, filters]);

  const handleBooking = (castId: string) => {
    console.log('Booking cast:', castId);
  };

  const handleFavoriteToggle = (castId: string) => {
    console.log('Toggle favorite:', castId);
  };

  const handleDateChange = (date: string) => {
    setActiveDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100"
            >
              <span className="text-xl text-red-500">🍓</span>
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="text-2xl font-bold text-gray-900"
              >
                Schedule
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                className="font-serif text-sm text-gray-600"
              >
                あなたのご予定に、素敵な"いちご一会"を。
              </motion.p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <QuickInfoBar quickInfo={quickInfo} />

        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <div className="hidden lg:block">
              <DateNavigation
                schedule={schedule}
                activeDate={activeDate}
                onDateChange={handleDateChange}
              />
              <FilterSection filters={filters} onFilterChange={setFilters} />
            </div>

            <div className="lg:hidden">
              <DateNavigation
                schedule={schedule}
                activeDate={activeDate}
                onDateChange={handleDateChange}
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* ❌ PersonalizationSection を削除したので「おすすめキャスト」「最近チェックしたキャスト」は表示されない */}
            <div className="space-y-8">
              {filteredSchedule.map((day, index) => (
                <ScheduleDay
                  key={day.date}
                  day={day}
                  onBooking={handleBooking}
                  onFavoriteToggle={handleFavoriteToggle}
                  isToday={index === 0}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
            >
              <span className="text-2xl text-red-500">🍓</span>
            </motion.div>
            <p className="font-serif text-sm text-gray-600">素敵なひとときをお過ごしください</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
