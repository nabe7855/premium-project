import { PrismaClient } from '@prisma/client';

const url = process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: url,
    },
  },
});

async function main() {
  console.log('Testing connection to:', url?.replace(/:[^:@]+@/, ':****@'));
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Connection successful:', result);
  } catch (error) {
    console.error('Connection failed!');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
