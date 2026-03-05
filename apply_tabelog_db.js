import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 DB構造の更新を開始します...');

  try {
    // 1. lh_purposes テーブルの作成
    console.log('  - lh_purposes テーブル作成中...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS lh_purposes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // 2. lh_hotel_purposes テーブルの作成
    console.log('  - lh_hotel_purposes テーブル作成中...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS lh_hotel_purposes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        hotel_id UUID REFERENCES lh_hotels(id) ON DELETE CASCADE,
        purpose_id UUID REFERENCES lh_purposes(id) ON DELETE CASCADE
      );
    `);

    // 3. lh_hotel_amenities に ID を追加 (存在しない場合)
    console.log('  - lh_hotel_amenities の構造修正中...');
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE lh_hotel_amenities ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
      `);
    } catch (e) {
      console.log('    (ID追加済み、またはエラー: ' + e.message + ')');
    }

    // 4. lh_hotel_services に ID を追加 (存在しない場合)
    console.log('  - lh_hotel_services の構造修正中...');
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE lh_hotel_services ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
      `);
    } catch (e) {
      console.log('    (ID追加済み、またはエラー: ' + e.message + ')');
    }

    // 5. lh_reviews に詳細評価カラムを追加
    console.log('  - lh_reviews のカラム追加中...');
    await prisma.$executeRawUnsafe(
      `ALTER TABLE lh_reviews ADD COLUMN IF NOT EXISTS design INTEGER;`,
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE lh_reviews ADD COLUMN IF NOT EXISTS facilities INTEGER;`,
    );

    console.log('✅ DB構造の更新が完了しました。');

    // 6. 初期データの投入 (利用目的)
    console.log('🌱 初期データの投入中...');
    const purposes = [
      '女子会',
      '誕生日・記念日',
      '格安・休憩',
      '宿泊メイン',
      'サウナ・スパ',
      'プロジェクター・シアター',
      'ビジネス・一人旅',
    ];
    for (const p of purposes) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO lh_purposes (name) VALUES ($1) ON CONFLICT (name) DO NOTHING;
      `,
        p,
      );
    }
    console.log('✅ データの投入が完了しました。');
  } catch (error) {
    console.error('❌ 更新中にエラーが発生しました:', error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
