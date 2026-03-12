import { PageData } from '@/components/admin/news/types';
import { prisma } from '@/lib/prisma';
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

async function getNewsPage(newsSlug: string, storeSlug: string) {
  const record = await prisma.pageRequest.findUnique({
    where: { slug: newsSlug },
  });

  if (!record || record.status !== 'published') {
    return null;
  }

  // 対象店舗に含まれているか確認
  const targetStoreSlugs = record.targetStoreSlugs as string[];
  if (!targetStoreSlugs.includes(storeSlug)) {
    return null;
  }

  const page: PageData = {
    id: record.id,
    slug: record.slug,
    title: record.title,
    status: record.status as 'published' | 'private',
    updatedAt: record.updatedAt.getTime(),
    sections: JSON.parse(JSON.stringify(record.sections || [])),
    thumbnailUrl: record.thumbnailUrl || undefined,
    targetStoreSlugs: targetStoreSlugs,
  };

  return page;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug, newsSlug } = params;

  const [page, storeData, topConfigResult] = await Promise.all([
    getNewsPage(newsSlug, slug),
    getStoreData(slug),
    getStoreTopConfig(slug),
  ]);

  if (!page || !storeData) {
    notFound();
  }

  const config = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  const template = storeData.template || 'common';

  return <NewsDetailClient page={page} storeSlug={slug} template={template} config={config} />;
}
