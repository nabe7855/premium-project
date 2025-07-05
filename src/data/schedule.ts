import { Cast, ScheduleDay, QuickInfo } from '../types/schedule';

export const mockCasts: Cast[] = [
  {
    id: '1',
    name: 'れん',
    photo:
      'https://images.pexels.com/photos/3778361/pexels-photo-3778361.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: true,
    isPopular: false,
    isFirstTime: true,
    workingHours: '14:00 - 22:00',
    status: 'available',
    isFavorite: true,
    isRecentlyViewed: false,
    category: 'cute',
    age: 22,
    description: 'フレッシュな魅力で皆様をお迎えします',
  },
  {
    id: '2',
    name: 'ひろと',
    photo:
      'https://images.pexels.com/photos/3778361/pexels-photo-3778361.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: false,
    isPopular: true,
    isFirstTime: false,
    workingHours: '16:00 - 01:00',
    status: 'limited',
    isFavorite: false,
    isRecentlyViewed: true,
    category: 'popular',
    age: 25,
    description: '人気No.1の実力派キャスト',
  },
  {
    id: '3',
    name: 'ゆうき',
    photo:
      'https://images.pexels.com/photos/3778361/pexels-photo-3778361.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: false,
    isPopular: false,
    isFirstTime: false,
    workingHours: '18:00 - 24:00',
    status: 'full',
    isFavorite: true,
    isRecentlyViewed: false,
    category: 'mature',
    age: 28,
    description: '落ち着いた大人の魅力',
  },
  {
    id: '4',
    name: 'たける',
    photo:
      'https://images.pexels.com/photos/3778361/pexels-photo-3778361.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: false,
    isPopular: true,
    isFirstTime: false,
    workingHours: '15:00 - 23:00',
    status: 'available',
    isFavorite: false,
    isRecentlyViewed: true,
    category: 'sporty',
    age: 24,
    description: 'スポーティーで爽やかな印象',
  },
  {
    id: '5',
    name: 'しょう',
    photo:
      'https://images.pexels.com/photos/3778361/pexels-photo-3778361.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: true,
    isPopular: false,
    isFirstTime: false,
    workingHours: '17:00 - 01:00',
    status: 'limited',
    isFavorite: false,
    isRecentlyViewed: false,
    category: 'elegant',
    age: 26,
    description: 'エレガントで上品な佇まい',
  },
];

export const generateSchedule = (): ScheduleDay[] => {
  const schedule: ScheduleDay[] = [];
  const today = new Date();

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
    const dayOfWeek = dayNames[date.getDay()];

    // Randomly assign casts to days
    const shuffledCasts = [...mockCasts].sort(() => Math.random() - 0.5);
    const numCasts = Math.floor(Math.random() * 5) + 1;
    const dayCasts = shuffledCasts.slice(0, numCasts);

    const recommendedCasts = dayCasts.filter((cast) => cast.isPopular || cast.isNew).slice(0, 2);

    schedule.push({
      date: dateStr,
      dayOfWeek,
      casts: dayCasts,
      recommendedCasts,
    });
  }

  return schedule;
};

export const getQuickInfo = (schedule: ScheduleDay[]): QuickInfo => {
  const today = schedule[0];
  const tomorrow = schedule[1];

  return {
    todayAvailable: today?.casts.filter((cast) => cast.status === 'available').length || 0,
    tomorrowRecommended: tomorrow?.recommendedCasts.length || 0,
    availableNow: today?.casts.filter((cast) => cast.status !== 'full').length || 0,
  };
};
