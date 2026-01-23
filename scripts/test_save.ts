import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function main() {
  const slug = 'tokyo';
  console.log(`🧪 Testing save for slug: ${slug}`);

  const store = await prisma.store.findUnique({
    where: { slug },
  });

  if (!store) {
    console.log('❌ Store not found');
    return;
  }

  console.log(`✅ Store found: ${store.name} (${store.id})`);

  // Test upsert
  const testConfig = {
    hero: {
      mainHeading: 'Test Heading',
      subHeading: 'Test Sub',
      isVisible: true,
      heroImage: 'https://test.com/image.jpg',
    },
  };

  console.log('📝 Attempting upsert...');

  try {
    await prisma.recruitPage.upsert({
      where: {
        store_id_section_key: {
          store_id: store.id,
          section_key: 'hero',
        },
      },
      update: {
        content: testConfig.hero as any,
      },
      create: {
        store_id: store.id,
        section_key: 'hero',
        content: testConfig.hero as any,
      },
    });
    console.log('✅ Upsert successful');

    // Verify
    const pages = await prisma.recruitPage.findMany({
      where: { store_id: store.id },
    });
    console.log(`📄 Pages after upsert: ${pages.length}`);
    pages.forEach((p) => {
      console.log(`   - [${p.section_key}]`);
    });
  } catch (error: any) {
    console.error('❌ Upsert failed:', error.message);
    console.error('Code:', error.code);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
