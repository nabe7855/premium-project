import { prisma } from '../src/lib/prisma.ts';

async function checkPrices() {
  console.log('=== CHECKING STORE PRICES IN DB ===');

  const fukuokaStore = await prisma.store.findUnique({ where: { slug: 'fukuoka' } });
  const yokohamaStore = await prisma.store.findUnique({ where: { slug: 'yokohama' } });

  if (fukuokaStore) {
    const fPriceConfig = await prisma.priceConfig.findUnique({
      where: { store_id: fukuokaStore.id },
      include: {
        courses: {
          include: { plans: true },
          orderBy: { display_order: 'asc' }
        }
      }
    });
    console.log('\n--- FUKUOKA PRICE CONFIG ---');
    console.log(JSON.stringify(fPriceConfig, null, 2));
  }

  if (yokohamaStore) {
    const yPriceConfig = await prisma.priceConfig.findUnique({
      where: { store_id: yokohamaStore.id },
      include: {
        courses: {
          include: { plans: true },
          orderBy: { display_order: 'asc' }
        }
      }
    });
    console.log('\n--- YOKOHAMA PRICE CONFIG ---');
    console.log(JSON.stringify(yPriceConfig, null, 2));
  }
}

checkPrices().catch(console.error);
