const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = ['lh_hotel_amenities', 'lh_hotel_services', 'lh_hotel_purposes'];
  for (const t of tables) {
    const cols = await prisma.$queryRawUnsafe(
      `SELECT column_name FROM information_schema.columns WHERE table_name = '${t}'`,
    );
    console.log(`${t}:`, cols.map((c) => c.column_name).join(', '));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
