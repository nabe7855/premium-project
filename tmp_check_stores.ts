import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const stores = await prisma.store.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      notification_email: true,
      recruit_email: true
    }
  });

  const recruitConfigs = await prisma.recruitPage.findMany({
    where: { section_key: 'general' },
    select: {
      store_id: true,
      content: true,
    }
  });

  const output = {
    stores,
    recruitConfigs
  };

  fs.writeFileSync('db_dump.json', JSON.stringify(output, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
