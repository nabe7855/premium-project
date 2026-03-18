
'use server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_STORE_LINKS_CONFIG, StoreLinksConfig } from './storeLinksConfig';

export async function getStoreLinksConfig(storeSlug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true }
    });

    if (!store) {
      return { success: false, error: 'Store not found' };
    }

    const configRecord = await prisma.storeLinksConfig.findUnique({
      where: { store_id: store.id }
    });

    if (!configRecord) {
      return { 
        success: true, 
        config: DEFAULT_STORE_LINKS_CONFIG 
      };
    }

    return { 
      success: true, 
      config: configRecord.config as unknown as StoreLinksConfig 
    };
  } catch (error) {
    console.error('[getStoreLinksConfig] Error:', error);
    return { success: false, error: 'Failed to fetch links config' };
  }
}
