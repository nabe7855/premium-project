import ReservationPageClient from '@/components/reservation/ReservationPageClient';
import { getCastsByStore } from '@/lib/getCastsByStore';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

// 管理画面の変更を即反映させるためキャッシュを無効化
export const dynamic = 'force-dynamic';

export default async function ReservationPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 店舗情報を取得
  const store = await prisma.store.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      phone: true,
      line_id: true,
      line_url: true,
      notification_email: true,
    },
  });

  if (!store) {
    return notFound();
  }

  // 設定を取得（受付時間・営業時間のため）
  const { getStoreTopConfig } = await import('@/lib/store/getStoreTopConfig');
  const configResult = await getStoreTopConfig(slug);
  const storeConfig = configResult.success ? configResult.config : null;

  // キャスト情報を取得
  const allCasts = await getCastsByStore(slug);
  const activeCasts = allCasts.filter((cast) => cast.isActive);

  return <ReservationPageClient store={store} storeConfig={storeConfig} casts={activeCasts} />;
}
