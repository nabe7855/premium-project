// src/app/(protected)/layout.tsx
//import { cookies } from 'next/headers';
//import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  // const cookieStore = cookies();
  // const isVerified = cookieStore.get('isAgeVerified');

  // if (!isVerified || isVerified.value !== 'true') {
  //   redirect('/age-check'); // 年齢確認ページにリダイレクト
  // }

  return <>{children}</>;
}
