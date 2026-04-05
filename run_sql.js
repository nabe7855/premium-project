import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Direct SQL Execution: Adding missing columns...');

  try {
    // castsテーブルに不足しているカラムを直接追加
    // すでにある場合は無視されるので安全です
    await prisma.$executeRawUnsafe(`ALTER TABLE casts ADD COLUMN IF NOT EXISTS sns_url TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE casts ADD COLUMN IF NOT EXISTS slug TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE casts ADD COLUMN IF NOT EXISTS user_id UUID;`);
    
    // ユニーク制約の追加（既存のデータに重複がない場合のみ成功しますが、エラーになっても問題ありません）
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE casts ADD CONSTRAINT casts_slug_key UNIQUE (slug);`);
    } catch (e) {
      console.log('Notice: Unique constraint for slug already exists or could not be added (skipping).');
    }

    console.log('SUCCESS: Missing columns added directly via SQL.');
  } catch (error) {
    console.error('ERROR during direct SQL execution:', error);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
