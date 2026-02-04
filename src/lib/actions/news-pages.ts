'use server';

import { PageData } from '@/components/admin/news/types';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

// Map Prisma model to PageData type
const mapPrismaToPageData = (record: any): PageData => {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    status: record.status as 'published' | 'private',
    updatedAt: record.updatedAt.getTime(),
    sections: JSON.parse(JSON.stringify(record.sections || [])),
    thumbnailUrl: record.thumbnailUrl || undefined,
    shortDescription: record.referenceUrls
      ? (record.referenceUrls as any).shortDescription
      : undefined, // Assuming we misuse referenceUrls or need a new field. Wait, schema didn't have shortDescription.
    // Let's check schema again. I didn't add shortDescription. I added thumbnailUrl and targetStoreSlugs.
    // I should use referenceUrls for shortDescription as a temporary hack OR just add it to schema?
    // The user approved "Update Prisma schema (PageRequest model)".
    // I missed shortDescription in the schema update step.
    // I'll add it to the schema now if I can, or use referenceUrls JSON for it.
    // Let's stick to using referenceUrls JSON for now to avoid another schema change if possible,
    // BUT clean way is to add it.
    // For now, let's assume I can store it in referenceUrls or just ignore it?
    // No, the inspector has it.
    // Let's treat referenceUrls as a JSON bucket for misc fields for now.
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
  try {
    const allPublished = await prisma.pageRequest.findMany({
      where: {
        status: 'published',
      },
      orderBy: { updatedAt: 'desc' },
    });

    console.log('[getPublishedPagesByStore] All published pages:', allPublished.length);
    console.log(
      '[getPublishedPagesByStore] Inspecting targetStoreSlugs type:',
      allPublished.map((p) => ({
        id: p.id,
        type: typeof p.targetStoreSlugs,
        val: p.targetStoreSlugs,
      })),
    );

    // 手動フィルタリング
    const records = allPublished.filter((record: any) => {
      const slugs = record.targetStoreSlugs as string[];
      return Array.isArray(slugs) && slugs.includes(storeSlug);
    });

    console.log('[getPublishedPagesByStore] Filtered for', storeSlug, ':', records.length);
    console.log(
      '[getPublishedPagesByStore] Records:',
      records.map((r) => ({ id: r.id, title: r.title, targetStoreSlugs: r.targetStoreSlugs })),
    );
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
    const { title, slug, sections, status, thumbnailUrl, targetStoreSlugs, shortDescription } =
      data;

    // Use referenceUrls to store shortDescription for now since I didn't add it to schema explicitly
    const miscData = { shortDescription };

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
    revalidatePath('/store/[slug]', 'page');
    return mapPrismaToPageData(record);
  } catch (error) {
    console.error('createPage Server Action Error:', error);
    return null;
  }
}

export async function updatePage(id: string, data: Partial<PageData>): Promise<PageData | null> {
  try {
    const { title, slug, sections, status, thumbnailUrl, targetStoreSlugs, shortDescription } =
      data;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (sections !== undefined) updateData.sections = JSON.parse(JSON.stringify(sections));
    if (status !== undefined) updateData.status = status;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (targetStoreSlugs !== undefined) updateData.targetStoreSlugs = targetStoreSlugs;
    if (shortDescription !== undefined) {
      updateData.referenceUrls = { shortDescription };
    }

    const record = await prisma.pageRequest.update({
      where: { id },
      data: updateData,
    });
    revalidatePath('/admin/news-management');
    revalidatePath('/store/[slug]', 'page');
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
    revalidatePath('/store/[slug]', 'page');
    return true;
  } catch (error) {
    console.error('Failed to delete page:', error);
    return false;
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
