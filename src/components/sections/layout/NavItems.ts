// src/components/layout/NavItems.ts
import {
  Users,
  Calendar,
  MessageCircle,
  Image,
  Video,
  Mail,
  Briefcase,
  Phone,
  Shield,
  Megaphone,
  BookOpenText,
} from 'lucide-react';

export const primaryNavItems = [
  {
    name: 'はじめての方へ',
    href: '/guide',
    icon: BookOpenText,
  },
  {
    name: 'セラピスト一覧',
    href: '/cast-list',
    icon: Users,
  },
  {
    name: '本日の出勤情報',
    href: '/schedule',
    icon: Calendar,
  },
  {
    name: '口コミ・レビュー',
    href: '/reviews',
    icon: MessageCircle,
  },
  {
    name: '写メ日記（更新中）',
    href: '/diary',
    icon: Image,
    hasUpdate: true,
  },
  {
    name: '紹介動画',
    href: '/videos',
    icon: Video,
  },
];

export const secondaryNavItems = [
  {
    name: '最新のお知らせ',
    href: '/news',
    icon: Megaphone,
    hasUpdate: true,
  },
  {
    name: '求人・採用情報',
    href: '/recruit',
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
    href: '/privacy',
    icon: Shield,
  },
];
