import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stores = await prisma.store.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      recruit_email: true
    }
  });

  console.log('--- Stores in Database ---');
  stores.forEach(s => {
    console.log(`Slug: [${s.slug}] | Name: [${s.name}] | Recruit Email: [${s.recruit_email}]`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
