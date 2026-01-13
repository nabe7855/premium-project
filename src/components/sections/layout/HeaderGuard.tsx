// src/components/HeaderGuard.tsx
'use client';

import Header from '@/components/sections/layout/Header';
import { usePathname } from 'next/navigation';

export default function HeaderGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ ヘッダーを非表示にしたいパス一覧
  const hideHeaderPaths = ['/', '/age-check', '/store-select', '/test8'];

  // ✅ 上記に含まれていない場合のみヘッダーを表示
  const showHeader = !hideHeaderPaths.includes(pathname);

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
