export interface Video {
  id: string;
  title: string;
  cast: string;
  thumbnail: string;
  previewUrl: string;
  duration: number;
  category: 'healing' | 'romance' | 'motivation' | 'sleep' | 'asmr';
  mood: 'calm' | 'exciting' | 'romantic' | 'energetic' | 'sleepy';
  tags: string[];
  description: string;
  uploadDate: Date;
  viewCount: number;
  isFavorite: boolean;
  lastWatched?: Date;
  watchProgress?: number;
}

export interface MoodRecommendation {
  mood: 'healing' | 'romance' | 'motivation' | 'sleep';
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface TimeBasedTheme {
  name: string;
  background: string;
  accent: string;
  text: string;
  cardBg: string;
}
