'use client';

import Link from 'next/link';
import React from 'react';

interface AnchorNavProps {
  slug: string;
}

const AnchorNav: React.FC<AnchorNavProps> = ({ slug }) => {
  const navItems = [
    { label: 'ストロベリー\nボーイズとは', href: '#welcome' },
    { label: 'セラピスト\n一覧', href: '#cast-list' },
    { label: '出勤スケ\nジュール', href: '#cast-list' },
    { label: '施術の\n流れ', href: '#flow' },
    { label: 'ご利用\n料金', href: '#pricing' },
    { label: '禁止事項', href: '#forbidden' },
  ];

  return (
    <nav className="bg-white py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group flex aspect-square w-[100px] flex-col items-center justify-center rounded-full bg-[#FF0072] p-2 text-center shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-[#FF0072]/30 active:scale-95 md:w-[150px] lg:w-[170px]"
            >
              <span className="whitespace-pre-line text-[11px] font-black leading-[1.3] text-white md:text-lg lg:text-xl">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AnchorNav;
