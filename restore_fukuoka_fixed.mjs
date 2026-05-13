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
      take: 10
    });
    
    // Find the most recent history that actually has trust.locations
    let goodHistory = null;
    for (let i = 0; i < history.length; i++) {
      if (history[i].config?.trust?.locations?.length > 0) {
        goodHistory = history[i];
        console.log(`Found good history at index ${i} with date ${goodHistory.created_at}`);
        break;
      }
    }

    if (goodHistory) {
      console.log('Restoring config from:', goodHistory.created_at);
      
      for (const [sectionKey, content] of Object.entries(goodHistory.config)) {
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
    } else {
      console.log('No history found with trust.locations');
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
