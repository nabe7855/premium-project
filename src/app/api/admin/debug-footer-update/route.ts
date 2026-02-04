import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const newBanners = [
  {
    imageUrl: '/フッターバナー/ライン公式.jpg',
    link: 'https://line.me',
  },
  {
    imageUrl: '/フッターバナー/電話番号.jpg',
    link: 'tel:050-5212-5818',
  },
  {
    imageUrl: '/フッターバナー/セラピスト大募集.jpg',
    link: '/recruit',
  },
];

const newSmallBanners = [
  {
    imageUrl: '/フッターバナー/モニター募集.jpg',
    link: '/recruit/monitor',
  },
  {
    imageUrl: '/フッターバナー/講師募集.jpg',
    link: '/recruit/instructor',
  },
  { imageUrl: '/フッターバナー/レッドリボン.jpg', link: '/stop-aids' },
];

export async function GET() {
  try {
    const storesToUpdate = ['fukuoka', 'yokohama', 'tokyo', 'osaka', 'nagoya'];
    const results = [];

    for (const slug of storesToUpdate) {
      const store = await prisma.store.findUnique({
        where: { slug },
      });

      if (!store) {
        results.push({ slug, status: 'Store not found' });
        continue;
      }

      const configRecord = await prisma.storeTopConfig.findUnique({
        where: { store_id: store.id },
      });

      let currentConfig: any = {};

      if (configRecord && configRecord.config) {
        currentConfig = JSON.parse(JSON.stringify(configRecord.config));
      }

      // Ensure footer object exists
      if (!currentConfig.footer) currentConfig.footer = {};

      // Overwrite banners
      currentConfig.footer.banners = newBanners;
      currentConfig.footer.smallBanners = newSmallBanners;

      await prisma.storeTopConfig.upsert({
        where: { store_id: store.id },
        update: {
          config: currentConfig as any,
        },
        create: {
          store_id: store.id,
          config: currentConfig as any,
        },
      });

      results.push({ slug, status: 'Updated' });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 },
    );
  }
}
