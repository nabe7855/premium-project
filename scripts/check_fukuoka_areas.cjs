const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFukuokaAreas() {
  try {
    // 福岡県のエリアを取得
    const areas = await prisma.area.findMany({
      where: {
        prefecture: {
          code: '40',
        },
      },
      include: {
        city: true,
        prefecture: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log('=== 福岡県の登録済みエリア ===\n');
    areas.forEach((a) => {
      console.log(`エリア名: ${a.name}`);
      console.log(`  ID: ${a.id}`);
      console.log(`  市区町村: ${a.city?.name || 'なし'} (${a.cityId || 'なし'})`);
      console.log(`  都道府県: ${a.prefecture?.name}`);
      console.log('');
    });

    console.log(`合計: ${areas.length}件のエリア\n`);

    // 市区町村も確認
    const cities = await prisma.city.findMany({
      where: {
        prefectureId: '40',
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log('=== 福岡県の登録済み市区町村 ===\n');
    cities.forEach((c) => {
      console.log(`- ${c.name} (ID: ${c.id})`);
    });

    console.log(`\n合計: ${cities.length}件の市区町村`);
  } catch (err) {
    console.error('エラー:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkFukuokaAreas();
