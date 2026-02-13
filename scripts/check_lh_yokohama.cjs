const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkYokohamaData() {
  console.log('--- Checking Kanagawa and Yokohama Data ---');

  // 1. 神奈川県の確認
  const kanagawa = await prisma.lh_prefectures.findFirst({
    where: {
      OR: [{ name: { contains: '神奈川' } }, { id: { contains: 'Kanagawa' } }],
    },
  });

  if (!kanagawa) {
    console.log('神奈川県が見つかりません。');
    return;
  }

  console.log(`Prefecture: ${kanagawa.name} (ID: "${kanagawa.id}")`);

  // 2. 市区町村の確認 (横浜を含むもの)
  const cities = await prisma.lh_cities.findMany({
    where: {
      prefecture_id: kanagawa.id,
      name: { contains: '横浜' },
    },
  });

  console.log(`\nCities found: ${cities.length}`);
  for (const city of cities) {
    console.log(`- ${city.name} (ID: "${city.id}")`);

    // 3. 各市のエリア確認
    const areas = await prisma.lh_areas.findMany({
      where: { city_id: city.id },
    });

    if (areas.length > 0) {
      console.log('  Areas:');
      areas.forEach((a) => console.log(`    - ${a.name} (ID: "${a.id}")`));
    } else {
      console.log('  (No areas registered)');
    }
  }

  // 4. すべての神奈川県の市を表示（念のため）
  const allCities = await prisma.lh_cities.findMany({
    where: { prefecture_id: kanagawa.id },
  });
  console.log(`\nAll cities in Kanagawa: ${allCities.length}`);
  // allCities.forEach(c => console.log(`- ${c.name} (${c.id})`)); // 多すぎるのでコメントアウト

  await prisma.$disconnect();
}

checkYokohamaData();
