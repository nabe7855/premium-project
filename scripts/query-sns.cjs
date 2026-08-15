const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const casts = await prisma.$queryRaw`SELECT id, name, slug, sns_url FROM casts WHERE sns_url IS NOT NULL`;
  console.log(casts);
}
run().catch(console.error);
