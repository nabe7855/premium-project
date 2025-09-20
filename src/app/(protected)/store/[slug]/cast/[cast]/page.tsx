import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCastBySlug } from '@/lib/getCastBySlug'; // ✅ Supabase版を使う
import CastDetail from '@/components/sections/casts/casts/CastDetail';
import Footer from '@/components/sections/casts/ui/Footer';
import { Cast } from '@/types/cast';

interface Props {
  params: { slug: string; cast: string };
}

// ✅ メタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cast = await getCastBySlug(params.cast);

  if (!cast) {
    return {
      title: 'キャストが見つかりません | Strawberry Boys',
      description: '指定されたキャストは存在しません。',
    };
  }

  return {
    title: `${cast.name} - ${cast.catchCopy ?? ''} | ${params.slug} | Strawberry Boys`,
    description: `${cast.name}(${cast.age ?? '??'}歳) - ${cast.catchCopy ?? ''}。セクシー度${cast.sexinessLevel ?? 0}。`,
    openGraph: {
      title: `${cast.name} - ${cast.catchCopy ?? ''}`,
      description: cast.catchCopy ?? '',
      images: [cast.mainImageUrl ?? cast.imageUrl ?? ''], // ✅ 画像URL
    },
  };
}

// ✅ ページ本体
export default async function CastDetailPage({ params }: Props) {
  const cast: Cast | null = await getCastBySlug(params.cast);

  if (!cast) {
    notFound();
  }

  return (
    <>
      <CastDetail cast={cast} />
      <Footer />
    </>
  );
}
