import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.reservations.count();
    console.log('Total reservations:', count);

    const sample = await (prisma.reservations as any).findMany({
      take: 5,
      select: {
        id: true,
        customer_name: true,
      },
    });
    console.log('Sample reservations:', JSON.stringify(sample, null, 2));
  } catch (error) {
    console.error('Error querying DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
