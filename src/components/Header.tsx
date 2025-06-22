"use client";

//import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Phone } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "ご案内", href: "/" },
    { label: "セラピスト一覧", href: "/cast" },
    { label: "出勤スケジュール", href: "/schedule" },
    { label: "口コミ", href: "/reviews" },
    { label: "写メ日記", href: "/diary" },
    { label: "動画", href: "/videos" },
    { label: "求人募集", href: "/recruit" },
    { label: "お問合わせ", href: "/contact" },
    { label: "ご予約", href: "/reserve" },
  ];

  return (
    <header className="bg-pink-100 text-pink-900 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        {/* ロゴ */}
        <div className="flex items-center space-x-2">
          <span>🍓</span>
          <h1 className="text-xl font-bold">ストロベリーボーイズ</h1>
        </div>

        {/* 電話番号（PC表示のみ） */}
        <div className="hidden md:flex items-center space-x-2">
          <Phone className="w-5 h-5 text-pink-500" />
          <span className="text-pink-800 font-medium">050-5212-5818</span>
        </div>

        {/* ハンバーガー（スマホ用） */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ナビゲーション */}
      <nav className="bg-pink-200 md:block">
        <ul
          className={`flex-col md:flex md:flex-row md:items-center md:justify-center transition-all duration-300 ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          {navItems.map((item) => (
            <li key={item.label} className="p-2 text-center hover:bg-pink-300">
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
