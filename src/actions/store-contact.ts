'use server';

import { prisma } from '@/lib/prisma';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';

export async function getStoreContactData(slug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug },
      select: {
        name: true,
        phone: true,
        line_id: true,
        line_url: true,
        contact_email: true,
        notification_email: true,
      },
    });

    const configResult = await getStoreTopConfig(slug);

    // 優先順位: 1. Storeレコードのline_url, 2. Storeレコードのline_idから生成, 3. ConfigのlineIdから生成
    let finalLineUrl = store?.line_url || '';
    if (!finalLineUrl && store?.line_id) {
      finalLineUrl = `https://line.me/R/ti/p/${store.line_id.startsWith('@') ? store.line_id : '@' + store.line_id}`;
    }

    if (!finalLineUrl && configResult.success && configResult.config.lineId) {
      const lineId = configResult.config.lineId;
      finalLineUrl = `https://line.me/R/ti/p/${lineId.startsWith('@') ? lineId : '@' + lineId}`;
    }

    const email =
      store?.contact_email ||
      (configResult.success ? configResult.config.notificationEmail : store?.notification_email);

    return {
      success: true,
      data: {
        name: store?.name || '',
        phone: store?.phone || '',
        lineUrl: finalLineUrl || '',
        lineId: store?.line_id || (configResult.success ? configResult.config.lineId : '') || '',
        email: email || '',
      },
    };
  } catch (error) {
    console.error('Error in getStoreContactData:', error);
    return { success: false, error: 'Failed to fetch store contact data' };
  }
}
