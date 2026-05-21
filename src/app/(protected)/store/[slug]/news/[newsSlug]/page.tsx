import { Metadata } from 'next';
import { getPublishedPagesByStore } from '@/lib/actions/news-pages';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { notFound } from 'next/navigation';
import NewsDetailClient from './NewsDetailClient';
import React from 'react';

interface NewsDetailPageProps {
  params: {
    slug: string;
    newsSlug: string;
  };
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug, newsSlug } = params;
  const allPages = await getPublishedPagesByStore(slug);
  const page = allPages.find((p) => p.slug === newsSlug);
  const storeData = await getStoreData(slug);

  if (!page || !storeData) {
    return {
      title: 'Not Found',
    };
  }

  const publishedAt = page.storeSettings?.[slug]?.publishedAt || page.updatedAt;

  return {
    title: `${page.title} | ${storeData.name}`,
    description: page.title,
    openGraph: {
      title: `${page.title} | ${storeData.name}`,
      description: page.title,
      images: page.thumbnailUrl ? [page.thumbnailUrl] : [],
      type: 'article',
      publishedTime: new Date(publishedAt).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | ${storeData.name}`,
      description: page.title,
      images: page.thumbnailUrl ? [page.thumbnailUrl] : [],
    },
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

  const publishedAt = page.storeSettings?.[slug]?.publishedAt || page.updatedAt;
  const modifiedAt = page.updatedAt;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: page.title,
    datePublished: new Date(publishedAt).toISOString(),
    dateModified: new Date(modifiedAt).toISOString(),
    image: page.thumbnailUrl ? [page.thumbnailUrl] : [],
    publisher: {
      '@type': 'Organization',
      name: storeData.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://${storeData.domain || 'strawberryboys.jp'}/store/${slug}/news/${newsSlug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  );
}
