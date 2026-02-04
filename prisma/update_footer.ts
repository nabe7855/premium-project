import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

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

async function main() {
  const storesToUpdate = ['fukuoka', 'yokohama', 'tokyo', 'osaka', 'nagoya'];
  console.log('Starting footer banner update script...');

  for (const slug of storesToUpdate) {
    console.log(`--- Processing ${slug} ---`);
    try {
      const store = await prisma.store.findUnique({
        where: { slug },
      });

      if (!store) {
        console.log(`Store ${slug} not found.`);
        continue;
      }

      // Fetch existing config or usage default structure if managing upsert manually
      const configRecord = await prisma.storeTopConfig.findUnique({
        where: { store_id: store.id },
      });

      let currentConfig: any = {};

      if (configRecord && configRecord.config) {
        currentConfig = JSON.parse(JSON.stringify(configRecord.config));
      } else {
        console.log('No existing config, initializing empty object.');
      }

      // Ensure footer object exists
      if (!currentConfig.footer) currentConfig.footer = {};

      // Overwrite banners
      currentConfig.footer.banners = newBanners;
      currentConfig.footer.smallBanners = newSmallBanners;

      // Also ensure shopInfo exists? No, keep existing.

      console.log(`updating store_id: ${store.id}`);

      // Perform Upsert (safest)
      await prisma.storeTopConfig.upsert({
        where: { store_id: store.id },
        update: {
          config: currentConfig,
        },
        create: {
          store_id: store.id,
          config: currentConfig,
        },
      });

      console.log(`SUCCESS: Updated ${slug}`);
    } catch (e: any) {
      console.log(`ERROR for ${slug}:`);
      console.log(JSON.stringify(e, null, 2));
    }
  }
}

main()
  .catch((e) => {
    console.error('FATAL:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
