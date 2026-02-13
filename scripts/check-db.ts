import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const storeCount = await prisma.store.count();
    console.log('Successfully connected to DB. Store count:', storeCount);

    // Check if table exists
    try {
      await (prisma as any).firstTimeConfig.findFirst();
      console.log('first_time_configs table exists.');
    } catch (e: any) {
      console.log('first_time_configs table does not exist or error:', e.message);
    }
  } catch (error) {
    console.error('Error connecting to DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
