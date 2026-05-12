import InterviewArticleUI from '@/components/interview/InterviewArticleUI';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getInterviewArticleBySlug } from '@/lib/actions/interview';
import { getCastProfileBySlug } from '@/lib/getCastProfileBySlug';
import { prisma } from '@/lib/prisma';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string; // store area slug
    cast: string; // cast slug/id
    article: string; // interview article slug
  };
}

/**
 * SEOメタデータ生成
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { article } = await getInterviewArticleBySlug(params.article);

  if (!article) {
    return { title: '記事が見つかりません' };
  }

  const meta = article.interview_meta;
  const baseUrl = 'https://www.sutoroberrys.jp';
  // 新しいURL構造に合わせた正規URL
  const canonicalUrl = `${baseUrl}/store/${params.slug}/interview/${params.cast}/${params.article}`;

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    keywords: (meta as any)?.seo_keywords || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
      type: 'article',
      url: canonicalUrl,
    },
  };
}

/**
 * インタビュー記事詳細ページ（店舗主導・カテゴリ構造版）
 */
export default async function CastInterviewPage({ params }: Props) {
  // 1. 記事データの取得
  const { article, success } = await getInterviewArticleBySlug(params.article);
  if (!success || !article) {
    notFound();
  }

  // 2. キャストデータの取得
  const cast = await getCastProfileBySlug(params.cast);
  if (!cast) {
    notFound();
  }

  // 3. 店舗データの取得
  const store = getStoreData(params.slug);
  const topConfigResult = await getStoreTopConfig(params.slug);
  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  // 4. DBから店舗IDを取得
  const dbStore = await prisma.store.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });

  // 5. 構造化データの準備
  const interviewMeta = article.interview_meta;
  const structuredData = (interviewMeta as any)?.structured_data;

  return (
    <>
      {/* 構造化データの注入 */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* ヘッダー */}
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

      {/* 記事本体 */}
      <InterviewArticleUI
        article={article}
        interviewMeta={article.interview_meta as any}
        castLinks={ (article.interview_meta as any)?.cast_links }
      />

      {/* フッター */}
      {store?.template === 'yokohama' ? (
        <YokohamaFooter config={topConfig.footer} />
      ) : (
        <FukuokaFooter config={topConfig.footer} />
      )}
    </>
  );
}
