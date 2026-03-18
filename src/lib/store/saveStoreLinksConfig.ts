
'use server';
import { prisma } from '@/lib/prisma';
import { StoreLinksConfig } from './storeLinksConfig';
import { revalidatePath } from 'next/cache';

export async function saveStoreLinksConfig(storeSlug: string, config: StoreLinksConfig) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true }
    });

    if (!store) {
      return { success: false, error: 'Store not found' } as const;
    }

    await prisma.storeLinksConfig.upsert({
      where: { store_id: store.id },
      create: {
        store_id: store.id,
        config: config as any
      },
      update: {
        config: config as any
      }
    });

    revalidatePath(`/store/${storeSlug}/links`);
    return { success: true } as const;
  } catch (error) {
    console.error('[saveStoreLinksConfig] Error:', error);
    return { success: false, error: 'Failed to save links config' } as const;
  }
}
