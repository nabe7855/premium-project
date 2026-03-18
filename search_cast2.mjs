import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function search() {
  try {
    const casts = await prisma.$queryRawUnsafe(`
      SELECT c.*, cs.status_id, sm.name as status_name 
      FROM casts c 
      LEFT JOIN cast_statuses cs ON c.id = cs.cast_id 
      LEFT JOIN status_master sm ON cs.status_id = sm.id 
      WHERE c.name LIKE '%cast2%' OR c.age = 28
    `);
    console.log(JSON.stringify(casts, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
search();
