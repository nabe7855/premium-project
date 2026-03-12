import { getPublishedPagesByStore } from '@/lib/actions/news-pages';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { notFound } from 'next/navigation';
import NewsDetailClient from './NewsDetailClient';

interface NewsDetailPageProps {
  params: {
    slug: string;
    newsSlug: string;
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug, newsSlug } = params;

  const [allPages, storeData, topConfigResult] = await Promise.all([
    getPublishedPagesByStore(slug),
    getStoreData(slug),
    getStoreTopConfig(slug),
  ]);

  const page = allPages.find((p) => p.slug === newsSlug);

  if (!page || !storeData) {
    notFound();
  }

  const config = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  const template = storeData.template || 'common';

  // Navigation Logic
  const currentIndex = allPages.findIndex((p) => p.id === page.id);
  const prevPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : undefined;
  const nextPage = currentIndex > 0 ? allPages[currentIndex - 1] : undefined;

  // Recommended News
  const recommendedIds = config.recommendedNewsIds || [];
  const recommendedPages = allPages.filter((p) => recommendedIds.includes(p.id));

  // Related News (exclude current and recommended)
  const excludeIds = [page.id, ...recommendedPages.map((p) => p.id)];
  const relatedPages = allPages.filter((p) => !excludeIds.includes(p.id)).slice(0, 5);

  return (
    <NewsDetailClient
      page={page}
      storeSlug={slug}
      template={template}
      config={config}
      prevPage={prevPage}
      nextPage={nextPage}
      relatedPages={relatedPages}
      recommendedPages={recommendedPages}
    />
  );
}
