import ReservationPageClient from '@/components/reservation/ReservationPageClient';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getCastListMini } from '@/lib/getCastsByStore';
import { prisma } from '@/lib/prisma';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { notFound } from 'next/navigation';

// 管理画面の変更を即反映させるためキャッシュを無効化
export const dynamic = 'force-dynamic';

export default async function ReservationPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 1. 各リクエストを定義
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

  const configPromise = getStoreTopConfig(slug, { skipCasts: true });
  // 高速な軽量版クエリを使用し、Promiseを解決せずに下位コンポーネントへ渡す（ストリーミング）
  const castsPromise = getCastListMini(slug);

  // 2. Promise.all で並列実行（キャスト一覧は待たない）
  const [store, configResult] = await Promise.all([storePromise, configPromise]);

  if (!store) {
    return notFound();
  }

  const storeConfig = configResult.success ? configResult.config : null;

  return (
    <div className="flex min-h-screen flex-col">
      {slug === 'yokohama' && <YokohamaHeader config={storeConfig?.header} />}
      {slug === 'fukuoka' && <FukuokaHeader config={storeConfig?.header} />}

      <ReservationPageClient store={store} storeConfig={storeConfig} castsPromise={castsPromise} />

      {slug === 'yokohama' && <YokohamaFooter config={storeConfig?.footer} />}
      {slug === 'fukuoka' && <FukuokaFooter config={storeConfig?.footer} />}
    </div>
  );
}
