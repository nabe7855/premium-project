const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- 横浜主要エリアのマスタ登録開始 (Upsert) ---');

  const cityId = 'Yokohama-shi';

  const areas = [
    { name: '横浜駅周辺', id: 'yokohama-station' },
    { name: '新横浜', id: 'shin-yokohama' },
    { name: '関内・伊勢佐木町', id: 'kannai' },
    { name: '元町・中華街', id: 'motomachi' },
    { name: '桜木町・みなとみらい', id: 'minatomirai' },
    { name: '戸塚・東戸塚', id: 'totsuka' },
    { name: '港北・都筑', id: 'kohoku' },
    { name: '金沢・磯子', id: 'kanazawa' },
    { name: '保土ヶ谷', id: 'hodogaya' },
    { name: '緑・青葉', id: 'midori' },
  ];

  for (const area of areas) {
    try {
      const result = await prisma.lh_areas.upsert({
        where: { id: area.id },
        update: {}, // 何もしない
        create: {
          id: area.id,
          name: area.name,
          city_id: cityId,
        },
      });
      console.log(`[UPSERT] 完了: ${result.name} (${result.id})`);
    } catch (e) {
      console.error(`[ERROR] 登録失敗: ${area.name} - ${e.message}`);
    }
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
