'use server';

import { PageData } from '@/components/admin/news/types';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabaseClient';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';

// Map Prisma model to PageData type
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
  };
};

export async function getAllPages(): Promise<PageData[]> {
  try {
    const records = await prisma.pageRequest.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return records.map(mapPrismaToPageData);
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return [];
  }
}

export async function getPublishedPagesByStore(storeSlug: string): Promise<PageData[]> {
  noStore();
  try {
    const allPublished = await prisma.pageRequest.findMany({
      where: {
        status: 'published',
      },
      orderBy: { updatedAt: 'desc' },
    });

    // 手動フィルタリング
    const records = allPublished.filter((record: any) => {
      const slugs = record.targetStoreSlugs as string[];
      return Array.isArray(slugs) && slugs.includes(storeSlug);
    });

    return records.map(mapPrismaToPageData);
  } catch (error) {
    console.error('Failed to fetch published pages by store:', error);
    return [];
  }
}

export async function getPage(id: string): Promise<PageData | null> {
  try {
    const record = await prisma.pageRequest.findUnique({
      where: { id },
    });
    if (!record) return null;
    return mapPrismaToPageData(record);
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return null;
  }
}

export async function createPage(data: Partial<PageData>): Promise<PageData | null> {
  try {
    const {
      title,
      slug,
      sections,
      status,
      thumbnailUrl,
      targetStoreSlugs,
      shortDescription,
      category,
      tags,
      showInSlider,
    } = data;

    const miscData = { shortDescription, category, tags, showInSlider };

    const record = await prisma.pageRequest.create({
      data: {
        title: title || '名称未設定',
        slug: slug || `news-${Date.now()}`,
        status: status || 'private',
        sections: sections ? JSON.parse(JSON.stringify(sections)) : [],
        thumbnailUrl: thumbnailUrl,
        targetStoreSlugs: targetStoreSlugs || [],
        referenceUrls: miscData,
      },
    });
    revalidatePath('/admin/news-management');
    revalidatePath('/store/[slug]', 'layout');
    revalidatePath('/', 'layout');
    return mapPrismaToPageData(record);
  } catch (error) {
    console.error('createPage Server Action Error:', error);
    return null;
  }
}

export async function updatePage(id: string, data: Partial<PageData>): Promise<PageData | null> {
  try {
    const {
      title,
      slug,
      sections,
      status,
      thumbnailUrl,
      targetStoreSlugs,
      shortDescription,
      category,
      tags,
      showInSlider,
    } = data;

    const existingRecord = await prisma.pageRequest.findUnique({
      where: { id },
      select: { referenceUrls: true },
    });
    const currentMisc = (existingRecord?.referenceUrls as any) || {};

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (sections !== undefined) updateData.sections = JSON.parse(JSON.stringify(sections));
    if (status !== undefined) updateData.status = status;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (targetStoreSlugs !== undefined) updateData.targetStoreSlugs = targetStoreSlugs;

    const newMisc = { ...currentMisc };
    if (shortDescription !== undefined) newMisc.shortDescription = shortDescription;
    if (category !== undefined) newMisc.category = category;
    if (tags !== undefined) newMisc.tags = tags;
    if (showInSlider !== undefined) newMisc.showInSlider = showInSlider;
    updateData.referenceUrls = newMisc;

    const record = await prisma.pageRequest.update({
      where: { id },
      data: updateData,
    });
    revalidatePath('/admin/news-management');
    revalidatePath('/store/[slug]', 'layout');
    revalidatePath('/', 'layout');
    return mapPrismaToPageData(record);
  } catch (error) {
    console.error('Failed to update page:', error);
    return null;
  }
}

export async function deletePage(id: string): Promise<boolean> {
  try {
    await prisma.pageRequest.delete({
      where: { id },
    });
    revalidatePath('/admin/news-management');
    revalidatePath('/store/[slug]', 'layout');
    revalidatePath('/', 'layout');
    return true;
  } catch (error) {
    console.error('Failed to delete page:', error);
    return false;
  }
}

export async function duplicatePage(id: string): Promise<PageData | null> {
  try {
    const original = await prisma.pageRequest.findUnique({
      where: { id },
    });
    if (!original) return null;

    const record = await prisma.pageRequest.create({
      data: {
        title: `${original.title} (コピー)`,
        slug: `${original.slug}-copy-${Date.now()}`,
        status: 'private',
        sections: original.sections || [],
        thumbnailUrl: original.thumbnailUrl,
        targetStoreSlugs: original.targetStoreSlugs || [],
        referenceUrls: original.referenceUrls || {},
      },
    });

    revalidatePath('/admin/news-management');
    return mapPrismaToPageData(record);
  } catch (error) {
    console.error('Failed to duplicate page:', error);
    return null;
  }
}

export async function uploadNewsImage(formData: FormData): Promise<string | null> {
  try {
    const file = formData.get('file') as File;
    const pageId = formData.get('pageId') as string;

    if (!file || !pageId) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `news-pages/${pageId}/${fileName}`;
    const bucketName = 'banners';

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    return null;
  }
}
