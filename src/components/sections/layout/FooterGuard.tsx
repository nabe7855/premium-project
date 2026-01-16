// src/components/FooterGuard.tsx
'use client';

import Footer from '@/components/sections/layout/Footer';
import { usePathname } from 'next/navigation';

export default function FooterGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ フッターを非表示にしたいパスまたはプレフィックス
  const hideFooterPaths = ['/', '/age-check', '/store-select', '/test8'];
  const hideFooterPrefixes = ['/admin']; // admin配下すべて

  // ✅ /store/[slug]/recruit も非表示にするための正規表現チェック
  const isRecruitPage = /\/store\/[^/]+\/recruit$/.test(pathname);

  // 完全一致 or startsWith or Regex で判定
  const isHidden =
    hideFooterPaths.includes(pathname) ||
    hideFooterPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    isRecruitPage;

  return (
    <>
      {children}
      {!isHidden && <Footer />}
    </>
  );
}
