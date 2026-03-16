import { StoreProvider } from '@/contexts/StoreContext';
import { prisma } from '@/lib/prisma';
import { getStoreData } from '@/lib/store/store-data';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

interface StoreLayoutProps {
  children: ReactNode;
  params: {
    slug: string;
  };
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const staticStore = getStoreData(params.slug);

  // データベースからMASTERデータを取得してマージ
  const dbStore = await prisma.store.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      business_hours: true, // DBにフィールドがある前提
      line_id: true,
      line_url: true,
      notification_email: true,
    },
  });

  const store = dbStore
    ? {
        ...staticStore,
        ...dbStore,
        name: dbStore.name || staticStore?.name || '',
        address: dbStore.address || staticStore?.address || '',
        city: (dbStore as any).city || staticStore?.city || '',
        businessHours: (dbStore as any).business_hours || staticStore?.businessHours || '',
        receptionHours: (dbStore as any).reception_hours || (staticStore as any)?.receptionHours || '',
        contact: {
          phone: dbStore.phone || staticStore?.contact.phone || '',
          line:
            dbStore.line_url ||
            ((dbStore as any).line_id
              ? `https://line.me/R/ti/p/${(dbStore as any).line_id.startsWith('@') ? (dbStore as any).line_id : '@' + (dbStore as any).line_id}`
              : staticStore?.contact.line || ''),
          email: dbStore.notification_email || staticStore?.contact.email || '',
        },
        slug: params.slug,
        id: dbStore.id,
      } as any
    : staticStore;

  if (!store) {
    notFound();
  }

  return <StoreProvider store={store as any}>{children}</StoreProvider>;
}
