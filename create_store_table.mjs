import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Recreating tables via raw SQL...');
  try {
    // Drop existing to ensure clean state
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "public"."RecruitPage" CASCADE;`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "public"."Store" CASCADE;`);

    // Create Store
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "public"."Store" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
      );
    `);
    await prisma.$executeRawUnsafe(
      `CREATE UNIQUE INDEX "Store_slug_key" ON "public"."Store"("slug");`,
    );
    console.log('✅ Store table created.');

    // Create RecruitPage
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "public"."RecruitPage" (
        "id" TEXT NOT NULL,
        "store_id" TEXT NOT NULL,
        "section_key" TEXT NOT NULL,
        "content" JSONB NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "RecruitPage_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "RecruitPage_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(
      `CREATE UNIQUE INDEX "RecruitPage_store_id_section_key_key" ON "public"."RecruitPage"("store_id", "section_key");`,
    );
    console.log('✅ RecruitPage table created.');
  } catch (error) {
    console.error('❌ Failed to recreate tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
