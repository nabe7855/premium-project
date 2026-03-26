'use client';

import Link from 'next/link';
import React from 'react';
import { AnchorNavSectionConfig } from '@/lib/store/firstTimeConfig';

interface AnchorNavProps {
  slug: string;
  config?: AnchorNavSectionConfig;
  isEditing?: boolean;
}

const AnchorNav: React.FC<AnchorNavProps> = ({ slug, config, isEditing }) => {
  if (config?.isVisible === false && !isEditing) return null;

  const navItems = [
    { label: 'ストロベリー\nボーイズとは', href: '#welcome' },
    { label: 'セラピスト\n一覧', href: '#cast-list' },
    { label: '施術の\n流れ', href: '#flow' },
    { label: 'ご利用\n料金', href: '#pricing' },
    { label: '禁止事項', href: '#forbidden' },
    { label: 'よくある\nご質問', href: '#faq' },
  ];

  return (
    <nav
      id="anchorNav"
      className={`bg-white py-8 md:py-16 ${config?.isVisible === false ? 'opacity-50 grayscale' : ''}`}
    >
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
