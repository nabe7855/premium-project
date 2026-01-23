import { StoreProvider } from '@/contexts/StoreContext';
import { getStoreData } from '@/lib/store/store-data';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

interface StoreLayoutProps {
  children: ReactNode;
  params: {
    slug: string;
  };
}

export default function StoreLayout({ children, params }: StoreLayoutProps) {
  const store = getStoreData(params.slug);

  if (!store) {
    notFound();
  }

  return <StoreProvider store={store}>{children}</StoreProvider>;
}
