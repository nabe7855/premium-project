import CastDetail from '@/components/sections/casts/casts/CastDetail';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getCastProfileBySlug } from '@/lib/getCastProfileBySlug';
import { getCastQuestions } from '@/lib/getCastQuestions';
import { prisma } from '@/lib/prisma';
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
    description: `${cast.name} (${cast.age ?? '??'}歳) - ${cast.catchCopy ?? ''}。エロス係数 ${cast.sexinessLevel ?? 100}%。`,
    openGraph: {
      title: `${cast.name} - ${cast.catchCopy ?? ''}`,
      description: cast.catchCopy ?? '',
      images: cast.imageUrl ? [cast.imageUrl] : [],
    },
    alternates: {
      canonical: `https://www.sutoroberrys.jp/store/${params.slug}/cast/${params.cast}`,
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

  // ✅ DBから店舗IDを取得 (予約紐付け用)
  const dbStore = await prisma.store.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });

  // ✅ キャストのインタビュー記事URLを取得 (エリア名は英語・日本語どちらでも紐付けできるようにロバスト化)
  const areaQuery = params.slug === 'fukuoka' ? { in: ['fukuoka', '福岡'] } : params.slug === 'yokohama' ? { in: ['yokohama', '横浜'] } : params.slug;

  const castInterviewLinks = await prisma.interviewCastLink.findMany({
    where: {
      OR: [
        { cast_id: cast.id },
        { cast_name_romaji: params.cast },
        { cast_name: cast.name }
      ],
      interview_meta: {
        area: areaQuery
      }
    },
    include: {
      interview_meta: true
    },
    orderBy: { display_order: 'asc' }
  });

  // 各リンクから公開済み記事を展開し、カード表示用の配列を構築
  const interviewArticles: { title: string; url: string; thumbnailUrl: string | null; volNumber: number | null }[] = [];
  for (const link of castInterviewLinks) {
    if (!link.interview_meta) continue;
    const article = await prisma.mediaArticle.findUnique({
      where: { id: link.interview_meta.article_id, status: 'published' }
    });
    if (article) {
      const castSlug = link.cast_id || link.cast_name_romaji || 'unknown';
      interviewArticles.push({
        title: article.title,
        url: `/store/${params.slug}/interview/${castSlug}/${article.slug}`,
        thumbnailUrl: article.thumbnail_url,
        volNumber: link.interview_meta.vol_number,
      });
    }
  }

  // 後方互換用: 最初の公開記事のURLのみ単独で使う場合も引き続き対応
  const interviewUrl = interviewArticles.length > 0 ? interviewArticles[0].url : null;

  // ✅ デバッグログ
  console.log('🟢 CastDetailPage params:', params);
  console.log('🟢 CastDetailPage loaded cast:', cast);
  console.log('🟢 CastDetailPage interviewUrl:', interviewUrl);

  // ✅ 構造化データ (ProfilePage / Person)
  const castProfileSD = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: cast.name,
      description: cast.catchCopy,
      image: cast.imageUrl || cast.mainImageUrl,
      jobTitle: 'Cast',
      affiliation: {
        '@type': 'LocalBusiness',
        name: store?.name || 'Strawberry Boys',
      },
      url: `https://www.sutoroberrys.jp/store/${params.slug}/cast/${params.cast}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(castProfileSD) }}
      />

      {/* ✅ テンプレートに応じたヘッダーを表示 */}
      {store?.template === 'yokohama' ? (
        <>
          <YokohamaHeader config={topConfig.header} />
          <div className="h-[54px] md:h-[65px]" />
        </>
      ) : (
        <>
          <FukuokaHeader config={topConfig.header} />
          <div className="h-[54px] md:h-[65px]" />
        </>
      )}

      {/* ✅ storeSlug と storeId と interviewUrl と interviewArticles を渡す */}
      <CastDetail cast={cast} storeSlug={params.slug} storeId={dbStore?.id} interviewUrl={interviewUrl} interviewArticles={interviewArticles} />

      {/* ✅ テンプレートに応じたフッターを表示 */}
      {store?.template === 'yokohama' ? (
        <YokohamaFooter config={topConfig.footer} />
      ) : (
        <FukuokaFooter config={topConfig.footer} />
      )}
    </>
  );
}
