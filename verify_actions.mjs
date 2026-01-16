import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verifying data in "Store" table...');
  try {
    const stores = await prisma.store.findMany();
    console.log(`Found ${stores.length} stores.`);
    stores.forEach((s) => console.log(`- ${s.name} (${s.slug})`));

    console.log('\nTesting getRecruitPageConfig logic for "tokyo"...');
    const tokyoStore = await prisma.store.findUnique({
      where: { slug: 'tokyo' },
      include: { recruit_pages: true },
    });

    if (tokyoStore) {
      console.log('✅ Tokyo store found in DB.');
      console.log('Recruit pages count:', tokyoStore.recruit_pages.length);
      console.log('✅ Basic Prisma fetch works!');
    } else {
      console.error('❌ Tokyo store NOT found in DB.');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
