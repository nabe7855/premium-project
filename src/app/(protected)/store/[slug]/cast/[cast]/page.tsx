import CastDetail from '@/components/sections/casts/casts/CastDetail';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import { getCastProfileBySlug } from '@/lib/getCastProfileBySlug';
import { getCastQuestions } from '@/lib/getCastQuestions';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { Cast } from '@/types/cast';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

  // ✅ 店舗データと設定を取得
  const store = getStoreData(params.slug);
  const topConfigResult = await getStoreTopConfig(params.slug);
  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  // ✅ デバッグログ
  console.log('🟢 CastDetailPage params:', params);
  console.log('🟢 CastDetailPage loaded cast:', cast);

  return (
    <>
      {/* ✅ storeSlug を渡す */}
      <CastDetail cast={cast} storeSlug={params.slug} />

      {/* ✅ テンプレートに応じたフッターを表示 */}
      {store?.template === 'yokohama' ? (
        <YokohamaFooter config={topConfig.footer} />
      ) : (
        <FukuokaFooter config={topConfig.footer} />
      )}
    </>
  );
}
