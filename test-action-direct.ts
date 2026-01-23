import { getStoreConfigsForAdmin } from './src/lib/actions/priceConfig';
import { prisma } from './src/lib/prisma';

async function test() {
  console.log('--- ACTION DIAGNOSTIC START ---');
  try {
    const results = await getStoreConfigsForAdmin();
    console.log('Final results count:', results.length);
    if (results.length > 0) {
      console.log('First result ID:', results[0].id);
      console.log('First result courses count:', results[0].courses.length);
    }
  } catch (err) {
    console.error('ACTION DIAGNOSTIC ERROR:', err);
  } finally {
    await prisma.$disconnect();
    console.log('--- ACTION DIAGNOSTIC END ---');
  }
}

test();
