export type RegionId =
  | 'hokkaido'
  | 'tohoku'
  | 'kanto'
  | 'chubu'
  | 'kansai'
  | 'chugoku'
  | 'shikoku'
  | 'kyushu';

export interface Hotel {
  id: string;
  name: string;
  prefecture: string;
  prefectureId?: string;
  city: string;
  cityId?: string; // Added for correct routing
  area: string;
  address: string;
  phone: string;
  website: string;
  imageUrl: string;
  images?: { url: string; category: string }[];
  minPriceRest?: number; // Legacy
  minPriceStay?: number; // Legacy
  restPriceMinWeekday?: number;
  restPriceMaxWeekday?: number;
  restPriceMinWeekend?: number;
  restPriceMaxWeekend?: number;
  stayPriceMinWeekday?: number;
  stayPriceMaxWeekday?: number;
  stayPriceMinWeekend?: number;
  stayPriceMaxWeekend?: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  services: string[];
  purposes: string[];
  distanceFromStation: string;
  accessInfo?: { stations: string[]; interchanges: string[]; parking: string } | null;
  roomCount: number;
  description?: string;
  aiDescription?: string;
  priceDetails?: any;
  status?: 'published' | 'unpublished' | 'draft';
}

export interface FeatureArticle {
  id: string;
  prefectureId: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: string;
  tags: string[];
  relatedHotelIds: string[];
}

export interface ReviewPhoto {
  url: string;
  category: string;
}

export interface Purpose {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  hotelId: string;
  userName: string;
  rating: number;
  cleanliness: number;
  service: number;
  design: number;
  facilities: number;
  rooms: number;
  value: number;
  content: string;
  date: string;
  roomNumber?: string;
  stayType?: 'lodging' | 'rest' | 'pro_report'; // 宿泊 or 休憩 or プロレポート
  cost?: number; // 利用金額
  photos?: ReviewPhoto[]; // カテゴリ付き写真
  helpfulCount?: number;
  isCast?: boolean;
  isVerified?: boolean;
  isRecommended?: boolean;
}

export interface Prefecture {
  id: string;
  name: string;
  count: number;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
  count: number;
  areas?: string[];
}

export interface SearchFilters {
  prefecture?: string;
  city?: string;
  area?: string;
  budgetMin?: number;
  budgetMax?: number;
  type?: 'rest' | 'stay';
  amenities: string[];
  purposes: string[];
  rating?: number;
  sort: 'price_asc' | 'rating_desc' | 'newest';
}
