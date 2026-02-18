import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const pages = await prisma.recruitPage.findMany({
      include: {
        store: true,
      },
    });

    console.log('COUNT:', pages.length);
    for (const p of pages) {
      console.log(`STORE: ${p.store.slug}`);
      console.log(`KEY: ${p.section_key}`);
      console.log(`CONTENT: ${JSON.stringify(p.content).substring(0, 200)}`);
      console.log('---');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
