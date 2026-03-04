import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe('ALTER TABLE casts ADD COLUMN IF NOT EXISTS ai_summary TEXT;');
  console.log('Column ai_summary added to casts table');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
