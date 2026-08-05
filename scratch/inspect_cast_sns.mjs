import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const casts = await prisma.cast.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      sns: true,
      snsUrl: true,
    },
  });

  console.log(`--- Found ${casts.length} casts in DB ---`);
  casts.forEach((c) => {
    if (c.sns || c.snsUrl) {
      console.log(`Cast: [${c.name}] (slug: ${c.slug}, id: ${c.id})`);
      console.log(`  sns JSON:`, c.sns);
      console.log(`  snsUrl:`, c.snsUrl);
      console.log('-------------------------------------------');
    }
  });
}

main().finally(() => prisma.$disconnect());
