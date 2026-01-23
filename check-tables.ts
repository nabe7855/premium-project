import * as dotenv from 'dotenv';
import * as path from 'path';
import { prisma } from './src/lib/prisma';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function test() {
  try {
    const tables =
      await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables in public schema:', JSON.stringify(tables, null, 2));

    const storesCount = await prisma.store.count();
    console.log('Store count via Prisma:', storesCount);

    const storesRawCount = await prisma.$queryRaw`SELECT count(*) FROM stores`;
    console.log('Store count via raw SQL:', storesRawCount);
  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
