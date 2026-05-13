import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.findUnique({
    where: { slug: 'fukuoka' }
  });
  if (store) {
    const history = await prisma.recruitPageHistory.findMany({
      where: { store_id: store.id },
      orderBy: { created_at: 'desc' },
      take: 5
    });
    
    history.forEach((h, i) => {
      console.log(`History ${i} at ${h.created_at}:`);
      console.log(JSON.stringify(h.config.trust?.locations, null, 2));
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
