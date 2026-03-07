const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'lh_hotels'
    ORDER BY column_name
  `;
  const cols = result.map((c) => c.column_name);
  console.log('--- Columns in lh_hotels ---');
  for (const col of cols) {
    console.log(col);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
