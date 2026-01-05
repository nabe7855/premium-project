
export interface Cast {
  id: number;
  name: string;
  age: number;
  height: number;
  comment: string;
  status: string;
  tags: string[];
  imageUrl: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Review {
  id: number;
  stars: number;
  text: string;
  user: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface Campaign {
  id: number;
  title: string;
  desc: string;
  badge: string;
  color: 'primary' | 'secondary';
  icon: string;
  imageUrl: string;
}
