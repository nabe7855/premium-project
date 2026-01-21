export interface PricePlan {
  minutes: number;
  price: number;
  subLabel?: string;
  discountInfo?: string;
}

export interface DesignationFees {
  free: number;
  first: number;
  follow: number;
  note?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  icon: string;
  plans: PricePlan[];
  extensionPer30min: number;
  designationFees: DesignationFees;
  notes?: string;
}

export interface TransportItem {
  id: string;
  area: string;
  price: number | 'negotiable';
  label: string;
  note?: string;
}

export interface OptionItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isRelative?: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  needEntry: boolean;
  accentText: string;
  priceInfo?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StoreConfig {
  id: string;
  storeName: string;
  slug: string; // URL識別子
  lastUpdated: string;
  courses: Course[];
  transportAreas: TransportItem[];
  options: OptionItem[];
  campaigns: Campaign[];
  faqs: FAQItem[];
}

export type Category = 'COURSES' | 'TRANSPORT' | 'OPTIONS' | 'DISCOUNTS';
export type AppView = 'PUBLIC' | 'ADMIN' | 'EDITOR';
