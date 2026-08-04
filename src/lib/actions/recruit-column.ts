'use server';

import { PageData } from '@/components/admin/news/types';
import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

const mapPrismaToPageData = (record: any): PageData => {
  const misc = (record.referenceUrls as any) || {};
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    status: record.status as 'published' | 'private',
    updatedAt: record.updatedAt.getTime(),
    sections: JSON.parse(JSON.stringify(record.sections || [])),
    thumbnailUrl: record.thumbnailUrl || undefined,
    shortDescription: misc.shortDescription,
    category: misc.category,
    tags: misc.tags || [],
    showInSlider: misc.showInSlider,
    targetStoreSlugs: record.targetStoreSlugs || [],
    storeSettings: misc.storeSettings || {},
  };
};

/**
 * 公開済みの採用コラム一覧を取得
 */
export async function getPublishedRecruitColumns(): Promise<PageData[]> {
  noStore();
  try {
    const records = await prisma.pageRequest.findMany({
      where: {
        status: 'published',
      },
      orderBy: { updatedAt: 'desc' },
    });

    const columns = records.filter((r) => {
      const misc = (r.referenceUrls as any) || {};
      return misc.category === 'recruit-column';
    });

    return columns.map(mapPrismaToPageData);
  } catch (error) {
    console.error('Failed to fetch published recruit columns:', error);
    return [];
  }
}

/**
 * スラグから採用コラム記事を取得
 */
export async function getRecruitColumnBySlug(slug: string): Promise<PageData | null> {
  noStore();
  try {
    const record = await prisma.pageRequest.findFirst({
      where: {
        slug,
        status: 'published',
      },
    });

    if (!record) return null;
    const misc = (record.referenceUrls as any) || {};
    if (misc.category !== 'recruit-column') return null;

    return mapPrismaToPageData(record);
  } catch (error) {
    console.error('Failed to fetch recruit column by slug:', error);
    return null;
  }
}

/**
 * 管理画面用：すべての採用コラムを取得（下書き含む）
 */
export async function getAdminRecruitColumns(): Promise<PageData[]> {
  try {
    const records = await prisma.pageRequest.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    const columns = records.filter((r) => {
      const misc = (r.referenceUrls as any) || {};
      return misc.category === 'recruit-column';
    });

    return columns.map(mapPrismaToPageData);
  } catch (error) {
    console.error('Failed to fetch admin recruit columns:', error);
    return [];
  }
}
