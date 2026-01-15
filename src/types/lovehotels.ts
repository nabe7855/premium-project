export interface Hotel {
  id: string;
  name: string;
  prefecture: string;
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
  distanceFromStation: string;
  roomCount: number;
  description?: string;
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

export interface Review {
  id: string;
  hotelId: string;
  userName: string;
  rating: number;
  cleanliness: number;
  service: number;
  rooms: number;
  value: number;
  content: string;
  date: string;
  roomNumber?: string;
  stayType?: 'lodging' | 'rest'; // 宿泊 or 休憩
  cost?: number; // 利用金額
  photos?: ReviewPhoto[]; // カテゴリ付き写真
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
  rating?: number;
  sort: 'price_asc' | 'rating_desc' | 'newest';
}
