'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface BannerData {
  id?: string;
  category: string;
  location: string;
  title: string;
  subtitle?: string | null;
  image_url: string;
  link_url?: string | null;
  display_order: number;
  is_active: boolean;
  metadata?: any;
}

export async function getBanners(category: string, location: string) {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        category,
        location,
        is_active: true,
      },
      orderBy: {
        display_order: 'asc',
      },
    });
    return { success: true, banners };
  } catch (error) {
    console.error('Error fetching banners:', error);
    return { success: false, error: 'バナーの取得に失敗しました' };
  }
}

export async function getAllBanners() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [
        { category: 'asc' },
        { location: 'asc' },
        { display_order: 'asc' },
      ],
    });
    return { success: true, banners };
  } catch (error) {
    const dbUrl = process.env.DATABASE_URL || 'undefined';
    const maskedUrl = dbUrl.substring(0, 30) + '...';
    console.error('CRITICAL: Error fetching all banners from Prisma:', error);
    console.error('DB URL (masked):', maskedUrl);
    
    let errorDetail = (error instanceof Error ? error.message : String(error));
    return { 
      success: false, 
      error: `バナー一覧の取得に失敗しました (DB: ${maskedUrl}): ` + errorDetail 
    };
  }
}

export async function upsertBanner(data: BannerData) {
  try {
    const { id, ...rest } = data;
    if (id) {
      await prisma.banner.update({
        where: { id },
        data: rest,
      });
    } else {
      await prisma.banner.create({
        data: rest as any,
      });
    }
    revalidatePath('/admin/admin/banners');
    revalidatePath('/amolab');
    revalidatePath('/ikeo');
    revalidatePath('/(protected)/sweetstay', 'page');
    return { success: true };
  } catch (error) {
    console.error('Error saving banner:', error);
    return { success: false, error: 'バナーの保存に失敗しました' };
  }
}

export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id },
    });
    revalidatePath('/admin/admin/banners');
    return { success: true };
  } catch (error) {
    console.error('Error deleting banner:', error);
    return { success: false, error: 'バナーの削除に失敗しました' };
  }
}
