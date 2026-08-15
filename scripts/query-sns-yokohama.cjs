const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const casts = await prisma.$queryRaw`SELECT c.name, c.sns_url FROM casts c JOIN cast_store_memberships m ON c.id = m.cast_id JOIN stores s ON m.store_id = s.id WHERE s.slug = 'yokohama' AND c.sns_url IS NOT NULL`;
  console.log(casts);
}
run().catch(console.error);
