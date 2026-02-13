const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  console.log('--- 不適切なホテルデータのクリーンアップを開始 ---');

  // 「予約プラン一覧：」を含むホテルを検索
  const badHotels = await prisma.lh_hotels.findMany({
    where: {
      name: {
        contains: '予約プラン一覧：',
      },
    },
  });

  console.log(`削除対象のホテル数: ${badHotels.length}件`);

  for (const hotel of badHotels) {
    console.log(`削除中: ${hotel.name}`);

    // 関連データの削除 (カスケード設定がない場合に備えて)
    await prisma.lh_hotel_images.deleteMany({ where: { hotel_id: hotel.id } });
    await prisma.lh_hotel_amenities.deleteMany({ where: { hotel_id: hotel.id } });
    await prisma.lh_hotel_services.deleteMany({ where: { hotel_id: hotel.id } });
    await prisma.lh_reviews.deleteMany({ where: { hotel_id: hotel.id } });

    // 本体削除
    await prisma.lh_hotels.delete({
      where: { id: hotel.id },
    });
  }

  console.log('クリーンアップ完了。');
}

cleanup()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
