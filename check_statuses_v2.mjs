import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const statuses = await prisma.$queryRawUnsafe(`SELECT * FROM status_master`);
    console.log(JSON.stringify(statuses, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
