'use server';

import { prisma } from '@/lib/prisma';
import { DEFAULT_FIRST_TIME_CONFIG, FirstTimeConfig } from './firstTimeConfig';

export async function getFirstTimeConfig(storeSlug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true },
    });

    if (!store) {
      return { success: false, error: 'Store not found' };
    }

    const config = await prisma.firstTimeConfig.findUnique({
      where: { store_id: store.id },
    });

    if (!config) {
      return { success: true, config: JSON.parse(JSON.stringify(DEFAULT_FIRST_TIME_CONFIG)) };
    }

    // デープマージは一旦省略して単に返すか、必要なら実装
    return { success: true, config: config.config as unknown as FirstTimeConfig };
  } catch (error: any) {
    console.error(`[getFirstTimeConfig] ERROR for ${storeSlug}:`, error);
    return { success: false, error: error.message };
  }
}

export async function saveFirstTimeConfig(storeSlug: string, config: FirstTimeConfig) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true },
    });

    if (!store) {
      return { success: false, error: 'Store not found' };
    }

    await prisma.firstTimeConfig.upsert({
      where: { store_id: store.id },
      create: {
        store_id: store.id,
        config: config as any,
      },
      update: {
        config: config as any,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error(`[saveFirstTimeConfig] ERROR for ${storeSlug}:`, error);
    return { success: false, error: error.message };
  }
}
