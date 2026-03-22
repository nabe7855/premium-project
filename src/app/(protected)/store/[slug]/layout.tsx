import { StoreProvider } from '@/contexts/StoreContext';
import { prisma } from '@/lib/prisma';
import { getStoreData } from '@/lib/store/store-data';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import MobileStickyButton from '@/components/templates/store/common/MobileStickyButton';

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
      business_hours: true,
      reception_hours: true,
      line_id: true,
      line_url: true,
      notification_email: true,
    } as any,
  });

  // 設定も取得してフォールバックとして使用
  const { getStoreTopConfig } = await import('@/lib/store/getStoreTopConfig');
  const topConfigResult = await getStoreTopConfig(params.slug);
  const topConfig = topConfigResult.success ? topConfigResult.config : null;

  const store = dbStore
    ? {
        ...staticStore,
        ...dbStore,
        name: dbStore.name || staticStore?.name || '',
        address: dbStore.address || staticStore?.address || '',
        city: (dbStore as any).city || staticStore?.city || '',
        businessHours: dbStore.business_hours || topConfig?.footer?.shopInfo?.businessHours || staticStore?.businessHours || '',
        receptionHours: dbStore.reception_hours || topConfig?.footer?.shopInfo?.receptionHours || staticStore?.receptionHours || '',
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

  return (
    <StoreProvider store={store as any}>
      {children}
      <MobileStickyButton
        config={topConfig?.footer?.bottomNav}
        isVisible={topConfig?.footer?.isBottomNavVisible}
      />
    </StoreProvider>
  );
}
