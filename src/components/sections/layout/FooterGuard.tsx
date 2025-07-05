// src/components/FooterGuard.tsx
'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/sections/layout/Footer';

export default function FooterGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ フッターを非表示にしたいパス一覧
  const hideFooterPaths = ['/', '/age-check', '/store-select']; // ここにフッターを非表示にしたいパスを追加

  // ✅ 上記に含まれていない場合のみフッターを表示
  const showFooter = !hideFooterPaths.includes(pathname);

  return (
    <>
      {children}
      {showFooter && <Footer />} {/* フッターの表示/非表示を制御 */}
    </>
  );
}
