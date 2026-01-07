'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { slug } = useParams();
  const basePath = `/store/${slug}/hotel`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={basePath} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500">
              <span className="text-xl font-bold text-white">L</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              LoveStay <span className="text-rose-500">Japan</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href={basePath} className="text-sm font-medium text-gray-600 hover:text-rose-500">
              ホーム
            </Link>
            <Link href={basePath} className="text-sm font-medium text-gray-600 hover:text-rose-500">
              エリアから探す
            </Link>
            <Link href={basePath} className="text-sm font-medium text-gray-600 hover:text-rose-500">
              特集
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-rose-500 md:hidden">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold text-white">探す</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={basePath}>現在地から探す</Link>
                </li>
                <li>
                  <Link href={basePath}>都道府県から探す</Link>
                </li>
                <li>
                  <Link href={basePath}>駅から探す</Link>
                </li>
                <li>
                  <Link href={basePath}>こだわり条件から探す</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-white">サポート</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={basePath}>ヘルプ・お問い合わせ</Link>
                </li>
                <li>
                  <Link href={basePath}>掲載希望のオーナー様へ</Link>
                </li>
                <li>
                  <Link href={basePath}>利用規約</Link>
                </li>
                <li>
                  <Link href={basePath}>プライバシーポリシー</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-white">SNS</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    LINE
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500">
                  <span className="text-xl font-bold text-white">L</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">LoveStay Japan</span>
              </div>
              <p className="text-xs leading-relaxed">
                全国のラブホテルを網羅する日本最大級の検索・予約サイト。
                エリア、予算、こだわり設備からあなたにぴったりのホテルを。
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-xs">
            © 2024 LoveStay Japan All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
