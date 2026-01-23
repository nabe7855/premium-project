import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local explicitly before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { getStoreConfigsForAdmin } from './src/lib/actions/priceConfig';
import { prisma } from './src/lib/prisma';

async function test() {
  console.log('--- ACTION DIAGNOSTIC START ---');
  console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

  try {
    console.log('Checking database connection...');
    const dbCheck = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Database connection check:', dbCheck);

    console.log('Calling getStoreConfigsForAdmin...');
    const results = await getStoreConfigsForAdmin();
    console.log('Final results count:', results.length);

    if (results.length > 0) {
      results.forEach((r, i) => {
        console.log(`Result ${i}: ID=${r.id}, Name=${r.storeName}, Courses=${r.courses.length}`);
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
