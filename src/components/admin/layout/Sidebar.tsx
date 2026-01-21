'use client';

import { getPendingApplicationsCount } from '@/actions/recruit';
import { getZeroProgressReservationsCount } from '@/actions/reservation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PencilIcon,
  PresentationChartLineIcon,
  SparklesIcon,
  StorefrontIcon,
  UsersIcon,
  XMarkIcon,
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
  badge?: number;
}> = ({ href, icon, label, isActive, setOpen, badge }) => (
  <Link
    href={href}
    onClick={() => setOpen(false)} // モバイル時は閉じる
    className={`relative flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-brand-accent text-white shadow-lg'
        : 'text-brand-text-secondary hover:bg-brand-secondary hover:text-white'
    }`}
  >
    <div className="flex items-center">
      {icon}
      <span className="ml-4">{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className="absolute right-4 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-brand-secondary">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </Link>
);

// Main Sidebar component
export default function Sidebar({ isOpen, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const [reservePendingCount, setReservePendingCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const pCount = await getPendingApplicationsCount();
      setPendingCount(pCount);

      const rCount = await getZeroProgressReservationsCount();
      setReservePendingCount(rCount);
    };
    fetchCounts();

    // 1分ごとに更新
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { href: '/admin/admin', icon: <ChartBarIcon />, label: 'ダッシュボード' },
    { href: '/admin/admin/all-cast', icon: <UsersIcon />, label: '全キャスト管理' },
    { href: '/admin/admin/stores/casts', icon: <StorefrontIcon />, label: '店舗別キャスト管理' },
    { href: '/admin/admin/stores', icon: <BuildingStorefrontIcon />, label: '店舗管理' },
    { href: '/admin/admin/price-management', icon: <ChartBarIcon />, label: '料金管理' },
    { href: '/admin/admin/reservations', icon: <ChartBarIcon />, label: '予約管理' },
    { href: '/admin/admin/advertising', icon: <PresentationChartLineIcon />, label: '広告・集客' },
    { href: '/admin/admin/banners', icon: <SparklesIcon />, label: 'バナー管理' },
    { href: '/admin/admin/ai/copywriter', icon: <PencilIcon />, label: 'AI広告コピー生成' },
    { href: '/admin/admin/advertising/list', icon: <DocumentTextIcon />, label: '投稿済み広告' },
    { href: '/admin/admin/ai/generate-intro', icon: <SparklesIcon />, label: 'AI新人紹介生成' },
    { href: '/admin/admin/intro-list', icon: <DocumentTextIcon />, label: '投稿済み紹介' },
    {
      href: '/admin/admin/interview-reservations',
      icon: <UsersIcon />,
      label: '面接予約管理',
    },
    { href: '/admin/admin/hotels', icon: <BuildingOfficeIcon />, label: 'ホテル管理' },
    {
      href: '/admin/admin/hotels/masters',
      icon: <PresentationChartLineIcon />,
      label: 'ホテルマスタ管理',
    },
    {
      href: '/admin/admin/recruit-management',
      icon: <DocumentTextIcon />,
      label: '採用ページ管理',
    },
    {
      href: '/admin/admin/header-management',
      icon: <PencilIcon />,
      label: '共通ヘッダー管理',
    },
    {
      href: '/admin/admin/store-top-management',
      icon: <StorefrontIcon />,
      label: 'トップページ管理',
    },
    {
      href: '/admin/admin/page-request',
      icon: <PencilIcon />,
      label: 'ページ制作依頼',
    },
    {
      href: '/admin/admin/news-management',
      icon: <DocumentTextIcon />,
      label: 'ニュースページ管理',
    },
  ];

  return (
    <>
      {/* モバイル用オーバーレイ */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* サイドバー */}
      <aside
        className={`absolute z-40 flex h-full w-64 flex-shrink-0 flex-col bg-brand-secondary p-4 transition-transform duration-300 ease-in-out md:relative ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="mb-4 flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-white">OVERLORD</h1>
          <button onClick={() => setOpen(false)} className="text-brand-text-secondary md:hidden">
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
              badge={
                item.href === '/admin/admin/interview-reservations'
                  ? pendingCount
                  : item.href === '/admin/admin/reservations'
                    ? reservePendingCount
                    : undefined
              }
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
