export type StoreLocation = 'tokyo' | 'osaka' | 'nagoya';

export interface Store {
  id: StoreLocation;
  name: string;
  displayName: string;
  catchphrase: string;
  heroTitle: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface CastMember {
  id: string;
  name: string;
  image: string;
  isWorking: boolean;
  schedule?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'new-staff' | 'event' | 'diary' | 'media';
  excerpt: string;
}

export interface StoreData {
  id: string;
  name: string;
  catchCopy: string;
  link: string;
  hashtags: string[];
  gradient: string;
}
