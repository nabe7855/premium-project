const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'lh_hotel_amenities'
  `;
  console.log('Columns in lh_hotel_amenities:', result.map((c) => c.column_name).join(', '));

  const result2 = await prisma.$queryRaw`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'lh_hotels'
  `;
  console.log('Columns in lh_hotels:', result2.map((c) => c.column_name).join(', '));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
