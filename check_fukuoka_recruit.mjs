import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.findUnique({
    where: { slug: 'fukuoka' },
    include: {
      recruit_pages: true
    }
  });
  console.log("Store found:", !!store);
  if (store) {
    console.log("Recruit pages count:", store.recruit_pages.length);
    console.dir(store.recruit_pages, { depth: null });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
