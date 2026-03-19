import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: 'fukuoka' },
      select: { id: true, slug: true }
    });
    
    if (!store) {
      console.log('Store not found');
      return;
    }

    const config = await prisma.firstTimeConfig.findUnique({
      where: { store_id: store.id },
    });

    if (!config) {
      console.log('Config not found');
      return;
    }

    console.log('--- DB Config Record ---');
    console.log(JSON.stringify(config.config, (key, value) => {
      // imageUrl 関連のフィールドのみ抜き出し
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
