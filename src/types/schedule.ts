export interface Cast {
  id: string;
  name: string;
  photo: string;
  isNew: boolean;
  isPopular: boolean;
  isFirstTime: boolean;
  workingHours: string;
  status: 'available' | 'limited' | 'full';
  isFavorite: boolean;
  isRecentlyViewed: boolean;
  category: string;
  age: number;
  description: string;
}

export interface ScheduleDay {
  date: string;
  dayOfWeek: string;
  casts: Cast[];
  recommendedCasts: Cast[];
}

export interface FilterOptions {
  favoritesOnly: boolean;
  recentlyViewedFirst: boolean;
  availableOnly: boolean;
}

export interface QuickInfo {
  todayAvailable: number;
  tomorrowRecommended: number;
  availableNow: number;
}
