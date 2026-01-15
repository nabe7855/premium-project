import { NavItem } from '@/types/test2';
import {
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  Mail,
  Megaphone,
  MessageSquare,
  ShieldCheck,
  Users,
} from 'lucide-react';

export const COLORS = {
  strawberry: '#D14D72',
  pastelPink: '#FFF5F5',
  gold: '#C5A059',
  textDark: '#4A2B2F',
  lineGreen: '#06C755',
  recruitYellow: '#F2D34E',
  oceanBlue: '#3C8296',
};

export const SHOP_ITEMS = [
  { id: 'tokyo', label: '東京店', emoji: '🌸', link: '#' },
  { id: 'osaka', label: '大阪店', emoji: '🍮', link: '#' },
  { id: 'nagoya', label: '名古屋店', emoji: '🍓', link: '#' },
  { id: 'fukuoka', label: '福岡店', emoji: '🍜', link: '#' },
  { id: 'yokohama', label: '横浜店', emoji: '⚓', link: '#' },
];

export const GUIDE_ITEMS: NavItem[] = [
  { id: 'first', label: 'はじめての方へ', icon: <BookOpen size={20} />, link: '#' },
  { id: 'hotel', label: 'ホテル一覧', icon: <Building2 size={20} />, link: '#' },
];

export const CONTENT_ITEMS: NavItem[] = [
  { id: 'therapists', label: 'セラピスト一覧', icon: <Users size={22} />, link: '#' },
  { id: 'schedule', label: '本日の出勤情報', icon: <Calendar size={22} />, link: '#' },
  { id: 'review', label: '口コミ・レビュー', icon: <MessageSquare size={22} />, link: '#' },
  { id: 'diary', label: '写メ日記（更新中）', icon: <Camera size={22} />, link: '#', isLogo: true },
];

export const INFO_ITEMS: NavItem[] = [
  { id: 'news', label: '最新のお知らせ', icon: <Megaphone size={18} />, link: '#', isLogo: true },
  { id: 'recruit', label: '求人・採用情報', icon: <Briefcase size={18} />, link: '#' },
  { id: 'media', label: 'メディア取材のご連絡', icon: <Mail size={18} />, link: '#' },
  { id: 'privacy', label: 'プライバシーポリシー', icon: <ShieldCheck size={18} />, link: '#' },
];
