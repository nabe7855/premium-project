'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Phone, Clock, Mail, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const params = useParams();
  const storeSlug = (params?.slug as string) || 'tokyo'; // デフォルト"tokyo"でもOK

  return (
    <footer className="bg-neutral-800 text-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center">
              <span className="mr-2 text-2xl">🍓</span>
              <h3 className="font-serif text-xl font-bold">Strawberry Boys</h3>
            </div>
            <p className="mb-4 text-neutral-300">
              心とろける極上のひとときを、{storeSlug}からお届けします。
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Instagram"
                className="text-neutral-400 transition-colors duration-200 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-neutral-400 transition-colors duration-200 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">ナビゲーション</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/store/${storeSlug}/cast`}
                  className="text-neutral-300 transition-colors duration-200 hover:text-white"
                >
                  キャスト一覧
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${storeSlug}/guide/guide`}
                  className="text-neutral-300 transition-colors duration-200 hover:text-white"
                >
                  私たちについて
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${storeSlug}#contact`}
                  className="text-neutral-300 transition-colors duration-200 hover:text-white"
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${storeSlug}/guide/guide#prohibited`}
                  className="text-neutral-300 transition-colors duration-200 hover:text-white"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${storeSlug}/Announcement-information/policy`}
                  className="text-neutral-300 transition-colors duration-200 hover:text-white"
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">お問い合わせ</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-neutral-400" />
                <span className="text-neutral-300">東京都渋谷区XXX</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-neutral-400" />
                <span className="text-neutral-300">03-XXXX-XXXX</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-neutral-400" />
                <span className="text-neutral-300">info@strawberry-boys.tokyo</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-neutral-400" />
                <span className="text-neutral-300">18:00 - 24:00 (年中無休)</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">メルマガ登録</h4>
            <p className="mb-4 text-neutral-300">最新情報をお届けします</p>
            <div className="flex">
              <input
                type="email"
                placeholder="メールアドレス"
                className="flex-1 rounded-l-lg bg-neutral-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="メールアドレス"
              />
              <button className="rounded-r-lg bg-primary px-4 py-2 text-white transition-colors duration-200 hover:bg-primary/90">
                登録
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-700 pt-8 text-center">
          <p className="text-neutral-400">
            © 2024 Strawberry Boys {storeSlug}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
