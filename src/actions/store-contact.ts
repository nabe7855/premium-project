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
        notification_email: true,
      },
    });

    const configResult = await getStoreTopConfig(slug);
    const lineUrl = configResult.success ? configResult.config.header.specialBanner?.link : '';
    const lineId = configResult.success ? configResult.config.lineId : '';
    const email = configResult.success
      ? configResult.config.notificationEmail
      : store?.notification_email;

    return {
      success: true,
      data: {
        name: store?.name || '',
        phone: store?.phone || '',
        lineUrl: lineUrl || '',
        lineId: lineId || '',
        email: email || '',
      },
    };
  } catch (error) {
    console.error('Error in getStoreContactData:', error);
    return { success: false, error: 'Failed to fetch store contact data' };
  }
}
