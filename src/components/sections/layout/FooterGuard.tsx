// src/components/FooterGuard.tsx
'use client';

import Footer from '@/components/sections/layout/Footer';
import { usePathname } from 'next/navigation';

export default function FooterGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ フッターを非表示にしたいパスまたはプレフィックス
  const hideFooterPaths = ['/', '/age-check', '/store-select', '/test8', '/login'];
  const hideFooterPrefixes = [
    '/admin',
    '/amolab',
    '/ikeo',
    '/counseling',
    '/consent',
    '/survey',
    '/reflection',
    '/sweetstay',
    '/cast/',
  ]; // これらの配下すべてでフッター非表示

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
