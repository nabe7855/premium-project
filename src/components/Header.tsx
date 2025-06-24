"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "ご案内", href: "/" },
    { label: "セラピスト一覧", href: "/cast-list" },
    { label: "出勤スケジュール", href: "/schedule" },
    { label: "口コミ", href: "/reviews" },
    { label: "写メ日記", href: "/diary" },
    { label: "動画", href: "/videos" },
    { label: "求人募集", href: "/recruit" },
    { label: "お問合わせ", href: "/contact" },
    { label: "ご予約", href: "/reserve" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-pink-50 text-pink-900 shadow-md border-b border-pink-100"> {/* ← 👈 修正済 */}
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* ロゴエリア */}
        <Link href="/store" className="flex items-center space-x-2" aria-label="店舗一覧へ移動">
        <span className="text-2xl">🍓</span>
        <h1 className="text-2xl font-extrabold tracking-wide text-pink-700">
            ストロベリーボーイズ
        </h1>
        </Link>

        {/* 電話番号（PCのみ） */}
        <div className="hidden md:flex items-center space-x-2">
          <Phone className="w-5 h-5 text-pink-600" />
          <a href="tel:05052125818" className="text-pink-800 font-medium hover:underline">
            050-5212-5818
          </a>
        </div>

        {/* スマホ用ハンバーガーボタン */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-7 h-7 text-pink-800" />
        </button>
      </div>

      {/* ナビゲーションメニュー */}
      <nav className={`bg-pink-100 md:bg-transparent md:block transition-all duration-300 ease-in-out ${isOpen ? "block" : "hidden"}`}>
        <ul className="flex flex-col md:flex-row md:items-center md:justify-center">
          {navItems.map((item) => (
            <li key={item.label} className="text-center md:px-4">
              <Link
                href={item.href}
                className="block py-2 px-4 text-sm font-semibold text-pink-700 hover:bg-pink-200 md:hover:bg-transparent md:hover:text-pink-900 transition rounded"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
