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
      take: 2
    });
    
    if (history.length >= 2) {
      const goodConfig = history[1].config;
      console.log('Restoring config from:', history[1].created_at);
      
      for (const [sectionKey, content] of Object.entries(goodConfig)) {
        await prisma.recruitPage.upsert({
          where: {
            store_id_section_key: {
              store_id: store.id,
              section_key: sectionKey,
            },
          },
          update: {
            content: content,
          },
          create: {
            store_id: store.id,
            section_key: sectionKey,
            content: content,
          },
        });
      }
      console.log('Restoration complete.');
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
