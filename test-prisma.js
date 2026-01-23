import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Fetching store count...');
    const rawStores = await prisma.$queryRaw`SELECT id::text FROM stores`;
    console.log('Raw store count:', (rawStores as any[]).length);

    console.log('Testing stores one by one...');
    for (const r of (rawStores as any[])) {
       try {
         const s = await prisma.store.findUnique({
           where: { id: r.id },
           select: { id: true, slug: true }
         });
         console.log('Store OK:', s?.slug);
       } catch (err) {
         console.error('FAILED ON STORE ID:', r.id);
         console.error(err);
       }
    }

  } catch (err) {
    console.error('FATAL ERROR:');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
