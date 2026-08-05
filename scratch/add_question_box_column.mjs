import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "question_box_url" TEXT;
    `);
    console.log('✅ Successfully added question_box_url column to casts table!');
  } catch (err) {
    console.error('❌ SQL Execution error:', err);
  }
}

main().finally(() => prisma.$disconnect());
