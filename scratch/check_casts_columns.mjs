import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkCols() {
  const sample = await prisma.$queryRaw`SELECT * FROM casts LIMIT 1`;
  console.log('Casts columns:', Object.keys(sample[0]));
  await prisma.$disconnect();
}

checkCols();
