import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.findUnique({
    where: { slug: 'fukuoka' },
    include: {
      recruit_pages: true
    }
  });
  if (store) {
    fs.writeFileSync('check_fukuoka.json', JSON.stringify(store.recruit_pages, null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
