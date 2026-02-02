export type SectionType =
  | 'hero'
  | 'campaign'
  | 'cast_list'
  | 'ranking'
  | 'gallery'
  | 'text_block'
  | 'cta'
  | 'sns_links'
  | 'video'
  | 'price';

export interface TextStyle {
  x: number; // 0-100 (%)
  y: number; // 0-100 (%)
  size: number; // font-size in px
}

export interface SectionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: any[]; // For lists like gallery or cast
  videoUrl?: string;
  accentColor?: string;
  date?: string;
  location?: string;
  price?: string;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  buttonStyle?: TextStyle;
}

export interface SectionData {
  id: string;
  type: SectionType;
  content: SectionContent;
}

export interface PageData {
  id: string;
  title: string;
  status: 'published' | 'private';
  updatedAt: number;
  sections: SectionData[];
  thumbnailUrl?: string;
  shortDescription?: string;
  targetStoreSlugs?: string[];
}
