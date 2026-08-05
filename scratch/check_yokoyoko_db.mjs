import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== SEARCHING DB FOR 横横 ===');
  
  // 1. Search in Stores table
  const stores = await prisma.store.findMany();
  console.log('Stores found:', stores.length);
  stores.forEach((st) => {
    if (st.name.includes('横横') || (st.displayName && st.displayName.includes('横横'))) {
      console.log('FOUND IN STORE:', st);
    }
  });

  // 2. Search in PageRequest
  const pages = await prisma.pageRequest.findMany();
  pages.forEach((p) => {
    if (p.title.includes('横横')) {
      console.log('FOUND IN PAGE_REQUEST:', p.id, p.title);
    }
  });

  // 3. Search in Recruiter / LandingPage config if exists
  const recConfigs = await prisma.$queryRaw`SELECT * FROM "Store" WHERE name LIKE '%横横%'`;
  console.log('Raw store query:', recConfigs);

}

main().catch(console.error).finally(() => prisma.$disconnect());
