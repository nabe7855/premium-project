import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCastProfileBySlug } from '@/lib/getCastProfileBySlug';
import { getCastQuestions } from '@/lib/getCastQuestions';
import CastDetail from '@/components/sections/casts/casts/CastDetail';
import Footer from '@/components/sections/casts/ui/Footer';
import { Cast } from '@/types/cast';

interface Props {
  params: { slug: string; cast: string };
}

// ✅ メタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cast = await getCastProfileBySlug(params.cast);

  if (!cast) {
    return {
      title: 'キャストが見つかりません | Strawberry Boys',
      description: '指定されたキャストは存在しません。',
    };
  }

  return {
    title: `${cast.name} - ${cast.catchCopy ?? ''} | ${params.slug} | Strawberry Boys`,
    description: `${cast.name} (${cast.age ?? '??'}歳) - ${cast.catchCopy ?? ''}。セクシー度 ${cast.sexinessLevel ?? 0}。`,
    openGraph: {
      title: `${cast.name} - ${cast.catchCopy ?? ''}`,
      description: cast.catchCopy ?? '',
      images: cast.imageUrl ? [cast.imageUrl] : [],
    },
  };
}

// ✅ ページ本体
export default async function CastDetailPage({ params }: Props) {
  let cast: Cast | null = await getCastProfileBySlug(params.cast);

  if (!cast) {
    notFound();
  }

  // ✅ Q&A を追加取得
  const castQuestions = await getCastQuestions(cast.id);
  cast = { ...cast, castQuestions };

  // ✅ デバッグログ
  console.log('🟢 CastDetailPage params:', params);
  console.log('🟢 CastDetailPage loaded cast:', cast);

  return (
    <>
      {/* ✅ storeSlug を渡す */}
      <CastDetail cast={cast} storeSlug={params.slug} />
      <Footer />
    </>
  );
}
