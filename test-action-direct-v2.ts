import { getStoreConfigsForAdmin } from './src/lib/actions/priceConfig';
import { prisma } from './src/lib/prisma';

async function test() {
  console.log('--- ACTION DIAGNOSTIC START ---');
  try {
    console.log('Checking database connection...');
    const dbCheck = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Database connection check:', dbCheck);

    console.log('Calling getStoreConfigsForAdmin...');
    const results = await getStoreConfigsForAdmin();
    console.log('Final results count:', results.length);

    if (results.length > 0) {
      results.forEach((r, i) => {
        console.log(`Result ${i}: ID=${r.id}, Name=${r.storeName}`);
      });
    } else {
      console.log('No stores returned from getStoreConfigsForAdmin.');
    }
  } catch (err) {
    console.error('ACTION DIAGNOSTIC ERROR:', err);
  } finally {
    await prisma.$disconnect();
    console.log('--- ACTION DIAGNOSTIC END ---');
  }
}

test();
