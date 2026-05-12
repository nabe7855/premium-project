import { InterviewArticleType } from '@/lib/actions/interview';

export interface Participant {
  id: string; // cast_id or arbitrary staff id
  name: string;
  photoUrl: string;
  type: 'cast' | 'staff';
}

export interface DialogueItem {
  id: string;
  type: 'dialogue' | 'narration' | 'photo' | 'editor_note';
  speaker?: string; // Participant ID or 'interviewer' / 'cast' legacy keys
  speaker_name?: string;
  text?: string;
  photo_key?: string;
  selected?: boolean; // For bulk operations
}

export interface DialogueSection {
  id: string;
  heading: string;
  items: DialogueItem[];
}

export interface ProfileField {
  key: string;
  value: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface InterviewData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string;
  status: 'draft' | 'published';
  author_name: string;
  seo_title: string;
  seo_description: string;
  tags: string[];
  
  // Meta
  article_type: InterviewArticleType;
  area: string;
  series_slug: string;
  vol_number: number;
  seo_keywords: string;
  writer_note: string[];
  
  // Complex structures
  sections: DialogueSection[];
  profile_fields: ProfileField[];
  faqs: FAQItem[];
  photos: Record<string, string>;
  
  // Participants
  participants: Participant[];
}
