export interface Cast {
  id: string;
  name: string;
  catchphrase: string;
  avatar: string;
  images: string[];
  age: number;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  tags: string[];
  location: string;
  bookingCount: number;
  responseRate: number;
  responseTime: string;
  services?: { name: string; price: number }[];
  profile: {
    introduction: string;
    experience: string;
    specialties: string[];
    hobbies: string[];
  };
  story: string;
  availability: { [key: string]: string[] };
  radarData: Array<{
    label: string;
    value: number;
    emoji: string;
  }>;
  mbtiType: string;
  faceType: string[];
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  uploadDate: string;
  platform: 'youtube' | 'instagram' | 'tiktok';
  url: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface Review {
  id: string;
  castId: string;
  rating: number;
  comment: string;
  date: string;
  author: string;
  tags: string[];
}