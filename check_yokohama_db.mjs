import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: 'yokohama' },
      select: { id: true, slug: true }
    });
    
    if (!store) {
      console.log('Yokohama store not found');
      return;
    }

    const config = await prisma.firstTimeConfig.findUnique({
      where: { store_id: store.id },
    });

    if (!config) {
      console.log('Yokohama config not found in DB');
      return;
    }

    console.log('--- Yokohama DB Config ---');
    console.log(JSON.stringify(config.config, (key, value) => {
      if (key === 'imageUrl') return value;
      if (typeof value === 'object' && value !== null) return value;
      return undefined;
    }, 2));

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
