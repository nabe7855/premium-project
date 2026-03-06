import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const stores = await prisma.store.findMany({ take: 1 });
    console.log('Stores sample:', JSON.stringify(stores, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Error fetching stores:', e);
    process.exit(1);
  }
}

main();
