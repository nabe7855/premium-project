const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('Tables:', tables);
  
  // Let's also query a cast's galleries or photos if we can find any table like 'gallery_items' or similar.
  const columns = await prisma.$queryRawUnsafe("SELECT table_name, column_name FROM information_schema.columns WHERE column_name LIKE '%image%'");
  console.log('Columns with image:', columns);
}

main().catch(console.error).finally(() => prisma.$disconnect());
