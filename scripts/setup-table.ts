import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating first_time_configs table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "first_time_configs" (
          "id" TEXT NOT NULL,
          "store_id" TEXT NOT NULL,
          "config" JSONB NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "first_time_configs_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('Creating unique index...');
    // Drop if exists to avoid error on retry
    try {
      await prisma.$executeRawUnsafe(
        `CREATE UNIQUE INDEX "first_time_configs_store_id_key" ON "first_time_configs"("store_id");`,
      );
    } catch (e) {
      console.log('Index might already exist, skipping...');
    }

    console.log('Adding foreign key...');
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "first_time_configs" 
        ADD CONSTRAINT "first_time_configs_store_id_fkey" 
        FOREIGN KEY ("store_id") REFERENCES "stores"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
      `);
    } catch (e) {
      console.log('Foreign key might already exist, skipping...');
    }

    console.log('Table set up successfully!');
  } catch (error: any) {
    console.error('Error setting up table:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
