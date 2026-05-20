const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sai = await prisma.$queryRawUnsafe("SELECT * FROM casts WHERE name LIKE '%采%'");
  console.log('Sai record in Postgres:', sai);
}

main().catch(console.error).finally(() => prisma.$disconnect());
