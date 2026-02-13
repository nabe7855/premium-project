const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFukuokaData() {
  try {
    // 福岡県の都道府県ID確認
    const fukuoka = await prisma.lh_prefectures.findFirst({
      where: {
        OR: [{ name: { contains: '福岡' } }, { id: '40' }],
      },
    });

    console.log('=== 福岡県情報 ===');
    console.log(fukuoka);
    console.log('');

    if (!fukuoka) {
      console.log('福岡県が見つかりません');
      return;
    }

    // 福岡県の市区町村
    const cities = await prisma.lh_cities.findMany({
      where: {
        prefecture_id: fukuoka.id,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log('=== 福岡県の市区町村 ===');
    cities.forEach((c) => {
      console.log(`- ${c.name} (ID: ${c.id})`);
    });
    console.log(`\n合計: ${cities.length}件\n`);

    // 福岡県のエリア（市区町村経由で取得）
    const cityIds = cities.map((c) => c.id);
    const areas = await prisma.lh_areas.findMany({
      where: {
        city_id: {
          in: cityIds,
        },
      },
      include: {
        city: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log('=== 福岡県のエリア ===');
    areas.forEach((a) => {
      console.log(`- ${a.name} (ID: ${a.id}, 市: ${a.city?.name})`);
    });
    console.log(`\n合計: ${areas.length}件\n`);

    // 既存のホテル数も確認
    const hotelCount = await prisma.lh_hotels.count({
      where: {
        prefecture_id: fukuoka.id,
      },
    });

    console.log(`=== 既存の福岡県ホテル数: ${hotelCount}件 ===`);
  } catch (err) {
    console.error('エラー:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkFukuokaData();
