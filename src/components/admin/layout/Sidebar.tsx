'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  UsersIcon,
  StorefrontIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  PresentationChartLineIcon,
  PencilIcon,
  SparklesIcon,
  DocumentTextIcon,
} from '../admin-assets/Icons';

interface SidebarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

// Navigation item component
const NavItem: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  setOpen: (isOpen: boolean) => void;
}> = ({ href, icon, label, isActive, setOpen }) => (
  <Link
    href={href}
    onClick={() => setOpen(false)} // モバイル時は閉じる
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-brand-accent text-white shadow-lg'
        : 'text-brand-text-secondary hover:bg-brand-secondary hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </Link>
);

// Main Sidebar component
export default function Sidebar({ isOpen, setOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/admin', icon: <ChartBarIcon />, label: 'ダッシュボード' },
    { href: '/admin/admin/all-cast', icon: <UsersIcon />, label: '全キャスト管理' },
    { href: '/admin/admin/stores/casts', icon: <StorefrontIcon />, label: '店舗別キャスト管理' },
    { href: '/admin/admin/stores', icon: <BuildingStorefrontIcon />, label: '店舗管理' },
    { href: '/admin/admin/advertising', icon: <PresentationChartLineIcon />, label: '広告・集客' },
    { href: '/admin/admin/ai/copywriter', icon: <PencilIcon />, label: 'AI広告コピー生成' },
    { href: '/admin/admin/advertising/list', icon: <DocumentTextIcon />, label: '投稿済み広告' },
    { href: '/admin/admin/ai/generate-intro', icon: <SparklesIcon />, label: 'AI新人紹介生成' },
    { href: '/admin/admin/intro-list', icon: <DocumentTextIcon />, label: '投稿済み紹介' },
  ];

  return (
    <>
      {/* モバイル用オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* サイドバー */}
      <aside
        className={`absolute md:relative z-40 flex-shrink-0 w-64 bg-brand-secondary h-full flex flex-col p-4 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 mb-4">
          <h1 className="text-2xl font-bold text-white">OVERLORD</h1>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-brand-text-secondary"
          >
            <XMarkIcon />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              setOpen={setOpen}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
