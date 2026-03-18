import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const c = await prisma.$queryRawUnsafe(`SELECT id, name, is_active FROM casts WHERE name LIKE '%cast2%'`);
    console.log(JSON.stringify(c, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
