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
  ChevronDownIcon,
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

interface NavItemConfig {
  href: string;
  icon: React.ReactNode;
  label: string;
  badgeKey?: string;
  target?: string;
}

// Navigation item component
const NavItem: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  setOpen: (isOpen: boolean) => void;
  badge?: number;
  target?: string;
}> = ({ href, icon, label, isActive, setOpen, badge, target }) => (
  <Link
    href={href}
    target={target}
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

  const navCategories: { title: string; items: NavItemConfig[] }[] = [
    {
      title: 'ホーム・分析',
      items: [
        { href: '/admin/admin', icon: <ChartBarIcon />, label: 'ダッシュボード' },
        {
          href: '/admin/admin/analytics',
          icon: <PresentationChartLineIcon />,
          label: 'データ分析',
        },
      ],
    },
    {
      title: 'キャスト・店舗管理',
      items: [
        { href: '/admin/admin/all-cast', icon: <UsersIcon />, label: '全キャスト管理' },
        {
          href: '/admin/admin/stores/casts',
          icon: <StorefrontIcon />,
          label: '店舗別キャスト管理',
        },
        { href: '/admin/admin/stores', icon: <BuildingStorefrontIcon />, label: '店舗管理' },
        { href: '/admin/admin/price-management', icon: <ChartBarIcon />, label: '料金管理' },
        {
          href: '/admin/admin/reservations',
          icon: <ChartBarIcon />,
          label: '予約管理',
          badgeKey: 'reservePendingCount',
        },
      ],
    },
    {
      title: '広告・AI生成',
      items: [
        {
          href: '/admin/admin/advertising',
          icon: <PresentationChartLineIcon />,
          label: '広告・集客',
        },
        { href: '/admin/admin/banners', icon: <SparklesIcon />, label: 'バナー管理' },
        { href: '/admin/admin/links-management', icon: <DocumentTextIcon />, label: 'パートナーリンク管理' },
        { href: '/store/fukuoka/links', icon: <PresentationChartLineIcon />, label: '公開リンク集（福岡）を表示', target: '_blank' },
        { href: '/admin/admin/ai/copywriter', icon: <PencilIcon />, label: 'AI広告コピー生成' },
        {
          href: '/admin/admin/advertising/list',
          icon: <DocumentTextIcon />,
          label: '投稿済み広告',
        },
        { href: '/admin/admin/ai/generate-intro', icon: <SparklesIcon />, label: 'AI新人紹介生成' },
        { href: '/admin/admin/intro-list', icon: <DocumentTextIcon />, label: '投稿済み紹介' },
        { href: '/admin/admin/auto-post', icon: <SparklesIcon />, label: 'AI自動投稿管理' },
      ],
    },
    {
      title: '求人・面接管理',
      items: [
        {
          href: '/admin/admin/interview-reservations',
          icon: <UsersIcon />,
          label: '面接予約管理',
          badgeKey: 'pendingCount',
        },
        {
          href: '/admin/admin/recruit-management',
          icon: <DocumentTextIcon />,
          label: '採用ページ管理',
        },
      ],
    },
    {
      title: 'ホテル管理',
      items: [
        { href: '/admin/admin/hotels', icon: <BuildingOfficeIcon />, label: 'ホテル管理' },
        {
          href: '/admin/admin/hotels/masters',
          icon: <PresentationChartLineIcon />,
          label: 'ホテルマスタ管理',
        },
      ],
    },
    {
      title: 'サイト設定・記事',
      items: [
        { href: '/admin/admin/header-management', icon: <PencilIcon />, label: '共通ヘッダー管理' },
        {
          href: '/admin/admin/store-top-management',
          icon: <StorefrontIcon />,
          label: 'トップページ管理',
        },
        {
          href: '/admin/admin/first-time-management',
          icon: <SparklesIcon />,
          label: '初めての方へページ管理',
        },
        { href: '/admin/admin/page-request', icon: <PencilIcon />, label: 'ページ制作依頼' },
        {
          href: '/admin/admin/news-management',
          icon: <DocumentTextIcon />,
          label: 'ニュースページ管理',
        },
        {
          href: '/admin/admin/media-management',
          icon: <DocumentTextIcon />,
          label: 'メディア記事管理',
        },
      ],
    },
  ];

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const activeCategory = navCategories.find((cat) =>
      cat.items.some((item) => item.href === pathname),
    );
    if (activeCategory) {
      setOpenCategories((prev) => ({ ...prev, [activeCategory.title]: true }));
    }
  }, [pathname]);

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

        <nav className="flex-1 space-y-4 overflow-y-auto pb-8 pr-2">
          {navCategories.map((category) => {
            const isOpen = openCategories[category.title];
            const toggleCategory = () =>
              setOpenCategories((prev) => ({ ...prev, [category.title]: !prev[category.title] }));

            return (
              <div key={category.title} className="space-y-1">
                <button
                  onClick={toggleCategory}
                  className="flex w-full items-center justify-between px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary transition-colors hover:text-white"
                >
                  <span>{category.title}</span>
                  <div
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <ChevronDownIcon />
                  </div>
                </button>
                <div
                  className={`space-y-1 overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {category.items.map((item) => {
                    const isActive = pathname === item.href;
                    const badgeValue =
                      item.badgeKey === 'pendingCount'
                        ? pendingCount
                        : item.badgeKey === 'reservePendingCount'
                          ? reservePendingCount
                          : undefined;
                    return (
                      <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        isActive={isActive}
                        setOpen={setOpen}
                        badge={badgeValue}
                        target={item.target}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
