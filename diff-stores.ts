import * as fs from 'fs';
import { prisma } from './src/lib/prisma';

async function test() {
  try {
    const rawStores = await prisma.$queryRaw<any[]>`SELECT * FROM stores`;
    console.log('Raw stores count:', rawStores.length);

    const prismaStores = await prisma.store.findMany();
    console.log('Prisma stores count:', prismaStores.length);

    const rawIds = rawStores.map((s) => s.id);
    const prismaIds = prismaStores.map((s) => s.id);

    const missingIds = rawIds.filter((id) => !prismaIds.includes(id));
    console.log('IDs found in Raw but missing in Prisma:', missingIds);

    for (const id of rawIds) {
      try {
        const p = await prisma.store.findUnique({ where: { id } });
        console.log(`findUnique for ${id}: ${p ? 'FOUND' : 'NULL'}`);
      } catch (e: any) {
        console.log(`findUnique for ${id}: ERROR - ${e.message}`);
      }
    }

    fs.writeFileSync(
      'full_store_diff.json',
      JSON.stringify(
        {
          rawStores,
          prismaStores,
          missingIds,
        },
        null,
        2,
      ),
    );
  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
