'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAllStoresFromDb() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, stores };
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    return { success: false, error: '店舗データの取得に失敗しました' };
  }
}

export async function updateStoreRedirect(
  id: string,
  useExternalUrl: boolean,
  externalUrl: string,
) {
  try {
    await prisma.store.update({
      where: { id },
      data: {
        use_external_url: useExternalUrl,
        external_url: externalUrl,
      },
    });
    revalidatePath('/admin/stores');
    return { success: true };
  } catch (error) {
    console.error('Failed to update store redirect:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}

export async function getInternalStores() {
  try {
    const stores = await prisma.store.findMany({
      where: {
        use_external_url: false,
        is_active: true,
      },
      select: {
        slug: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
    return { success: true, stores };
  } catch (error) {
    console.error('Failed to fetch internal stores:', error);
    return { success: false, error: '店舗データの取得に失敗しました' };
  }
}
