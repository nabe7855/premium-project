// src/components/FooterGuard.tsx
'use client';

import Footer from '@/components/sections/layout/Footer';
import { usePathname } from 'next/navigation';

export default function FooterGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ フッターを非表示にしたいパスまたはプレフィックス
  const hideFooterPaths = ['/', '/age-check', '/store-select', '/test8'];
  const hideFooterPrefixes = ['/admin']; // admin配下すべて

  // 完全一致 or startsWith で判定
  const isHidden =
    hideFooterPaths.includes(pathname) ||
    hideFooterPrefixes.some((prefix) => pathname.startsWith(prefix));

  return (
    <>
      {children}
      {!isHidden && <Footer />}
    </>
  );
}
