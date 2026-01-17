import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Adding missing columns to RecruitApplication...');

    await prisma.$executeRawUnsafe(
      `ALTER TABLE "RecruitApplication" ADD COLUMN IF NOT EXISTS "email" TEXT;`,
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "RecruitApplication" ADD COLUMN IF NOT EXISTS "address" TEXT;`,
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "RecruitApplication" ADD COLUMN IF NOT EXISTS "message" TEXT;`,
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "RecruitApplication" ADD COLUMN IF NOT EXISTS "details" JSONB;`,
    );

    console.log('Successfully updated RecruitApplication table.');

    // Check current columns
    const columns = await prisma.$queryRawUnsafe(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'RecruitApplication'
    `);
    console.log('Current columns:', columns);
  } catch (e) {
    console.error('Error updating DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
