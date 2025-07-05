'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Bell, Menu, X } from 'lucide-react';
import { generateSchedule, getQuickInfo, mockCasts } from '@/data/schedule';
import { ScheduleDay as ScheduleDayType, FilterOptions } from '@/types/schedule';
import QuickInfoBar from '@/components/sections/schedule/QuickInfoBar';
import DateNavigation from '@/components/sections/schedule/DateNavigation';
import FilterSection from '@/components/sections/schedule/FilterSection';
import PersonalizationSection from '@/components/sections/schedule/PersonalizationSection';
import ScheduleDay from '@/components/sections/schedule/ScheduleDay';
//import EmptyState from '@/components/sections/schedule/EmptyState';

function App() {
  const [schedule, setSchedule] = useState<ScheduleDayType[]>([]);
  const [activeDate, setActiveDate] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    favoritesOnly: false,
    recentlyViewedFirst: false,
    availableOnly: false,
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);

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

  const recommendedCasts = useMemo(() => {
    return mockCasts.filter((cast) => cast.isPopular || cast.isNew).slice(0, 3);
  }, []);

  const recentlyViewedCasts = useMemo(() => {
    return mockCasts.filter((cast) => cast.isRecentlyViewed).slice(0, 3);
  }, []);

  const handleBooking = (castId: string) => {
    console.log('Booking cast:', castId);
    // Implement booking logic
  };

  const handleFavoriteToggle = (castId: string) => {
    console.log('Toggle favorite:', castId);
    // Implement favorite toggle logic
  };

  const handleDateChange = (date: string) => {
    setActiveDate(date);
  };

  const handleNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setShowNotificationBanner(false);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <span className="text-xl text-red-500">🍓</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
                <p className="font-serif text-sm text-gray-600">
                  あなたのご予定に、素敵な"いちご一会"を。
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2 text-gray-400 hover:text-gray-600 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="hidden items-center space-x-2 lg:flex">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">本日より2週間分のスケジュール</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {showNotificationBanner && (
        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 text-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5" />
              <span className="text-sm font-medium">お気に入りキャストの出勤をお知らせします</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNotificationPermission}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-pink-600 transition-colors hover:bg-pink-50"
              >
                許可する
              </button>
              <button
                onClick={() => setShowNotificationBanner(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">メニュー</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <FilterSection filters={filters} onFilterChange={setFilters} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Quick Info Bar */}
        <QuickInfoBar quickInfo={quickInfo} />

        {/* Desktop Layout */}
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

            {/* Mobile Date Navigation */}
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
            {/* Personalization Section */}
            <PersonalizationSection
              recommendedCasts={recommendedCasts}
              recentlyViewedCasts={recentlyViewedCasts}
              onBooking={handleBooking}
              onFavoriteToggle={handleFavoriteToggle}
            />

            {/* Schedule List */}
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl text-red-500">🍓</span>
            </div>
            <p className="font-serif text-sm text-gray-600">素敵なひとときをお過ごしください</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
