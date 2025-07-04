'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  X,
  Heart,
  Phone,
  Calendar,
  Users,
  FileText,
  MessageCircle,
  Video,
  Briefcase,
  Star,
  Camera,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { StoreLocation } from '@/types/store';

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const pathParts = pathname.split('/').filter(Boolean);
  const currentStore = pathParts[0] as StoreLocation;

  // ✅ 不要なコードを削除
  // const _store = stores[currentStore] || stores.tokyo;

  const navItems = [
    { label: 'ご案内', icon: FileText, href: `/${currentStore}/guide` },
    { label: '店舗ニュース', icon: MessageCircle, href: `/${currentStore}/news` },
    { label: 'キャスト一覧', icon: Users, href: `/${currentStore}/cast` },
    { label: '出勤スケジュール', icon: Calendar, href: `/${currentStore}/schedule` },
    { label: '口コミ', icon: Star, href: `/${currentStore}/reviews` },
    { label: '写メ日記', icon: Camera, href: `/${currentStore}/diary` },
    { label: '動画', icon: Video, href: `/${currentStore}/videos` },
    { label: '求人情報', icon: Briefcase, href: `/${currentStore}/recruitment` },
    { label: 'ご予約', icon: Phone, href: `/${currentStore}/reservation`, isPrimary: true },
    { label: 'メディア様問い合わせ', icon: HelpCircle, href: `/${currentStore}/media-contact` },
    { label: 'プライバシーについて', icon: Shield, href: `/${currentStore}/privacy` },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-pink-50 text-pink-900 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* ロゴ */}
        <Link href={`/${currentStore}`} className="flex items-center space-x-2">
          <Heart className="h-6 w-6 fill-current text-pink-600" />
          <h1 className="text-2xl font-extrabold tracking-wide text-pink-700">
            ストロベリーボーイズ
          </h1>
        </Link>

        {/* 電話番号（PC表示） */}
        <div className="hidden items-center space-x-2 md:flex">
          <Phone className="h-5 w-5 text-pink-600" />
          <a href="tel:05052125818" className="font-medium text-pink-800 hover:underline">
            050-5212-5818
          </a>
        </div>

        {/* モバイルメニュー */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X className="h-7 w-7 text-pink-800" />
          ) : (
            <Menu className="h-7 w-7 text-pink-800" />
          )}
        </button>
      </div>

      {/* ナビゲーション（PC & モバイル） */}
      {pathname !== '/store' && (
        <nav
          className={`bg-pink-100 transition-all duration-300 ease-in-out md:bg-transparent ${
            isOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:justify-center">
            {navItems.map((item) => (
              <li key={item.label} className="text-center md:px-4">
                <Link
                  href={item.href}
                  className="block rounded px-4 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-200 md:hover:bg-transparent md:hover:text-pink-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
