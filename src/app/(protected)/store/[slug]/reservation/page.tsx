import ReservationPageClient from '@/components/reservation/ReservationPageClient';
import { getCastsByStore } from '@/lib/getCastsByStore';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

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

  // キャスト情報を取得
  const allCasts = await getCastsByStore(slug);
  const activeCasts = allCasts.filter((cast) => cast.isActive);

  return <ReservationPageClient store={store} casts={activeCasts} />;
}
