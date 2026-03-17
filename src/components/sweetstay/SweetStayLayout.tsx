'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface SweetStayLayoutProps {
  children: React.ReactNode;
}

const SweetStayLayout: React.FC<SweetStayLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans antialiased">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-8">
            <Link href="/sweetstay" className="group flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 shadow-lg shadow-rose-200 transition-transform duration-300 group-hover:scale-110">
                <span className="text-xl font-black italic tracking-tighter text-white">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-rose-600">
                  Sweet Stay
                </span>
                <span className="-mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  by Strawberry Boys
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/sweetstay/area/kanagawa"
                className={`text-sm font-bold transition-colors hover:text-rose-500 ${pathname?.includes('/area') ? 'text-rose-500' : 'text-gray-500'}`}
              >
                エリアから探す
              </Link>
              <Link
                href="/sweetstay/guide"
                className={`text-sm font-bold transition-colors hover:text-rose-500 ${pathname?.includes('/guide') ? 'text-rose-500' : 'text-gray-500'}`}
              >
                ガイド
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/ikeo"
              className="text-xs font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-rose-500"
            >
              Ikeo
            </Link>
            <Link
              href="/amolab"
              className="text-xs font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-rose-500"
            >
              AmoLab
            </Link>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Premium Footer */}
      <footer className="border-t border-gray-100 bg-white py-16 text-gray-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-1">
              <Link href="/sweetstay" className="mb-6 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600">
                  <span className="text-xl font-bold italic text-white">S</span>
                </div>
                <span className="text-xl font-black tracking-tight text-gray-900">Sweet Stay</span>
              </Link>
              <p className="text-sm font-medium leading-relaxed text-gray-400">
                現役セラピストが厳選した「本当に使いやすい」ホテルのまとめメディア。
                大人の上質なライフスタイルと性を提案します。
              </p>
            </div>

            <div>
              <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-gray-900 underline decoration-rose-500/30 decoration-2 underline-offset-8">
                Explore
              </h3>
              <ul className="space-y-4 text-sm font-bold">
                <li>
                  <Link
                    href="/sweetstay/area/kanagawa/yokohama-shi"
                    className="transition-colors hover:text-rose-500"
                  >
                    横浜エリア
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sweetstay/area/fukuoka/fukuoka-shi"
                    className="transition-colors hover:text-rose-500"
                  >
                    福岡エリア
                  </Link>
                </li>
                <li>
                  <Link href="/sweetstay/search" className="transition-colors hover:text-rose-500">
                    すべてのエリア
                  </Link>
                </li>
                <li>
                  <Link href="/sweetstay/guide" className="transition-colors hover:text-rose-500">
                    ご利用ガイド
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-gray-900 underline decoration-rose-500/30 decoration-2 underline-offset-8">
                Our Brands
              </h3>
              <ul className="space-y-4 text-sm font-bold">
                <li>
                  <Link href="/ikeo" className="transition-colors hover:text-rose-500">
                    イケオ (Ikeo)
                  </Link>
                </li>
                <li>
                  <Link href="/amolab" className="transition-colors hover:text-rose-500">
                    アモラボ (AmoLab)
                  </Link>
                </li>
                <li>
                  <Link href="/" className="transition-colors hover:text-rose-500">
                    Strawberry Boys 本体
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-gray-900 underline decoration-rose-500/30 decoration-2 underline-offset-8">
                Contact
              </h3>
              <p className="mb-4 text-sm font-medium text-gray-400">
                掲載についてのお問い合わせやご不明な点はこちらから。
              </p>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-xl bg-gray-900 px-6 text-xs font-bold text-white transition-all hover:bg-rose-600 active:scale-95"
              >
                お問い合わせ
              </Link>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-50 pt-8 md:flex-row">
            <div className="text-xs font-bold text-gray-300">
              © 2024 Sweet Stay / Strawberry Boys. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-xs font-bold text-gray-300 hover:text-gray-500">
                利用規約
              </Link>
              <Link href="/privacy" className="text-xs font-bold text-gray-300 hover:text-gray-500">
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SweetStayLayout;
