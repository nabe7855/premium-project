import { PrismaClient } from '@prisma/client';
import fs from 'fs';
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
    console.log(`Found ${history.length} history records.`);
    
    // Save all to json
    fs.writeFileSync('fukuoka_history.json', JSON.stringify(history, null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
