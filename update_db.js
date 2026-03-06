import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to add column business_hours to stores table...');
    // We check if it exists first
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stores' AND column_name='business_hours') THEN
          ALTER TABLE stores ADD COLUMN business_hours text;
        END IF;
      END
      $$;
    `);
    console.log('Column business_hours check/add successful!');
    process.exit(0);
  } catch (e) {
    console.error('Error updating DB:', e);
    process.exit(1);
  }
}

main();
