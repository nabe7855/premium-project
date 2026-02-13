const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    // 都道府県データ確認
    const prefs = await prisma.lh_prefectures.findMany({
      orderBy: { id: 'asc' },
    });
    console.log('=== 都道府県データ ===');
    prefs.forEach((p) => console.log(`${p.id}: ${p.name} (${p.count}件)`));
    console.log('');

    // 福岡県の市区町村
    const fukuokaCities = await prisma.lh_cities.findMany({
      where: {
        prefecture_id: { in: ['40', ' Fukuoka', 'Fukuoka'] },
      },
      orderBy: { name: 'asc' },
    });
    console.log('=== 福岡県の市区町村 ===');
    fukuokaCities.forEach((c) => console.log(`${c.id}: ${c.name} (${c.count}件)`));
    console.log(`合計: ${fukuokaCities.length}件\n`);

    // 福岡県のエリア
    const cityIds = fukuokaCities.map((c) => c.id);
    const fukuokaAreas = await prisma.lh_areas.findMany({
      where: {
        city_id: { in: cityIds },
      },
      orderBy: { name: 'asc' },
    });
    console.log('=== 福岡県のエリア ===');
    fukuokaAreas.forEach((a) => console.log(`${a.id}: ${a.name} (市ID: ${a.city_id})`));
    console.log(`合計: ${fukuokaAreas.length}件\n`);

    // 既存ホテル数
    const hotelCount = await prisma.lh_hotels.count();
    console.log(`=== 全ホテル数: ${hotelCount}件 ===`);
  } catch (err) {
    console.error('エラー:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
