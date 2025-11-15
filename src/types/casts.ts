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
  profile: {
    introduction: string;
    experience: string;
    specialties: string[];
    hobbies: string[];
  };
  story: string;
  availability: {
    [key: string]: string[]; // date: available times
  };
  radarData: {
    label: string;
    value: number;
    emoji: string;
  }[];
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

export interface SearchFilters {
  ageRange: [number, number];
  tags: string[];
  availability: string;
  rating: number;
}

export interface ReviewFormErrors {
  rating?: string;
  comment?: string;
}
