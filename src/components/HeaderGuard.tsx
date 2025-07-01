// src/components/HeaderGuard.tsx
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

export default function HeaderGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeaderPaths = ['/age-check'];

  const showHeader = !hideHeaderPaths.includes(pathname);

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
