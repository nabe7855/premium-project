import ReservationPageClient from '@/components/reservation/ReservationPageClient';
import { getCastsByStore } from '@/lib/getCastsByStore';
import { prisma } from '@/lib/prisma';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { notFound } from 'next/navigation';

// 管理画面の変更を即反映させるためキャッシュを無効化
export const dynamic = 'force-dynamic';

export default async function ReservationPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 1. 各リクエストを定義（並列実行のため実行はまだしない）
  const storePromise = prisma.store.findUnique({
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

  const configPromise = getStoreTopConfig(slug);
  const castsPromise = getCastsByStore(slug);

  // 2. Promise.all で並列実行
  const [store, configResult, allCasts] = await Promise.all([
    storePromise,
    configPromise,
    castsPromise,
  ]);

  if (!store) {
    return notFound();
  }

  const storeConfig = configResult.success ? configResult.config : null;
  const activeCasts = allCasts.filter((cast) => cast.isActive);

  return <ReservationPageClient store={store} storeConfig={storeConfig} casts={activeCasts} />;
}
