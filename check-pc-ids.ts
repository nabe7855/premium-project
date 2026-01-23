import { prisma } from './src/lib/prisma';

async function test() {
  try {
    const pc = await prisma.$queryRaw<any[]>`SELECT store_id FROM price_configs LIMIT 5`;
    const s = await prisma.$queryRaw<any[]>`SELECT id FROM stores LIMIT 5`;

    console.log(
      'Price Config store_ids:',
      pc.map((x) => x.store_id),
    );
    console.log(
      'Stores ids:',
      s.map((x) => x.id),
    );
  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
