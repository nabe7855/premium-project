import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 サンプル用に対象ホテルへ利用目的を紐付けます...');

  const purposes = await prisma.lh_purposes.findMany();
  const hotels = await prisma.lh_hotels.findMany({ take: 50 });

  if (purposes.length === 0) {
    console.error('利用目的データがありません。先に apply_tabelog_db.js を実行してください。');
    return;
  }

  let count = 0;
  for (const hotel of hotels) {
    // 各ホテルにランダムで1〜2個の目的を割り当てる
    const shuffled = [...purposes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 1);

    for (const p of selected) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO lh_hotel_purposes (hotel_id, purpose_id) 
        VALUES ($1::uuid, $2::uuid)
        ON CONFLICT DO NOTHING;
      `,
        hotel.id,
        p.id,
      );
      count++;
    }
  }

  console.log(`✅ ${hotels.length}件のホテルに計${count}件の目的を紐付けました。`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
