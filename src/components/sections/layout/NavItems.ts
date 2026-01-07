// src/components/layout/NavItems.ts
import {
  BookOpenText,
  Briefcase,
  Calendar,
  Hotel,
  Image,
  Mail,
  Megaphone,
  MessageCircle,
  Phone,
  Shield,
  Users,
  Video,
} from 'lucide-react';

export const primaryNavItems = [
  {
    name: 'はじめての方へ',
    href: '/guide/guide',
    icon: BookOpenText,
  },
  {
    name: 'セラピスト一覧',
    href: '/cast-list',
    icon: Users,
  },
  {
    name: '本日の出勤情報',
    href: '/schedule/schedule',
    icon: Calendar,
  },
  {
    name: '口コミ・レビュー',
    href: '/reviews/reviews',
    icon: MessageCircle,
  },
  {
    name: '写メ日記（更新中）',
    href: '/diary/diary-list',
    icon: Image,
    hasUpdate: true,
  },
  {
    name: '動画',
    href: '/videos/videos',
    icon: Video,
  },
  {
    name: 'おすすめホテル一覧',
    href: '/hotel',
    icon: Hotel,
    isAbsolute: false,
  },
];

export const secondaryNavItems = [
  {
    name: '最新のお知らせ',
    href: '/',
    icon: Megaphone,
    hasUpdate: true,
  },
  {
    name: '求人・採用情報',
    href: '/Announcement-information/recruit',
    icon: Briefcase,
  },
  {
    name: 'お問い合わせ',
    href: '/contact',
    icon: Phone,
  },
  {
    name: 'メディア取材のご連絡',
    href: '/media-contact',
    icon: Mail,
  },
  {
    name: 'プライバシーポリシー',
    href: '/Announcement-information/policy',
    icon: Shield,
  },
];
