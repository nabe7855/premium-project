import { Metadata } from 'next';
import { getPublishedPagesByStore, getPublishedPageBySlug } from '@/lib/actions/news-pages';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { notFound, redirect, RedirectType } from 'next/navigation';
import NewsDetailClient from './NewsDetailClient';
import React from 'react';

interface NewsDetailPageProps {
  params: {
    slug: string;
    newsSlug: string;
  };
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const JP_STORES = ['fukuoka', 'yokohama'];
  const { slug, newsSlug } = params;

  if (!JP_STORES.includes(slug)) {
    return { title: 'Not Found' };
  }

  const page = await getPublishedPageBySlug(newsSlug);
  if (!page || page.status !== 'published') {
    return { title: 'Not Found' };
  }

  const targetSlugs = page.targetStoreSlugs || [];
  const jpTargetSlugs = targetSlugs.filter((s) => JP_STORES.includes(s));

  if (jpTargetSlugs.length === 0) {
    return { title: 'Not Found' };
  }

  // アクセス中の店舗が.jp内の配信対象に含まれていればその店舗自身をcanonical、そうでなければ第一所属店舗
  const canonicalStoreSlug = jpTargetSlugs.includes(slug) ? slug : jpTargetSlugs[0];
  const storeData = await getStoreData(canonicalStoreSlug);

  if (!storeData) {
    return { title: 'Not Found' };
  }

  const publishedAt = page.storeSettings?.[canonicalStoreSlug]?.publishedAt || page.updatedAt;

  let plainTextDescription = '';
  if (page.sections && page.sections.length > 0) {
    const rawTexts: string[] = [];
    page.sections.forEach((sec) => {
      if (sec.content?.description) {
        rawTexts.push(sec.content.description);
      } else if (sec.content?.subtitle) {
        rawTexts.push(sec.content.subtitle);
      }
    });
    const combined = rawTexts
      .join(' ')
      .replace(/<[^>]*>/g, '')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
    if (combined) {
      plainTextDescription = combined.slice(0, 120);
    }
  }
  const metaDescription = plainTextDescription || page.title;

  return {
    title: `${page.title} | ${storeData.name}`,
    description: metaDescription,
    alternates: {
      canonical: `https://www.sutoroberrys.jp/store/${canonicalStoreSlug}/news/${newsSlug}`,
    },
    openGraph: {
      title: `${page.title} | ${storeData.name}`,
      description: metaDescription,
      images: page.thumbnailUrl ? [page.thumbnailUrl] : [],
      type: 'article',
      publishedTime: new Date(publishedAt).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | ${storeData.name}`,
      description: metaDescription,
      images: page.thumbnailUrl ? [page.thumbnailUrl] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const JP_STORES = ['fukuoka', 'yokohama'];
  const { slug, newsSlug } = params;

  if (!JP_STORES.includes(slug)) {
    notFound();
  }

  // 1. 店舗に限定せず全公開記事から検索
  const page = await getPublishedPageBySlug(newsSlug);

  if (!page || page.status !== 'published') {
    notFound();
  }

  // 2. 店舗アクセス権チェック (単一店舗限定の記事で、他店舗パスからアクセスされた場合は301リダイレクト)
  const targetSlugs = page.targetStoreSlugs || [];
  const jpTargetSlugs = targetSlugs.filter((s) => JP_STORES.includes(s));

  if (jpTargetSlugs.length === 0) {
    notFound();
  }

  if (!jpTargetSlugs.includes(slug)) {
    const primaryStoreSlug = jpTargetSlugs[0];
    redirect(`/store/${primaryStoreSlug}/news/${newsSlug}`, RedirectType.replace);
  }

  const [allPages, storeData, topConfigResult] = await Promise.all([
    getPublishedPagesByStore(slug),
    getStoreData(slug),
    getStoreTopConfig(slug),
  ]);

  if (!storeData) {
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
      '@id': `https://strawberryboys.jp/store/${slug}/news/${newsSlug}`,
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
