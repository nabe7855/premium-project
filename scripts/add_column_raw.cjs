const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addColumn() {
  console.log('--- 手動で price_details カラムを追加 ---');
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "lh_hotels" ADD COLUMN IF NOT EXISTS "price_details" JSONB;`,
    );
    console.log('成功しました！');
  } catch (e) {
    console.error('エラー:', e.message);
  }
}

addColumn().finally(() => prisma.$disconnect());
